import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { api } from "../lib/api";

export default function EditorialDetail() {
  const { editorial } = useLocalSearchParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [checkingAttempt, setCheckingAttempt] = useState(true);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);

  // 🧠 Parse editorial passed via route
  useEffect(() => {
    if (editorial) {
      try {
        setData(JSON.parse(editorial));
      } catch {
        setData(null);
      }
    }
  }, [editorial]);

  // ✅ Check attempt once when data loads
  useEffect(() => {
    const checkAttempt = async () => {
      if (!data?._id) return;
      setCheckingAttempt(true);
      try {
        const res = await api.editorialMCQs.checkAttempt(data._id);
        setAlreadyAttempted(res.attempted || false);
      } catch (e) {
        console.log("checkAttempt error:", e);
      } finally {
        setCheckingAttempt(false);
      }
    };
    checkAttempt();
  }, [data?._id]);

  // 🔁 Re-check when coming back from quiz
  useFocusEffect(
    useCallback(() => {
      const recheck = async () => {
        if (!data?._id) return;
        try {
          const res = await api.editorialMCQs.checkAttempt(data._id);
          setAlreadyAttempted(res.attempted || false);
        } catch (e) {
          console.log("focus recheck error:", e);
        }
      };
      recheck();
    }, [data?._id])
  );

  // 🧩 Split article into paragraphs
  const paragraphs = data?.fullContent
    ? data.fullContent
        .replace(/\\n/g, "\n")
        .replace(/\/n/g, "\n")
        .split(/\n+/)
        .filter((p) => p.trim() !== "")
    : [];

  // 🧠 Handle “Take Test”
  const handleTakeTest = async () => {
    try {
      setLoadingTest(true);
      const res = await api.editorialMCQs.generate(data._id);

      if (res.mcqs?.length > 0) {
        router.push({
          pathname: "/editorial/quiz",
          params: {
            editorialId: data._id,
            title: data.title,
          },
        });
      } else {
        alert("No questions found. Please try again later.");
      }
    } catch (err) {
      console.log("Error generating quiz:", err);
      alert(err?.message || "Something went wrong while preparing your test.");
    } finally {
      setLoadingTest(false);
    }
  };

  // 🕓 Loader while editorial info loads
  if (!data)
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );

  // 🕓 Loader while checking attempt
  if (checkingAttempt)
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-gray-600 font-outfit-medium">
          Checking your quiz status...
        </Text>
      </View>
    );

  // 🧾 UI Rendering
  return (
    <View className="flex-1">
      <ScrollView className="flex-1 bg-gray-50">
        <Animated.View entering={FadeIn.duration(400)}>
          <Image
            source={{ uri: data.image }}
            className="w-full h-64 object-cover"
          />

          <View className="p-6 bg-white -mt-6 rounded-t-3xl shadow-lg">
            <Text className="text-2xl font-outfit-bold text-gray-900 mb-3 leading-snug">
              {data.title}
            </Text>

            <View className="flex-row justify-between mb-6">
              <Text numberOfLines={1} ellipsizeMode="tail" className="text-[11px] font-outfit-bold text-red-600 bg-red-100/60 border border-red-300 rounded-full px-3 py-[2px] self-start truncate">
                {data.paperName}
              </Text>

              <Text className="text-xs font-outfit-bold text-gray-500">
                <Ionicons name="person-sharp" size={10} color="#000000ff" />{" "}
                {data.author}
              </Text>
              {/* <Text className="text-xs font-outfit-bold text-gray-500">
                <Ionicons name="calendar-clear" size={10} color="#000000ff" />{" "}
                {new Date(data.editorialDate).toLocaleDateString()}
              </Text> */}
            </View>

            {/* 🧾 Article Content */}
            {paragraphs.map((para, idx) => (
              <Text
                key={idx}
                className={`text-gray-700 text-base font-outfit-medium leading-relaxed mb-4 ${
                  idx === 0
                    ? "first-letter:text-4xl first-letter:font-bold first-letter:text-indigo-700"
                    : ""
                }`}
              >
                {para.trim()}
              </Text>
            ))}

            {/* 🎯 Button Section */}
            {alreadyAttempted ? (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/editorial/resultReview",
                    params: {
                      editorialId: data._id,
                      title: data.title,
                    },
                  })
                }
                className="mt-8 py-3 rounded-xl bg-green-600 justify-center items-center flex-row"
              >
                <Text className="text-center text-white font-semibold text-base">
                  📊 See Score & Answers
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleTakeTest}
                disabled={loadingTest}
                className={`mt-8 py-3 rounded-xl ${
                  loadingTest
                    ? "bg-gray-400"
                    : "bg-indigo-600 active:bg-indigo-700"
                } justify-center items-center flex-row`}
              >
                <Text className="text-center text-white font-semibold text-base">
                  Take Free Test
                </Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* 🔥 Overlay Loader */}
      {loadingTest && (
        <View className="absolute inset-0 bg-black/30 justify-center items-center z-50">
          <View className="bg-white px-6 py-4 rounded-2xl shadow-lg items-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-3 text-gray-700 font-outfit-medium text-center">
              Searching Previous year UPSC-style questions...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
