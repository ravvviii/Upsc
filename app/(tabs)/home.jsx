import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { api } from "../../lib/api";
import EditorialCard from "../../components/EditorialCard";
import { useFocusEffect } from "@react-navigation/native";

export default function EditorialScreen() {
  const [editorials, setEditorials] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchEditorials = useCallback(async (pageNum = 1, replace = false) => {
    try {
      if (pageNum === 1 && !replace) setLoading(true);
      else if (replace) setRefreshing(true);
      else setLoadingMore(true);

      const res = await api.editorials(pageNum);
      const newItems = res.editorials || [];

      if (pageNum === 1) setEditorials(newItems);
      else setEditorials((prev) => [...prev, ...newItems]);

      setHasMore(newItems.length >= 10);
    } catch (err) {
      console.error("Fetch editorials error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEditorials(1, true);
    }, [fetchEditorials])
  );

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !refreshing) {
      const next = page + 1;
      setPage(next);
      fetchEditorials(next);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    fetchEditorials(1, true);
  };

  const renderFooter = () =>
    loadingMore ? (
      <View className="py-4">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    ) : null;

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gradient-to-b from-indigo-50 to-white">
      <View className="pt-14 pb-4 px-6">
        <Text className="text-3xl font-bold text-gray-800 text-start">
          Editorials
        </Text>
      </View>

      <FlatList
        data={editorials}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <EditorialCard item={item} />}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#4f46e5"]}
            tintColor="#4f46e5"
          />
        }
      />
    </View>
  );
}
