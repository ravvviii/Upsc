import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../lib/api";
import Animated, { FadeIn } from "react-native-reanimated";

export default function ResultReview() {
  const { editorialId, title } = useLocalSearchParams();
  const router = useRouter();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await api.editorialMCQs.checkAttempt(editorialId);
        setAttempt(res);
      } catch (err) {
        console.log("Error loading attempt:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, []);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-gray-600 font-outfit-medium">
          Loading your results...
        </Text>
      </View>
    );

  if (!attempt?.result?.length)
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg font-outfit-bold text-gray-700">
          No results found.
        </Text>
      </View>
    );

  return (
    <View className="flex-1 bg-white">
      {/* 🔙 Top Back Button */}
      <View className="flex-row items-center p-5 border-b border-gray-200 bg-white">
        <TouchableOpacity
          onPress={() =>
            router.replace({
              pathname: "/home",
              params: { editorial: JSON.stringify({ _id: editorialId, title }) },
            })
          }
          className="flex-row items-center space-x-2"
        >
          <Ionicons name="arrow-back" size={22} color="#2563EB" />
          <Text className="text-indigo-600 font-outfit-medium">Back to Editorial</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-5">
        <Animated.Text
          entering={FadeIn.duration(500)}
          className="text-3xl font-outfit-bold text-indigo-600 mb-2"
        >
          📊 Your Test Review
        </Animated.Text>

        <Text className="text-gray-600 text-base mb-4">
          {title} - Score: {attempt.score}/{attempt.total}
        </Text>

        {attempt.result.map((ans, idx) => (
          <View
            key={idx}
            className="mb-6 p-4 rounded-2xl border bg-gray-50 border-gray-200"
          >
            <Text className="font-outfit-bold text-gray-900 mb-3">
              {idx + 1}. {ans.mcqId?.question || "Question unavailable"}
            </Text>

            {ans.mcqId?.options?.map((opt, i) => {
              const isSelected = ans.selected === opt;
              const isCorrect = ans.mcqId.correctAnswer === opt;

              let bg = "bg-white border-gray-300";
              if (isCorrect) bg = "bg-green-100 border-green-500";
              else if (isSelected && !isCorrect)
                bg = "bg-red-100 border-red-500";

              return (
                <View
                  key={i}
                  className={`border rounded-lg py-2 px-3 mb-2 ${bg}`}
                >
                  <Text className="font-outfit-medium text-gray-800">{opt}</Text>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
