import React, { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationBar, BottomTabKey } from "./src/components/NavigationBar";
import { AuthScreen } from "./src/screens/AuthScreen";
import { CameraScreen } from "./src/screens/CameraScreen";
import { AnalysisScreen } from "./src/screens/AnalysisScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { MapScreen } from "./src/screens/MapScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";

export type ScreenKey =
  | "auth"
  | "camera"
  | "analysis"
  | "stats"
  | "map"
  | "profile";

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenKey>("auth");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const showNavigation =
    currentScreen !== "auth" && currentScreen !== "analysis";

  const activeTab = useMemo<BottomTabKey>(() => {
    if (
      currentScreen === "stats" ||
      currentScreen === "map" ||
      currentScreen === "profile"
    ) {
      return currentScreen;
    }
    return "camera";
  }, [currentScreen]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View
        style={[styles.screenWrapper, showNavigation && styles.screenWithNav]}
      >
        {currentScreen === "auth" && (
          <AuthScreen onAuthenticated={() => setCurrentScreen("camera")} />
        )}

        {currentScreen === "camera" && (
          <CameraScreen
            onCapture={(uri) => {
              setCapturedImage(uri);
              setCurrentScreen("analysis");
            }}
          />
        )}

        {currentScreen === "analysis" && (
          <AnalysisScreen
            imageUri={capturedImage}
            onRepeat={() => {
              setCapturedImage(null);
              setCurrentScreen("camera");
            }}
            onFindPoints={() => setCurrentScreen("map")}
          />
        )}

        {currentScreen === "stats" && <StatsScreen />}
        {currentScreen === "map" && <MapScreen />}
        {currentScreen === "profile" && (
          <ProfileScreen
            onLogout={() => {
              setCapturedImage(null);
              setCurrentScreen("auth");
            }}
          />
        )}
      </View>

      {showNavigation && (
        <NavigationBar
          active={activeTab}
          onNavigate={(key) => {
            setCurrentScreen(key);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  screenWithNav: {
    paddingBottom: 88,
  },
});
