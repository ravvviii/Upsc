import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthContext } from '../../context/AuthContext';

export default function RegisterScreen() {
  const { register, loading, error, user } = useAuthContext();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [localError, setLocalError] = useState(null);
  const router = useRouter();

  useEffect(() => { if (user) router.replace('/'); }, [user]);

  const onSubmit = async () => {
    if (!username || !email || !password) {
      setLocalError('Fill required fields');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setLocalError('Invalid email');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password too short');
      return;
    }
    setLocalError(null);
    try {
      await register(username.trim(), email.trim(), password, referralCode.trim() || undefined);
    } catch {}
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pt-20 bg-background">
      <Text className="text-4xl font-extrabold text-accent tracking-tight">Create Account</Text>
      <Text className="text-primary mt-2 mb-10">Your disciplined prep journey begins.</Text>
      <View className="space-y-5">
        <Field label="Username" value={username} onChangeText={setUsername} placeholder="ias_aspirant" />
        <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Strong password" />
        <Field label="Referral Code (optional)" value={referralCode} onChangeText={setReferralCode} placeholder="ABCD1234" />
        {(error || localError) && <Text className="text-red-500 text-sm">{error || localError}</Text>}
        <TouchableOpacity
          disabled={loading}
          onPress={onSubmit}
          className="bg-accent rounded-2xl py-4  mt-3 active:opacity-80 shadow-lg shadow-accent/30"
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-center font-semibold text-white text-lg">Register</Text>}
        </TouchableOpacity>
        <Text className="text-center text-success font-bold mt-6">
          Already have an account? <Link href="/auth/login" className="text-accent font-semibold">Login</Link>
        </Text>
      </View>
    </ScrollView>
  );
}

function Field({ label, ...inputProps }) {
  return (
    <View>
      <Text className="text-textPrimary py-2 mb-2 font-medium">{label}</Text>
      <TextInput
        {...inputProps}
        autoCapitalize="none"
        className=" rounded-xl px-4 py-3 text-textPrimary font-bold border border-secondary focus:border-accent"
        placeholderTextColor="#666"
      />
    </View>
  );
}
