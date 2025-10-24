import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export const checkForUpdates = async () => {
  try {
    // Only check for updates in production
    if (!__DEV__) {
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        // Restart the app to apply the update
        Alert.alert(
          'Update Available',
          'A new version is available. The app will restart to apply the update.',
          [
            {
              text: 'Update Now',
              onPress: () => Updates.reloadAsync(),
            },
          ]
        );
      }
    }
  } catch (error) {
    console.log('Error checking for updates:', error);
  }
};

export const checkForUpdatesManually = async () => {
  try {
    if (!__DEV__) {
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        Alert.alert(
          'Update Available',
          'A new version is available. Would you like to update now?',
          [
            {
              text: 'Later',
              style: 'cancel',
            },
            {
              text: 'Update',
              onPress: async () => {
                await Updates.fetchUpdateAsync();
                Updates.reloadAsync();
              },
            },
          ]
        );
      } else {
        Alert.alert('No Updates', 'Your app is up to date!');
      }
    } else {
      Alert.alert('Development Mode', 'Updates are not available in development mode.');
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to check for updates.');
    console.log('Error checking for updates:', error);
  }
};