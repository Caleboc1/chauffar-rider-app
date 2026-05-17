import type { ReactNode } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, ClipPath, Defs, G, Mask, Path, Rect } from "react-native-svg";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";

type ReviewStatusScreenProps = {
  title: string;
  description: string;
  icon: ReactNode;
  nextDisabled?: boolean;
  onContinue?: () => void;
  timelineStatus: "pending" | "approved" | "rejected";
  detailStatus: "pending" | "approved" | "rejected";
};

export function ReviewStatusScreen({
  title,
  description,
  icon,
  nextDisabled = false,
  onContinue,
  timelineStatus,
  detailStatus,
}: ReviewStatusScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#0B0B0B]">
      <StatusBar style="light" />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 18,
          paddingHorizontal: 20,
          paddingBottom: 140,
        }}
      >
        <View className="items-center pt-8">
          {icon}
          <Text className="mt-8 text-center text-[22px] font-semibold text-white">{title}</Text>
          <Text className="mt-2 text-center text-[14px] leading-7 text-[#9A9A9A]">
            {description}
          </Text>
        </View>

        <View className="mt-8 h-px bg-[#1A1A1A]" />

        <Text className="mb-5 mt-5 text-[16px] font-semibold text-white">What happens next?</Text>
        <Timeline status={timelineStatus} />

        <SubmittedDetails status={detailStatus} />
        <ImportantNotice />
        <HelpSection />
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 px-5"
        style={{
          backgroundColor: "#0B0B0B",
          paddingTop: 14,
          paddingBottom: Math.max(insets.bottom, 22),
        }}
      >
        <AuthPrimaryButton
          label="Continue to Login"
          onPress={onContinue ?? (() => {})}
          disabled={nextDisabled}
          className="h-[58px] w-full rounded-full items-center justify-center"
        />
      </View>
    </View>
  );
}

function Timeline({ status }: { status: "pending" | "approved" | "rejected" }) {
  return (
    <View className="mb-8 pl-2">
      <TimelineRow
        label="Information submitted"
        color="#27FF9E"
        icon={<TimelineDoneIcon />}
        lineColor={status === "pending" ? "#F9C700" : "#27FF9E"}
      />
      <TimelineRow
        label="Documents under review"
        color={status === "pending" ? "#F9C700" : "#27FF9E"}
        icon={status === "pending" ? <TimelinePendingIcon color="#F9C700" /> : <TimelineDoneIcon />}
        lineColor={status === "pending" ? "#FFFFFF" : "#27FF9E"}
      />
      <TimelineRow
        label="Final approval"
        color={status === "approved" ? "#27FF9E" : status === "rejected" ? "#FF3B4E" : "#FFFFFF"}
        icon={
          status === "approved" ? (
            <TimelineDoneIcon />
          ) : status === "rejected" ? (
            <TimelineRejectedIcon />
          ) : (
            <TimelinePendingIcon />
          )
        }
      />
    </View>
  );
}

function TimelineRow({
  label,
  color,
  icon,
  lineColor,
}: {
  label: string;
  color: string;
  icon: ReactNode;
  lineColor?: string;
}) {
  return (
    <View className="flex-row">
      <View className="mr-3 items-center">
        <View className="h-5 w-5 items-center justify-center">{icon}</View>
        {lineColor ? <View className="mt-1 h-8 w-px" style={{ backgroundColor: lineColor }} /> : null}
      </View>
      <Text className="pt-[1px] text-[14px]" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

function SubmittedDetails({ status }: { status: "pending" | "approved" | "rejected" }) {
  const details =
    status === "rejected"
      ? [
          { label: "Personal Information", tone: "rejected", trailing: "needs update" },
          { label: "Face Verification", tone: "warning", trailing: "under review" },
          { label: "Vehicle Information", tone: "rejected", trailing: "needs update" },
        ]
      : [
          { label: "Personal Information", tone: "approved", trailing: "submitted" },
          { label: "Face Verification", tone: "approved", trailing: "submitted" },
          { label: "Vehicle Information", tone: "approved", trailing: "submitted" },
        ];

  return (
    <View className="mb-5 rounded-[18px] bg-[#101010] px-4 py-4">
      <Text className="mb-4 text-[16px] font-semibold text-white">Submitted Details</Text>

      {details.map((item, index) => (
        <View key={item.label} className={index < details.length - 1 ? "mb-5" : ""}>
          <View className="flex-row items-center">
            <View className="mr-2">{getDetailIcon(item.tone)}</View>
            <Text
              className="text-[14px]"
              style={{ color: item.tone === "rejected" ? "#BDBDBD" : "#EDEDED" }}
            >
              {item.label}
            </Text>
            <Text className="text-[14px] text-[#8A8A8A]">
              {" "}
              -{" "}
              <Text
                className="text-[14px]"
                style={{
                  color:
                    item.tone === "pending"
                      ? "#D8B03C"
                      : item.tone === "rejected"
                        ? "#7E7E7E"
                        : "#9A9A9A",
                  textDecorationLine: item.tone === "rejected" ? "line-through" : "none",
                }}
              >
                {item.trailing}
              </Text>
            </Text>
          </View>
        </View>
      ))}

      <View className="mb-4 h-px bg-[#2A2A2A]" />

      <View className="flex-row items-center">
        <View className="mr-2">
          <InformationLockedIcon />
        </View>
        <Text className="text-[14px] text-[#E90418]">Editing is locked during the review</Text>
      </View>
    </View>
  );
}

function ImportantNotice() {
  return (
    <View className="mb-5 flex-row rounded-[16px] border border-[#2A1757] bg-[#101010] px-3.5 py-3.5">
      <View className="mr-3 mt-0.5">
        <ImportantNoticeIcon />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-white">Important notice</Text>
        <Text className="mt-1 text-[13px] leading-5 text-[#9C9C9C]">
          We verify all driver information to ensure safety and trust on our platform
        </Text>
      </View>
    </View>
  );
}

function HelpSection() {
  return (
    <View>
      <Text className="mb-4 text-[16px] font-semibold text-white">Need help?</Text>
      <SupportRow icon="chatbubble-ellipses" label="Chat with Support" />
      <SupportRow icon="call" label="Call Support" />
    </View>
  );
}

function SupportRow({ icon, label }: { icon: "chatbubble-ellipses" | "call"; label: string }) {
  return (
    <TouchableOpacity activeOpacity={0.82} className="mb-4 flex-row items-center">
      {icon === "chatbubble-ellipses" ? <ChatSupportIcon /> : <CallSupportIcon />}
      <Text className="ml-3 flex-1 text-[15px] text-[#EDEDED]">{label}</Text>
      <ChevronForwardIcon />
    </TouchableOpacity>
  );
}

function getDetailIcon(tone: string) {
  if (tone === "approved") {
    return <TimelineDoneIcon />;
  }

  if (tone === "pending") {
    return <TimelineHourglassIcon />;
  }

  if (tone === "warning") {
    return <TimelineDoneIcon color="#FFB327" checkColor="#0B0B0B" />;
  }

  return <TimelineRejectedIcon />;
}

function TimelineDoneIcon({
  color = "#27FF9E",
  checkColor = "#06120C",
}: {
  color?: string;
  checkColor?: string;
}) {
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <Circle cx="8" cy="8" r="7" fill={color} />
      <Path
        d="M4.8 8.2L7 10.4L11.2 6.2"
        stroke={checkColor}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TimelineHourglassIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 3H17M7 21H17M8 3V8C8 9.06087 8.42143 10.0783 9.17157 10.8284L10.5858 12.2426C11.3668 13.0237 11.3668 14.2901 10.5858 15.0711L9.17157 16.4853C8.42143 17.2354 8 18.2529 8 19.3137V21M16 3V8C16 9.06087 15.5786 10.0783 14.8284 10.8284L13.4142 12.2426C12.6332 13.0237 12.6332 14.2901 13.4142 15.0711L14.8284 16.4853C15.5786 17.2354 16 18.2529 16 19.3137V21"
        stroke="#F9C700"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TimelinePendingIcon({ color = "#FFFFFF" }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <Circle cx="8" cy="8" r="6.25" stroke={color} strokeWidth={1.5} />
      <Path d="M8 4.8V8L10.2 9.4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function TimelineRejectedIcon({ small = false }: { small?: boolean }) {
  const size = small ? 14 : 16;
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Circle cx="8" cy="8" r="7" fill="#FF3347" />
      <Path d="M5.3 5.3L10.7 10.7M10.7 5.3L5.3 10.7" stroke="#101010" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function VerificationPendingHeroIcon() {
  return (
    <View className="h-[118px] w-[118px] items-center justify-center rounded-full bg-[#FFE15D1A]">
      <View className="h-[82px] w-[82px] items-center justify-center rounded-full bg-[#FFE15D1A]">
        <HourglassHeroSvg />
      </View>
    </View>
  );
}

export function VerificationApprovedHeroIcon() {
  return (
    <View className="h-[118px] w-[118px] items-center justify-center rounded-full bg-[#5DFFEC1A]">
      <View className="h-[82px] w-[82px] items-center justify-center rounded-full bg-[#5DFFFF1A]">
        <ApprovedHeroSvg />
      </View>
    </View>
  );
}

export function VerificationRejectedHeroIcon() {
  return (
    <View className="h-[118px] w-[118px] items-center justify-center rounded-full bg-[#FF5D5D1A]">
      <View className="h-[82px] w-[82px] items-center justify-center rounded-full bg-[#FF5D5D1A]">
        <RejectedHeroSvg />
      </View>
    </View>
  );
}

function HourglassHeroSvg() {
  return (
    <Svg width={24} height={40} viewBox="0 0 24 40" fill="none">
      <Path
        d="M2 4C2 2.89543 2.89543 2 4 2L20 2C21.1046 2 22 2.89543 22 4L22 9.54756C22 10.0922 21.7779 10.6132 21.3851 10.9903L13.3851 18.6703C12.6111 19.4133 11.3889 19.4133 10.6149 18.6703L2.61494 10.9903C2.22208 10.6132 2 10.0922 2 9.54757L2 4Z"
        fill="#F9C700"
      />
      <Path
        d="M22 40C23.1046 40 24 39.1046 24 38V28.0059C24 28.0026 23.9974 28 23.9941 28C23.9889 28 23.9863 27.9937 23.99 27.99L23.9941 27.9859C23.9974 27.9826 23.9974 27.9774 23.9941 27.9741L17.4178 21.4142C16.635 20.6335 16.6342 19.3658 17.416 18.584L23.9941 12.0059C23.9974 12.0026 23.9974 11.9974 23.9941 11.9941L23.99 11.99C23.9863 11.9863 23.9889 11.98 23.9941 11.98C23.9974 11.98 24 11.9774 24 11.9741V2C24 0.895428 23.1046 0 22 0H2C0.89543 0 0 0.895432 0 2V11.9741C0 11.9774 0.0026226 11.98 0.00585747 11.98C0.011076 11.98 0.0136909 11.9863 0.0100002 11.99L0.00585747 11.9941C0.0026226 11.9974 0.0026226 12.0026 0.00585747 12.0059L6.58402 18.584C7.36576 19.3658 7.36496 20.6335 6.58224 21.4142L0.00587082 27.9741C0.00263023 27.9774 0.00262642 27.9826 0.00586319 27.9859L0.0100002 27.99C0.0136909 27.9937 0.011076 28 0.00585747 28C0.0026226 28 0 28.0026 0 28.0059V38C0 39.1046 0.895432 40 2 40H22ZM4.58578 11.5858C4.21071 11.2107 4 10.702 4 10.1716V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V10.1716C20 10.702 19.7893 11.2107 19.4142 11.5858L13.4142 17.5858C12.6332 18.3668 11.3668 18.3668 10.5858 17.5858L4.58578 11.5858ZM10.5858 22.4142C11.3668 21.6332 12.6332 21.6332 13.4142 22.4142L19.4142 28.4142C19.7893 28.7893 20 29.298 20 29.8284V34C20 35.1046 19.1046 36 18 36H6C4.89543 36 4 35.1046 4 34V29.8284C4 29.298 4.21071 28.7893 4.58579 28.4142L10.5858 22.4142Z"
        fill="#F9C700"
      />
    </Svg>
  );
}

function ApprovedHeroSvg() {
  return (
    <Svg width={44} height={42} viewBox="0 0 44 42" fill="none">
      <Path
        d="M44 20.92L39.12 15.36L39.8 8L32.58 6.36L28.8 0L22 2.92L15.2 0L11.42 6.36L4.2 7.98L4.88 15.34L0 20.92L4.88 26.48L4.2 33.86L11.42 35.5L15.2 41.86L22 38.92L28.8 41.84L32.58 35.48L39.8 33.84L39.12 26.48L44 20.92ZM18 30.92L10 22.92L12.82 20.1L18 25.26L31.18 12.08L34 14.92L18 30.92Z"
        fill="#27FF9E"
      />
    </Svg>
  );
}

function RejectedHeroSvg() {
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
      <G clipPath="url(#clip0_1694_6928)">
        <Mask
          id="mask0_1694_6928"
          maskUnits="userSpaceOnUse"
          x="9"
          y="5"
          width="43"
          height="47"
        >
          <Path
            d="M27 6L38 17V40C38 41.1 37.1 42 36 42H12C10.9 42 10 41.1 10 40V8C10 6.9 10.9 6 12 6H27Z"
            fill="white"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M28 7V16H37L28 7Z"
            fill="black"
            stroke="black"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M27 6L38 17" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M14 26H34" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M14 34H28" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M37 22C45.28 22 52 28.72 52 37C52 45.28 45.28 52 37 52C28.72 52 22 45.28 22 37C22 28.72 28.72 22 37 22Z" fill="black" />
        </Mask>
        <G mask="url(#mask0_1694_6928)">
          <Path d="M0 0H48V48H0V0Z" fill="#D00416" />
        </G>
        <Path d="M37 28C41.96 28 46 32.04 46 37C46 41.96 41.96 46 37 46C32.04 46 28 41.96 28 37C28 32.04 32.04 28 37 28Z" stroke="#D00416" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M32 32L42 42" stroke="#D00416" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </G>
      <Defs>
        <ClipPath id="clip0_1694_6928">
          <Rect width="48" height="48" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

function ImportantNoticeIcon() {
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.212 4.15983C23.461 4.05309 23.7291 3.99805 24 3.99805C24.2709 3.99805 24.539 4.05309 24.788 4.15983L37.576 9.64183C38.2957 9.95034 38.909 10.4633 39.3399 11.1171C39.7708 11.7709 40.0003 12.5368 40 13.3198V27.0398C39.9998 29.5077 39.3472 31.9316 38.1084 34.066C36.8696 36.2004 35.0887 37.9694 32.946 39.1938L24.992 43.7378C24.6899 43.9104 24.3479 44.0012 24 44.0012C23.6521 44.0012 23.3101 43.9104 23.008 43.7378L15.054 39.1938C12.9107 37.9691 11.1294 36.1994 9.89058 34.0643C8.65177 31.9291 7.99954 29.5043 8 27.0358V13.3198C8.00009 12.5371 8.22979 11.7717 8.66066 11.1183C9.09153 10.4649 9.70463 9.9522 10.424 9.64383L23.212 4.15983ZM31.414 21.4138C31.7783 21.0366 31.9799 20.5314 31.9753 20.007C31.9708 19.4826 31.7605 18.981 31.3896 18.6102C31.0188 18.2394 30.5172 18.029 29.9928 18.0245C29.4684 18.0199 28.9632 18.2215 28.586 18.5858L22 25.1718L19.414 22.5858C19.0368 22.2215 18.5316 22.0199 18.0072 22.0245C17.4828 22.029 16.9812 22.2394 16.6104 22.6102C16.2395 22.981 16.0292 23.4826 16.0247 24.007C16.0201 24.5314 16.2217 25.0366 16.586 25.4138L20.586 29.4138C20.9611 29.7888 21.4697 29.9994 22 29.9994C22.5303 29.9994 23.0389 29.7888 23.414 29.4138L31.414 21.4138Z"
        fill="#F5CE60"
      />
    </Svg>
  );
}

function ChatSupportIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M11.3333 1.33301H4.66658C2.82659 1.33301 1.33325 2.81967 1.33325 4.65301V8.63967V9.30634C1.33325 11.1397 2.82659 12.6263 4.66658 12.6263H5.66658C5.84658 12.6263 6.08659 12.7463 6.19992 12.893L7.19992 14.2197C7.63992 14.8063 8.35992 14.8063 8.79992 14.2197L9.79992 12.893C9.92658 12.7263 10.1266 12.6263 10.3333 12.6263H11.3333C13.1733 12.6263 14.6666 11.1397 14.6666 9.30634V4.65301C14.6666 2.81967 13.1733 1.33301 11.3333 1.33301ZM8.66658 9.16634H4.66658C4.39325 9.16634 4.16659 8.93967 4.16659 8.66634C4.16659 8.39301 4.39325 8.16634 4.66658 8.16634H8.66658C8.93992 8.16634 9.16658 8.39301 9.16658 8.66634C9.16658 8.93967 8.93992 9.16634 8.66658 9.16634ZM11.3333 5.83301H4.66658C4.39325 5.83301 4.16659 5.60634 4.16659 5.33301C4.16659 5.05967 4.39325 4.83301 4.66658 4.83301H11.3333C11.6066 4.83301 11.8333 5.05967 11.8333 5.33301C11.8333 5.60634 11.6066 5.83301 11.3333 5.83301Z"
        fill="#27FF9E"
      />
    </Svg>
  );
}

function CallSupportIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M7.36659 9.96634L6.13325 11.1997C5.87325 11.4597 5.45992 11.4597 5.19325 11.2063C5.11992 11.133 5.04659 11.0663 4.97325 10.993C4.28659 10.2997 3.66659 9.57301 3.11325 8.81301C2.56659 8.05301 2.12659 7.29301 1.80659 6.53967C1.49325 5.77967 1.33325 5.05301 1.33325 4.35967C1.33325 3.90634 1.41325 3.47301 1.57325 3.07301C1.73325 2.66634 1.98659 2.29301 2.33992 1.95967C2.76659 1.53967 3.23325 1.33301 3.72659 1.33301C3.91325 1.33301 4.09992 1.37301 4.26659 1.45301C4.43992 1.53301 4.59325 1.65301 4.71325 1.82634L6.25992 4.00634C6.37992 4.17301 6.46659 4.32634 6.52659 4.47301C6.58659 4.61301 6.61992 4.75301 6.61992 4.87967C6.61992 5.03967 6.57325 5.19967 6.47992 5.35301C6.39325 5.50634 6.26659 5.66634 6.10659 5.82634L5.59992 6.35301C5.52659 6.42634 5.49325 6.51301 5.49325 6.61967C5.49325 6.67301 5.49992 6.71967 5.51325 6.77301C5.53325 6.82634 5.55325 6.86634 5.56659 6.90634C5.68659 7.12634 5.89325 7.41301 6.18659 7.75967C6.48659 8.10634 6.80659 8.45967 7.15325 8.81301C7.21992 8.87967 7.29325 8.94634 7.35992 9.01301C7.62659 9.27301 7.63325 9.69967 7.36659 9.96634Z"
        fill="#27FF9E"
      />
      <Path
        d="M14.6466 12.2204C14.6466 12.407 14.6132 12.6004 14.5466 12.787C14.5266 12.8404 14.5066 12.8937 14.4799 12.947C14.3666 13.187 14.2199 13.4137 14.0266 13.627C13.6999 13.987 13.3399 14.247 12.9332 14.4137C12.9266 14.4137 12.9199 14.4204 12.9132 14.4204C12.5199 14.5804 12.0932 14.667 11.6332 14.667C10.9532 14.667 10.2266 14.507 9.4599 14.1804C8.69324 13.8537 7.92657 13.4137 7.16657 12.8604C6.90657 12.667 6.64657 12.4737 6.3999 12.267L8.5799 10.087C8.76657 10.227 8.93324 10.3337 9.07324 10.407C9.10657 10.4204 9.14657 10.4404 9.19324 10.4604C9.24657 10.4804 9.2999 10.487 9.3599 10.487C9.47324 10.487 9.5599 10.447 9.63324 10.3737L10.1399 9.87369C10.3066 9.70702 10.4666 9.58035 10.6199 9.50035C10.7732 9.40702 10.9266 9.36035 11.0932 9.36035C11.2199 9.36035 11.3532 9.38702 11.4999 9.44702C11.6466 9.50702 11.7999 9.59369 11.9666 9.70702L14.1732 11.2737C14.3466 11.3937 14.4666 11.5337 14.5399 11.7004C14.6066 11.867 14.6466 12.0337 14.6466 12.2204Z"
        fill="#27FF9E"
      />
    </Svg>
  );
}

function ChevronForwardIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6L15 12L9 18"
        stroke="#27FF9E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function InformationLockedIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Path
        d="M6 11C8.755 11 11 8.755 11 6C11 3.245 8.755 1 6 1C3.245 1 1 3.245 1 6C1 8.755 3.245 11 6 11ZM6.375 8C6.375 8.205 6.205 8.375 6 8.375C5.795 8.375 5.625 8.205 5.625 8L5.625 5.5C5.625 5.295 5.795 5.125 6 5.125C6.205 5.125 6.375 5.295 6.375 5.5L6.375 8ZM5.54 3.81C5.565 3.745 5.6 3.695 5.645 3.645C5.695 3.6 5.75 3.565 5.81 3.54C5.87 3.515 5.935 3.5 6 3.5C6.065 3.5 6.13 3.515 6.19 3.54C6.25 3.565 6.305 3.6 6.355 3.645C6.4 3.695 6.435 3.745 6.46 3.81C6.485 3.87 6.5 3.935 6.5 4C6.5 4.065 6.485 4.13 6.46 4.19C6.435 4.25 6.4 4.305 6.355 4.355C6.305 4.4 6.25 4.435 6.19 4.46C6.07 4.51 5.93 4.51 5.81 4.46C5.75 4.435 5.695 4.4 5.645 4.355C5.6 4.305 5.565 4.25 5.54 4.19C5.515 4.13 5.5 4.065 5.5 4C5.5 3.935 5.515 3.87 5.54 3.81Z"
        fill="#E90418"
      />
    </Svg>
  );
}
