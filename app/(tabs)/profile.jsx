import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  Image,
  SafeAreaView,
  Clipboard,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../context/AuthContext";
import { Link } from "expo-router";
import { checkForUpdatesManually } from "../../lib/updates";

export default function ProfileScreen() {
  const { user, logout } = useAuthContext();

  const handleShare = async () => {
    const message = `Join me on the UPSC Prep App! Use my referral code: ${user?.referralCode}`;
    try {
      await Share.share({ message });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };


// const handleCopy = async (referral) => {
//   if (!referral) return;
//  if (typeof Clipboard.setStringAsync === 'function') {
//     await Clipboard.setStringAsync(code);
//   } else {
//     Clipboard.setString(code);
//   }
//   Alert.alert('Copied!', `Referral code ${referral} copied to clipboard`);
// };

  const handleReferShare = async () => {
    const message = `Join me on the UPSC Prep App! Use my referral code: ${user?.referralCode}`;
    try {
      await Share.share({ message });
      // optionally you can check result for shared or dismissed
    } catch (error) {
      Alert.alert("Error", "Couldn’t share the referral code");
    }
  };

  const LinkdeenhandlePress = () => {
    Linking.openURL("https://www.linkedin.com/in/ravvviii/");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-1 p-6">
      {/* Header */}
      <Text className="text-3xl font-bold text-primary-600 mb-8">Profile</Text>

      {/* Avatar + name + email */}
      <View className="items-center mb-8">
        <Image
          source={{
            uri:
              user?.avatar ||
              "data:image/png;base64,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" /* fallback avatar */,
          }}
          className="w-24 h-24 rounded-full mb-4 border-2 border-accent"
        />
        <Text className="text-xl font-semibold text-text-primary">
          {user?.username}
        </Text>
        <Text className="text-base text-text-secondary">{user?.email}</Text>
      </View>

      {/* Info Card */}
      <View className="bg-surface-0 rounded-xl p-5 shadow-lg mb-8 border border-accent-orange">
        <View className="mb-4">
          <Text className="text-lg font-semibold text-text-primary">
            Streak & Points
          </Text>
          <Text className="text-base text-text-secondary">
            {user?.streak || 0} days · {user?.points || 0} pts
          </Text>
        </View>
        <View className="mb-4">
          <Text className="text-lg font-semibold text-text-primary">
            Referral Code
          </Text>

          <View className="mt-1 flex-row items-center justify-between">
             <Text className="text-base text-accent-orange">
              {user?.referralCode}
            </Text>
            <View className="flex-row gap-6 ">


             {/* <TouchableOpacity onPress={() => handleCopy(user.referralCode)}>
            <Ionicons
              name="copy-outline"
              size={20}
              color="#ac1010ff"
              className="border border-accent-orange rounded-md p-1"
            />
          </TouchableOpacity> */}

          <TouchableOpacity onPress={handleReferShare}>
            <Ionicons
              name="share-outline"
              size={20}
              color="#ac1010ff"
              className="border border-accent-orange rounded-md p-1"
            />
          </TouchableOpacity>
          </View>

           
          </View>
        </View>
      </View>

      {/* Buttons Row */}
      <View className="flex-row space-x-4 mb-4 gap-3">
        <TouchableOpacity
          onPress={handleShare}
          className="flex-1 flex-row items-center justify-center bg-accent-orange rounded-xl py-3"
        >
          <Ionicons
            name="share-outline"
            size={20}
            color="#fff"
            className="mr-2"
          />
          <Text className="text-white font-semibold text-base">Share App</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={logout}
          className="flex-1 flex-row items-center justify-center bg-accent-deep-red rounded-xl py-3"
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#fff"
            className="mr-2"
          />
          <Text className="text-white font-semibold text-base">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Check for Updates Button */}
      <TouchableOpacity
        onPress={checkForUpdatesManually}
        className="bg-primary-500 rounded-xl py-3 px-4 mb-4 flex-row items-center justify-center"
      >
        <Ionicons
          name="refresh-outline"
          size={20}
          color="#fff"
          className="mr-2"
        />
        <Text className="text-white font-semibold text-base">Check for Updates</Text>
      </TouchableOpacity>

      {/* Footer Text */}
      <View className=" items-center mt-auto mb-4">
        <Text className="text-text-secondary">
          A <Text className="text-accent-orange font-bold">ravvviii</Text>{" "}
          product
        </Text>
        <TouchableOpacity 
      onPress={LinkdeenhandlePress} 
      className="flex-row items-center"
    >
      <Text className="text-base text-primary-500 mr-2">
        Connect me @
      </Text>
      <Ionicons name="logo-linkedin" size={24} color="#2563EB" />
    </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
