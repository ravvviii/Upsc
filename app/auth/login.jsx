import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthContext } from '../../context/AuthContext';

export default function LoginScreen() {
  const { login, loading, error, user } = useAuthContext();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace('/');
  }, [user]);

  const onSubmit = async () => {
    if (!emailOrUsername || !password) {
      setLocalError('Please enter credentials');
      return;
    }
    setLocalError(null);
    try {
      await login(emailOrUsername.trim(), password);
    } catch (e) {
      // error already handled in context
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View className="flex-1 px-4 pt-[100px] bg-background ">
      <Text className="text-4xl  font-extrabold text-accent tracking-tight">EXAM Prep...</Text>
      <Text className="text-primary font-semibold mt-2 mb-10">Focused daily progress starts here.</Text>
      <View className="space-y-5">
        <Field
          label="Email or Username"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
          placeholder="aspirant@example.com"
          className=""
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />
        {(error || localError) && (
          <Text className="text-red-500 text-sm">{error || localError}</Text>
        )}
        <TouchableOpacity
          disabled={loading}
          onPress={onSubmit}
          className="bg-primary-700 mt-6 rounded-2xl py-4 active:opacity-80 shadow-lg shadow-accent/30"
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-center font-semibold text-white text-lg">Login</Text>}
        </TouchableOpacity>
        <Text className="text-center text-accent font-bold mt-6 ">
          New here? <Link href="/auth/register" className="text-red-600  text-xl border border-accent-orange font-bold">    Create account</Link>
        </Text>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
}

function Field({ label, ...inputProps }) {
  return (
    <View>
      <Text className="text-textPrimary mb-2 font-medium">{label}</Text>
      <TextInput
        {...inputProps}
        autoCapitalize="none"
        className=" rounded-xl px-4 py-3 text-textPrimary border border-secondary focus:border-accent"
        placeholderTextColor="#666"
      />
    </View>
  );
}
