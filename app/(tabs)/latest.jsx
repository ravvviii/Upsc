import { View, Text } from 'react-native';

export default function LatestScreen() {
  return (
    <View className="flex-1 bg-primary items-center justify-center p-6">
      <Text className="text-3xl font-bold text-accent mb-2"> Coming Soon</Text>
      <Text className="text-light-300 text-center">
        Exciting new content will be available here shortly!
      </Text>
    </View>
  );
}
