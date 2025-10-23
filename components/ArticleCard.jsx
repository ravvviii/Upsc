import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  LinearGradient,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../lib/api";

export default function ArticleCard({
  article,
  onPress,
  initialBookmarked = false,
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  useEffect(() => {
    setBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleBookmarkToggle = async () => {
    try {
      if (bookmarked) {
        await api.removeBookmark(article._id);
        setBookmarked(false);
      } else {
        await api.addBookmark(article._id);
        setBookmarked(true);
      }
    } catch (err) {
      console.error("Bookmark toggle error:", err);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(article)}
      activeOpacity={0.9}
      className="bg-white rounded-2xl mb-6 shadow-md overflow-hidden"
    >
      {/* Image */}
      {article.image ? (
        <View className="relative">
          <Image
            source={{ uri: article.image }}
            className="w-full h-48"
            resizeMode="cover"
          />
          <View className="absolute top-2 right-2 bg-white/70 rounded-full p-2">
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={22}
              color={bookmarked ? "#2563EB" : "#64748B"}
              onPress={handleBookmarkToggle}
            />
          </View>
        </View>
      ) : (
        <View className="bg-gray-100 h-40 justify-center items-center">
          <Ionicons name="image-outline" size={36} color="#CBD5E1" />
        </View>
      )}

      {/* Content */}
      <View className="p-4">
        <Text className="text-lg font-semibold text-gray-900 mb-1 leading-snug">
          {article.title}
        </Text>

        {/* Source and Date */}
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-gray-700 border border-green-300 rounded-full px-2 py-0.5 bg-green-50 font-medium">
            {article.category}
          </Text>

          <Text className="text-xs text-gray-500">{article.source}</Text>
          <Text className="text-xs text-gray-500">
            {new Date(article.pubDate || article.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
