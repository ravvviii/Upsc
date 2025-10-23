import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { BounceIn } from "react-native-reanimated";

export default function ResultScreen() {
  const { score, total, title } = useLocalSearchParams();
  const router = useRouter();

  const percentage = ((score / total) * 100).toFixed(0);
  let color = "#EF4444"; // 🔴 default red

if (percentage >= 80) color = "#22C55E"; // 🟢 bright green
else if (percentage >= 60) color = "#84CC16"; // 💚 lime green
else if (percentage >= 40) color = "#EAB308"; // 🟡 yellow
else if (percentage >= 20) color = "#F97316"; // 🟠 orange
else color = "#DC2626"; // 🔴 deep red


  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Animated.Text
  entering={BounceIn.delay(300)}
  style={{ color }}
  className="text-4xl font-outfit-bold mb-2"
>
  🎉 Result
</Animated.Text>


     <Animated.Text
  entering={BounceIn.delay(600)}
  style={{ color }}
  className="text-6xl font-outfit-bold mb-4"
>
  {percentage}%
</Animated.Text>


      <Text className="text-gray-500 text-lg font-outfit-medium mb-8 text-center">
        You answered {score} out of {total} correctly!
      </Text>

      <TouchableOpacity
        onPress={() => router.replace("/(tabs)/home")}
        className="bg-indigo-600 py-3 px-8 rounded-2xl shadow-md"
      >
        <Text className="text-white text-lg font-outfit-bold">Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
