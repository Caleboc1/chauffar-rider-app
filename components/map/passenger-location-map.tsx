import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import PassengerMarker from "@/assets/svgIcons/PassengerMarker";
import { rideMapStyle } from "@/theme/ride-map-style";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type PassengerLocationMapProps = {
  region: Coordinate & {
    latitudeDelta: number;
    longitudeDelta: number;
  };
  passengerLocation: Coordinate;
};

export function PassengerLocationMap({
  region,
  passengerLocation,
}: PassengerLocationMapProps) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        customMapStyle={rideMapStyle}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        showsCompass={false}
        showsBuildings={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
      >
        <Marker coordinate={passengerLocation} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
          <PassengerMarker />
        </Marker>
      </MapView>
    </View>
  );
}
