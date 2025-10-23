import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../lib/api";
import { useLocalSearchParams } from "expo-router";

export default function ArticleScreen() {
  const { article, bookmarked } = useLocalSearchParams();
 
  
  const parsedArticle = JSON.parse(article);
   console.log(article._id);

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (typeof bookmarked === "string") {
      setIsBookmarked(bookmarked.toLowerCase() === "true");
    } else {
      setIsBookmarked(!!bookmarked);
    }
  }, [bookmarked]);

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked) {
        await api.removeBookmark(parsedArticle._id);
        setIsBookmarked(false);
      } else {
        await api.addBookmark(parsedArticle._id);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error("Bookmark toggle error:", err);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Image */}
      {parsedArticle.image ? (
        <View className="relative">
          <Image
            source={{ uri: parsedArticle.image }}
            className="w-full h-60"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={handleBookmarkToggle}
            className="absolute top-4 right-4 bg-white/80 rounded-full p-2"
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={26}
              color={isBookmarked ? "#2563EB" : "#475569"}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="h-52 bg-gray-100 justify-center items-center">
          <Ionicons name="image-outline" size={40} color="#94A3B8" />
        </View>
      )}

      {/* Content */}
      <View className="p-5">
        <Text className="text-2xl font-bold text-gray-900 leading-snug mb-2">
          {parsedArticle.title}
        </Text>
        <Text className="text-sm text-gray-500 mb-4">
          {parsedArticle.source} •{" "}
          {new Date(parsedArticle.pubDate || parsedArticle.date).toLocaleDateString()}
        </Text>

        {parsedArticle.description ? (
          <Text className="text-base text-gray-700 mb-6 leading-6">
            {parsedArticle.description}
          </Text>
        ) : null}

        {/* Bullet points (if any) */}
        {parsedArticle.bulletPoints?.length > 0 && (
          <View className="mb-6">
            {parsedArticle.bulletPoints.map((bp, idx) => (
              <Text key={idx} className="text-base text-gray-700 mb-1">
                • {bp}
              </Text>
            ))}
          </View>
        )}

        {/* AI Answer */}
        {parsedArticle.aiAnswer && (
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-10">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              UPSC Summary
            </Text>
            <Text className="text-base text-gray-700 leading-6">
              {parsedArticle.aiAnswer}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
