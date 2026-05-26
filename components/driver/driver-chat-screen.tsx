import { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { ChatScreen, type ChatMessage } from "@/components/chat/chat-screen";
import { useDriverMockState } from "@/components/driver/driver-mock-state";

const POPULATED_MESSAGES: ChatMessage[] = [
  { id: "1", sender: "agent", text: "venenatis.", timeAgo: "3 mins ago" },
  {
    id: "2",
    sender: "agent",
    text: "Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in non venenatis.",
    timeAgo: "3 mins ago",
  },
  { id: "3", sender: "agent", text: "Neque", timeAgo: "3 mins ago" },
  {
    id: "4",
    sender: "passenger",
    text: "Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros.",
    timeAgo: "3 mins ago",
  },
  { id: "5", sender: "agent", text: "egestas odio", timeAgo: "3 mins ago" },
  { id: "6", sender: "agent", text: "Neque egestas odio adipiscing sit duis mattis", timeAgo: "3 mins ago" },
];

export function DriverChatScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const { activeRide } = useDriverMockState();

  const callRouteParams = useMemo(
    () => ({
      mode: params.mode,
    }),
    [params.mode]
  );

  if (!activeRide) {
    return null;
  }

  return (
    <ChatScreen
      title={activeRide.riderName}
      subtitle="Rider"
      emptyStateTitle={`Start Conversation\nwith ${activeRide.riderName}`}
      initialMessages={params.mode === "active" ? POPULATED_MESSAGES : []}
      onCallPress={() =>
        router.push({
          pathname: "/(driver)/call" as never,
          params: callRouteParams,
        })
      }
    />
  );
}
