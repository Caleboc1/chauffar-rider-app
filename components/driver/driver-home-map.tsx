import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import DriverLocationMarker from "@/assets/svgIcons/DriverLocationMarker";
import { rideMapStyle } from "@/theme/ride-map-style";

const INITIAL_REGION = {
  latitude: 6.5244,
  longitude: 3.3792,
  latitudeDelta: 0.015,
  longitudeDelta: 0.012,
};

const DRIVER_LOCATION = {
  latitude: 6.5244,
  longitude: 3.3792,
};

export function DriverHomeMap() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        customMapStyle={rideMapStyle}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        showsCompass={false}
        showsBuildings={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
      >
        <Marker coordinate={DRIVER_LOCATION} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
          <DriverLocationMarker />
        </Marker>
      </MapView>
    </View>
  );
}
