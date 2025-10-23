import { Tabs, Redirect } from "expo-router";
import { useAuthContext } from "../../context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <ActivityIndicator color="#AB8BFF" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000000ff",
          borderTopColor: "#221f3d",
        },
        tabBarActiveTintColor: "#AB8BFF",
        tabBarInactiveTintColor: "#9CA4AB",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Editorial",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="latest"
        options={{
          title: "Latest",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
