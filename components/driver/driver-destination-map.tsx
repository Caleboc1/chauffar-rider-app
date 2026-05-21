import { useEffect, useMemo, useRef, useState } from "react";
import { Easing, Platform, StyleSheet, Text, View } from "react-native";
import MapView, { AnimatedRegion, Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import DestinationMapMarker from "@/assets/svgIcons/DestinationMapMarker";
import DriverLocationMarker from "@/assets/svgIcons/DriverLocationMarker";
import type { DriverRideRequest } from "@/components/driver/driver-mock-state";
import { rideMapStyle } from "@/theme/ride-map-style";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type DriverDestinationMapProps = {
  request: DriverRideRequest;
  onArrival: () => void;
  onProgressChange: (progress: number) => void;
};

const TOTAL_TRAVEL_DURATION_MS = 120000;
const MIN_SEGMENT_DURATION_MS = 5000;
const MAX_SEGMENT_DURATION_MS = 25000;
const STEP_DURATION_MS = 120;
const STEPS_PER_SEGMENT = 10;

function getSegmentDistance(start: Coordinate, end: Coordinate) {
  const latitudeDistance = end.latitude - start.latitude;
  const longitudeDistance = end.longitude - start.longitude;
  return Math.sqrt(latitudeDistance ** 2 + longitudeDistance ** 2);
}

function getHeading(start: Coordinate, end: Coordinate) {
  const latitudeDelta = end.latitude - start.latitude;
  const longitudeDelta = end.longitude - start.longitude;
  const headingRadians = Math.atan2(longitudeDelta, latitudeDelta);
  return headingRadians * (180 / Math.PI);
}

function normalizeHeadingDelta(from: number, to: number) {
  const delta = ((to - from + 540) % 360) - 180;
  return from + delta;
}

function interpolateCoordinate(start: Coordinate, end: Coordinate, progress: number) {
  return {
    latitude: start.latitude + (end.latitude - start.latitude) * progress,
    longitude: start.longitude + (end.longitude - start.longitude) * progress,
  };
}

function densifyRouteCoordinates(routeCoordinates: Coordinate[]) {
  if (routeCoordinates.length <= 1) return routeCoordinates;
  const denseCoordinates: Coordinate[] = [routeCoordinates[0]];
  routeCoordinates.slice(0, -1).forEach((coordinate, index) => {
    const nextCoordinate = routeCoordinates[index + 1];
    for (let step = 1; step <= STEPS_PER_SEGMENT; step += 1) {
      denseCoordinates.push(interpolateCoordinate(coordinate, nextCoordinate, step / STEPS_PER_SEGMENT));
    }
  });
  return denseCoordinates;
}

export function DriverDestinationMap({
  request,
  onArrival,
  onProgressChange,
}: DriverDestinationMapProps) {
  const [completedPointIndex, setCompletedPointIndex] = useState(0);
  const [driverHeading, setDriverHeading] = useState(0);
  const routeCoordinates = useMemo(() => request.destinationPreview.routeCoordinates, [request.destinationPreview.routeCoordinates]);
  const denseRouteCoordinates = useMemo(() => densifyRouteCoordinates(routeCoordinates), [routeCoordinates]);
  const animatedCoordinate = useRef(
    new AnimatedRegion({
      latitude: routeCoordinates[0].latitude,
      longitude: routeCoordinates[0].longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  ).current;
  const markerRef = useRef<Marker>(null);
  const currentHeadingRef = useRef(0);

  const segmentDurations = useMemo(() => {
    const segmentDistances = routeCoordinates
      .slice(0, -1)
      .map((coordinate, index) => getSegmentDistance(coordinate, routeCoordinates[index + 1]));
    const totalDistance = segmentDistances.reduce((sum, distance) => sum + distance, 0) || 1;
    return segmentDistances.map((distance) => {
      const scaledDuration = (distance / totalDistance) * TOTAL_TRAVEL_DURATION_MS;
      return Math.min(MAX_SEGMENT_DURATION_MS, Math.max(MIN_SEGMENT_DURATION_MS, scaledDuration));
    });
  }, [routeCoordinates]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    animatedCoordinate.setValue({
      latitude: denseRouteCoordinates[0].latitude,
      longitude: denseRouteCoordinates[0].longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    });
    currentHeadingRef.current = 0;
    setDriverHeading(0);
    setCompletedPointIndex(0);
    onProgressChange(0);

    const runStep = (pointIndex: number) => {
      if (cancelled || pointIndex >= denseRouteCoordinates.length - 1) {
        onProgressChange(1);
        onArrival();
        return;
      }

      const start = denseRouteCoordinates[pointIndex];
      const end = denseRouteCoordinates[pointIndex + 1];
      const nextPoint = denseRouteCoordinates[Math.min(pointIndex + 2, denseRouteCoordinates.length - 1)];
      const parentSegmentIndex = Math.min(Math.floor(pointIndex / STEPS_PER_SEGMENT), segmentDurations.length - 1);
      const parentSegmentDuration = segmentDurations[parentSegmentIndex] ?? MIN_SEGMENT_DURATION_MS;
      const duration = Math.max(STEP_DURATION_MS, Math.round(parentSegmentDuration / STEPS_PER_SEGMENT));
      const segmentHeading = getHeading(start, end);
      const lookAheadHeading = nextPoint ? getHeading(end, nextPoint) : segmentHeading;
      const smoothedHeading = normalizeHeadingDelta(currentHeadingRef.current, segmentHeading);
      const finalHeading = normalizeHeadingDelta(smoothedHeading, lookAheadHeading);
      const displayHeading =
        pointIndex % STEPS_PER_SEGMENT >= STEPS_PER_SEGMENT - 3 ? finalHeading : smoothedHeading;

      currentHeadingRef.current = displayHeading;
      setDriverHeading(displayHeading);

      const nextCoordinate = { latitude: end.latitude, longitude: end.longitude };

      if (Platform.OS === "android" && markerRef.current && "animateMarkerToCoordinate" in markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(nextCoordinate, duration);
      } else {
        animatedCoordinate.timing({
          latitude: end.latitude,
          longitude: end.longitude,
          duration,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      }

      timeoutId = setTimeout(() => {
        if (cancelled) return;
        const nextPointIndex = pointIndex + 1;
        setCompletedPointIndex(nextPointIndex);
        onProgressChange(nextPointIndex / Math.max(denseRouteCoordinates.length - 1, 1));
        runStep(nextPointIndex);
      }, duration);
    };

    runStep(0);
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [animatedCoordinate, denseRouteCoordinates, onArrival, onProgressChange, segmentDurations]);

  const remainingRoute = useMemo(
    () => denseRouteCoordinates.slice(completedPointIndex),
    [completedPointIndex, denseRouteCoordinates]
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={request.destinationPreview.region}
        customMapStyle={rideMapStyle}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        showsCompass={false}
        showsBuildings={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
      >
        <Polyline coordinates={remainingRoute} strokeColors={["#27FF9E"]} strokeWidth={4} />
        <Marker.Animated
          ref={markerRef}
          coordinate={animatedCoordinate}
          anchor={{ x: 0.5, y: 0.5 }}
          flat
          rotation={driverHeading}
          tracksViewChanges={false}
        >
          <DriverLocationMarker />
        </Marker.Animated>
        <Marker coordinate={request.destinationPreview.destinationLocation} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
          <DestinationMapMarker />
        </Marker>
      </MapView>

      <View className="absolute" style={{ left: "53%", top: "55%" }}>
        <View className="rounded-[10px] bg-[#2C2C2C] px-2 py-1">
          <Text className="text-[12px] text-white">Stop 1</Text>
        </View>
      </View>
    </View>
  );
}
