import { useAuthActions } from '@convex-dev/auth/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AdminLogin() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter your email and password');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await signIn('password', {
        flow: 'signIn',
        email: trimmedEmail,
        password: trimmedPassword,
      });
      router.replace('/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f5f5f5',
      }}
    >
      <View
        style={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#fff',
          padding: 24,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e5e5e5',
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 8 }}>
          Admin Login
        </Text>
        <Text style={{ color: '#666', marginBottom: 24 }}>
          Sign in to access the admin dashboard
        </Text>

        {error ? (
          <Text style={{ color: '#dc2626', marginBottom: 16 }}>{error}</Text>
        ) : null}

        <Text style={{ marginBottom: 4, fontWeight: '500' }}>Email</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#e5e5e5',
            padding: 12,
            borderRadius: 6,
            marginBottom: 16,
          }}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <Text style={{ marginBottom: 4, fontWeight: '500' }}>Password</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#e5e5e5',
            padding: 12,
            borderRadius: 6,
            marginBottom: 24,
          }}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          style={{
            backgroundColor: '#333',
            padding: 14,
            borderRadius: 6,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
