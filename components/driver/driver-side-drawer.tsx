import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DrawerEarningIcon from "@/assets/svgIcons/DrawerEarningIcon";
import DrawerHomeIcon from "@/assets/svgIcons/DrawerHomeIcon";
import DrawerNotificationsIcon from "@/assets/svgIcons/DrawerNotificationsIcon";
import DrawerRideHistoryIcon from "@/assets/svgIcons/DrawerRideHistoryIcon";
import DrawerSettingsIcon from "@/assets/svgIcons/DrawerSettingsIcon";
import { useDriverMockState } from "@/components/driver/driver-mock-state";
import { useDriverNotificationsNavigation } from "@/components/driver/use-driver-notifications";

const DRAWER_ITEMS = [
  { label: "Home", icon: DrawerHomeIcon, action: "home" as const },
  { label: "Notifications", icon: DrawerNotificationsIcon, action: "notifications" as const },
  { label: "Earning", icon: DrawerEarningIcon, action: "earning" as const },
  { label: "Ride History", icon: DrawerRideHistoryIcon, action: "history" as const },
  { label: "Settings", icon: DrawerSettingsIcon, action: "settings" as const },
];

type DriverSideDrawerProps = {
  visible: boolean;
  onClose: () => void;
};

export function DriverSideDrawer({ visible, onClose }: DriverSideDrawerProps) {
  const insets = useSafeAreaInsets();
  const { isOnline } = useDriverMockState();
  const { openNotifications } = useDriverNotificationsNavigation();
  const translateX = useRef(new Animated.Value(-280)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -280,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [translateX, visible]);

  const handleItemPress = (action: (typeof DRAWER_ITEMS)[number]["action"]) => {
    onClose();

    if (action === "home") {
      router.replace(isOnline ? "/(driver)/home-online" : "/(driver)/home");
      return;
    }

    if (action === "notifications") {
      openNotifications();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 flex-row">
        <Animated.View
          style={{
            width: "80%",
            transform: [{ translateX }],
            paddingTop: insets.top + 18,
            paddingBottom: insets.bottom + 20,
          }}
          className="bg-[#1A1A1A] px-5"
        >
          <View className="flex-1">
            <TouchableOpacity activeOpacity={0.84} onPress={onClose} className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-[#6EA8FF]">
                  <Text className="text-[24px]">🧑🏽‍✈️</Text>
                </View>

                <View className="flex-1">
                  <Text className="text-[17px] font-medium text-white">Welcome Kelvin</Text>
                  <View className="mt-1 flex-row items-center">
                    {[0, 1, 2, 3].map((star) => (
                      <Ionicons
                        key={star}
                        name="star"
                        size={12}
                        color="#00F27A"
                        style={{ marginRight: 2 }}
                      />
                    ))}
                    <Ionicons name="star" size={12} color="#5E5E5E" />
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <View className="mt-12">
              {DRAWER_ITEMS.map((item) => (
                <DrawerMenuItem
                  key={item.label}
                  label={item.label}
                  Icon={item.icon}
                  onPress={() => handleItemPress(item.action)}
                />
              ))}
            </View>
          </View>
        </Animated.View>

        <Pressable
          onPress={onClose}
          style={{ width: "20%", backgroundColor: "rgba(0,0,0,0.22)" }}
        />
      </View>
    </Modal>
  );
}

function DrawerMenuItem({
  label,
  Icon,
  onPress,
}: {
  label: string;
  Icon: () => React.JSX.Element;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.84}
      onPress={onPress}
      className="mb-10 flex-row items-center"
    >
      <View className="mr-6 h-7 w-7 items-center justify-center">
        <Icon />
      </View>
      <Text className="text-[17px] text-white">{label}</Text>
    </TouchableOpacity>
  );
}
