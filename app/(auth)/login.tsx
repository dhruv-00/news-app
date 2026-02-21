import { useAuthActions } from '@convex-dev/auth/react';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import {
  Button,
  Card,
  Input,
  Label,
  Spinner,
  TextField,
  useThemeColor,
  useToast,
} from 'heroui-native';
import { useState } from 'react';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

import { Container } from '@/src/components/container';

const StyledIonicons = withUniwind(Ionicons);

export default function Login() {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const themeColorAccentForeground = useThemeColor('accent-foreground');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.show({
        label: 'Please enter your email and password',
        variant: 'danger',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn('password', {
        flow: 'signIn',
        email: trimmedEmail,
        password: trimmedPassword,
      });
      if (result?.signingIn === false && result?.redirect) {
        toast.show({
          label: 'Sign in requires additional step',
          variant: 'default',
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Invalid credentials';
      toast.show({
        label: message,
        variant: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      className="flex-1 p-4 justify-center"
      scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
    >
      <View className="gap-6 max-w-md w-full mx-auto flex-1 justify-center">
        <Card variant="secondary" className="p-6 rounded-2xl">
          <Card.Body className="gap-6">
            <View className="gap-1">
              <Card.Title className="text-2xl">Welcome back</Card.Title>
              <Card.Description>
                Sign in to continue to your account
              </Card.Description>
            </View>

            <View className="gap-4">
              <TextField isRequired>
                <Label>Email</Label>
                <Input
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                />
              </TextField>

              <TextField isRequired>
                <Label>Password</Label>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  className="flex-1 pr-10"
                  placeholder="Enter your password"
                  secureTextEntry={!isPasswordVisible}
                  autoComplete="password"
                  editable={!isLoading}
                />
              </TextField>
            </View>

            <Button
              variant="primary"
              size="lg"
              onPress={handleSubmit}
              isDisabled={isLoading}
              className="mt-2"
            >
              {isLoading ? (
                <Spinner color={themeColorAccentForeground} />
              ) : (
                <Button.Label>Sign in</Button.Label>
              )}
            </Button>

            <View className="flex-row justify-center pt-2">
              <Link href="/register" asChild>
                <Button variant="ghost" size="sm" isDisabled={isLoading}>
                  <Button.Label className="text-muted">
                    Don&apos;t have an account? Sign up
                  </Button.Label>
                </Button>
              </Link>
            </View>
          </Card.Body>
        </Card>
      </View>
    </Container>
  );
}
