import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import {
  FaceCaptureFrame,
  FaceCaptureSuccess,
  VerificationScreen,
  VerificationSectionTitle,
  VerificationSubtext,
} from "@/components/verification/verification-ui";
import { AUTH_GREEN } from "@/features/auth/constants";

export default function FaceCaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  async function handlePrimaryAction() {
    if (capturedUri) {
      router.push("/(verification)/vehicle-info");
      return;
    }

    if (!permission?.granted) {
      await requestPermission();
      return;
    }

    if (!cameraRef.current || isCapturing) {
      return;
    }

    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: true,
      });

      if (photo?.uri) {
        setCapturedUri(photo.uri);
      }
    } finally {
      setIsCapturing(false);
    }
  }

  const permissionDenied = permission && !permission.granted && permission.canAskAgain === false;

  return (
    <VerificationScreen
      activeStep={2}
      nextLabel={capturedUri ? "Next" : isCapturing ? "Scanning..." : "Capture face"}
      onNext={handlePrimaryAction}
    >
      {capturedUri ? (
        <FaceCaptureSuccess imageUri={capturedUri} />
      ) : (
        <>
          <VerificationSectionTitle>Verify Your Identity</VerificationSectionTitle>
          <VerificationSubtext>
            Please capture a clear photo of your face. This helps us confirm it&apos;s really you and
            keeps the platform safe for everyone.
          </VerificationSubtext>

          <View className="mt-4 items-center">
            <View className="relative h-[360px] w-full max-w-[312px] overflow-hidden rounded-[28px] bg-[#090909]">
              {permission?.granted ? (
                <CameraView
                  ref={cameraRef}
                  facing="front"
                  style={{ flex: 1 }}
                />
              ) : (
                <View className="flex-1 items-center justify-center px-8">
                  <Text className="text-center text-[15px] leading-7 text-[#8A8A8A]">
                    {permissionDenied
                      ? "Camera access is blocked. Enable it in your device settings to continue facial verification."
                      : "Allow camera access so we can verify your face before moving to the next step."}
                  </Text>

                  {!permissionDenied ? (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      className="mt-6 h-11 rounded-full px-6 items-center justify-center"
                      style={{ backgroundColor: AUTH_GREEN }}
                      onPress={requestPermission}
                    >
                      <Text className="text-[14px] font-semibold text-[#07110C]">Allow camera</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}

              <View className="absolute inset-0">
                <FaceCaptureFrame overlay />
              </View>

              {isCapturing ? (
                <View className="absolute inset-0 items-center justify-center bg-black/30">
                  <ActivityIndicator size="large" color={AUTH_GREEN} />
                </View>
              ) : null}
            </View>
          </View>
        </>
      )}
    </VerificationScreen>
  );
}
