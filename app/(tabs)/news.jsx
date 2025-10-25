import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAuthContext } from "../../context/AuthContext";
import ArticleCard from "../../components/ArticleCard";
import { api } from "../../lib/api";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen() {
  const { user } = useAuthContext();

  const [articles, setArticles] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); // ⬅ start true to show loader immediately
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  // 🔹 Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    try {
      const res = await api.bookmarks();
      const list = res.bookmarks || [];
      const ids = new Set(list.map((b) => b._id));
      setBookmarkedIds(ids);
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
    }
  }, []);

  // 🔹 Fetch articles
  const fetchArticles = useCallback(async (pageNum = 1, replace = false) => {
    try {
      if (pageNum === 1 && !replace) setLoading(true);
      else if (replace) setRefreshing(true);
      else setLoadingMore(true);

      const data = await api.articles(pageNum, 7);
      const newArticles = data.articles || [];

      if (pageNum === 1) {
        setArticles(newArticles);
      } else {
        setArticles((prev) => {
          const combined = [...prev, ...newArticles];
          const unique = combined
            .filter(
              (a, index, self) =>
                index === self.findIndex((b) => b._id === a._id)
            )
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          return unique;
        });
      }

      setHasMore(newArticles.length >= 7);
    } catch (err) {
      console.error("Fetch articles error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  // 🔹 Run when screen focused
  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
      fetchArticles(1, true);
    }, [fetchBookmarks, fetchArticles])
  );

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticles(nextPage);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    fetchArticles(1, true);
    fetchBookmarks();
  };

  const renderFooter = () =>
    loadingMore ? (
      <View className="py-4">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    ) : null;

  const navigateToArticle = (article) => {
    router.push({
      pathname: "/article",
      params: {
        article: JSON.stringify(article),
        bookmarked: bookmarkedIds.has(article._id),
      },
    });
  };

  // 🌀 Show loader first (always before showing content)
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-0">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // 📰 If loaded but no articles
  if (!loading && articles.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-surface-0 p-6">
        <Text className="text-lg font-semibold text-gray-700 mb-2">
          📰 We’re uploading fresh content soon!
        </Text>
        <Text className="text-sm text-gray-500 text-center px-6">
          Check back in a little while — new UPSC articles and editorials are on their way.
        </Text>
      </View>
    );
  }

  // ✅ If we have data
  return (
    <View className="flex-1 bg-surface-0 p-6">
      <Text className="text-xl font-bold text-accent mb-2">
        Hello {user?.username}
      </Text>
      <Text className="text-light-300 mb-4">
        Your dashboard will show recent articles, progress and quick links.
      </Text>

      <FlatList
        data={articles}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            onPress={navigateToArticle}
            initialBookmarked={bookmarkedIds.has(item._id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#2563EB"]}
            tintColor="#2563EB"
          />
        }
      />
    </View>
  );
}
