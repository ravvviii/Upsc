import { Pressable, View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EditorialCard({ item }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/editorialDetail",
          params: { editorial: JSON.stringify(item) },
        })
      }
      className="bg-white mx-3 mb-5 rounded-2xl shadow-lg overflow-hidden border border-gray-100 active:scale-95 duration-150"
    >
      <View className="h-48 w-full">
        <Image
          source={{ uri: item.image }}
          className="h-full w-full object-cover"
        />
      </View>

      <View className="p-4">
        <Text
          numberOfLines={2}
          className="text-xl font-bold text-gray-900 mb-2 font-outfit-bold truncate"
        >
          {item.title}
        </Text>
        <Text
          numberOfLines={3}
          className="text-sm text-gray-700 font-outfit-medium truncate"
        >
          {item.shortDescription}
        </Text>

        <View className="flex-row justify-between mt-3">
          <Text className="text-xs text-red-500 font-outfit-bold">
            📰 {item.paperName}
          </Text>
          <Text className="text-xs text-gray-500 font-outfit-bold truncate">
            <Ionicons name="person-sharp" size={10} color="#000000ff"/> {item.author}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
