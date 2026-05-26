import { startTransition, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ChatbgIcon from "@/assets/svgIcons/ChatbgIcon";
import DriverAvatar from "@/assets/svgIcons/DriverAvatar";

export type ChatMessage = {
  id: string;
  sender: "agent" | "passenger";
  text: string;
  timeAgo: string;
};

type ChatScreenProps = {
  title: string;
  subtitle: string;
  emptyStateTitle: string;
  initialMessages?: ChatMessage[];
  onCallPress?: () => void;
};

export function ChatScreen({
  title,
  subtitle,
  emptyStateTitle,
  initialMessages = [],
  onCallPress,
}: ChatScreenProps) {
  const insets = useSafeAreaInsets();
  const [draftMessage, setDraftMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const handleSendMessage = () => {
    const nextText = draftMessage.trim();
    if (!nextText) return;
    setDraftMessage("");
    startTransition(() => {
      setMessages((current) => [
        ...current,
        { id: `${Date.now()}`, sender: "passenger", text: nextText, timeAgo: "now" },
      ]);
    });
  };

  const contentStyle = useMemo(
    () => ({
      paddingHorizontal: 20,
      paddingTop: 28,
      paddingBottom: 24,
      flexGrow: 1,
      justifyContent: messages.length === 0 ? "center" : "flex-start",
    }),
    [messages.length]
  );

  return (
    <KeyboardAvoidingView className="flex-1 bg-[#0E0E0E]" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <StatusBar style="light" />

      <View className="border-b border-[#242424] px-5" style={{ paddingTop: insets.top + 14, paddingBottom: 16 }}>
        <View className="flex-row items-center">
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()} className="mr-3 h-10 w-10 items-center justify-center">
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View className="mr-3 overflow-hidden rounded-full">
            <DriverAvatar />
          </View>

          <View className="flex-1">
            <Text className="text-[22px] font-medium text-white">{title}</Text>
            <Text className="mt-0.5 text-[14px] text-[#9A9A9A]">{subtitle}</Text>
          </View>

          {onCallPress ? (
            <TouchableOpacity activeOpacity={0.85} onPress={onCallPress} className="h-16 w-16 items-center justify-center rounded-full bg-[#1FFF98]">
              <Ionicons name="call" size={24} color="#070707" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>
        {messages.length === 0 ? (
          <View className="items-center">
            <Text className="max-w-[240px] text-center text-[18px] leading-[30px] text-[#8F8F8F]">{emptyStateTitle}</Text>
            <View className="mt-12">
              <ChatbgIcon />
            </View>
          </View>
        ) : (
          messages.map((message) => {
            const isPassenger = message.sender === "passenger";
            return (
              <View key={message.id} className={`mb-3 ${isPassenger ? "items-end" : "items-start"}`}>
                <View className={`flex-row ${isPassenger ? "justify-end" : "justify-start"}`}>
                  {!isPassenger ? (
                    <View className="mr-3 mt-1 overflow-hidden rounded-full">
                      <DriverAvatar />
                    </View>
                  ) : null}
                  <View
                    className={`max-w-[82%] rounded-[14px] px-4 py-3 ${isPassenger ? "bg-[#1FFF98]" : "bg-[#343434]"}`}
                    style={{ borderTopRightRadius: isPassenger ? 0 : 14, borderTopLeftRadius: isPassenger ? 14 : 0 }}
                  >
                    <Text className={`text-[16px] leading-[28px] ${isPassenger ? "text-[#080808]" : "text-white"}`}>{message.text}</Text>
                    <Text className={`mt-2 text-right text-[14px] ${isPassenger ? "text-[#0F0F0F]" : "text-[#A3A3A3]"}`}>{message.timeAgo}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <View className="px-5" style={{ paddingBottom: insets.bottom + 18, paddingTop: 12 }}>
        <View className="flex-row items-center rounded-full bg-[#1B1B1B] px-5 py-3">
          <TouchableOpacity activeOpacity={0.85} className="mr-3">
            <Ionicons name="attach-outline" size={22} color="#F1F1F1" />
          </TouchableOpacity>
          <TextInput value={draftMessage} onChangeText={setDraftMessage} placeholder="Type a message" placeholderTextColor="#666666" className="flex-1 text-[16px] text-white" />
          <TouchableOpacity activeOpacity={0.85} onPress={handleSendMessage} className="ml-3 h-12 w-12 items-center justify-center rounded-full bg-[#1FFF98]">
            <Ionicons name="send" size={20} color="#070707" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
