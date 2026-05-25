import { router } from "expo-router";

import { useDriverMockState } from "@/components/driver/driver-mock-state";

export function useDriverNotificationsNavigation() {
  const { notificationsPromptSeen } = useDriverMockState();

  const openNotifications = () => {
    router.push(
      notificationsPromptSeen
        ? ("/(driver)/notifications" as never)
        : ("/(driver)/notifications-permission" as never)
    );
  };

  return { openNotifications };
}
