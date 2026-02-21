import { useAuthActions } from '@convex-dev/auth/react';
import { Link } from 'expo-router';
import {
  Button,
  Card,
  FieldError,
  Input,
  Label,
  Spinner,
  TextField,
  useThemeColor,
  useToast,
} from 'heroui-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Container } from '@/src/components/container';

const MIN_PASSWORD_LENGTH = 8;

export default function Register() {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const themeColorAccentForeground = useThemeColor('accent-foreground');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      toast.show({
        label: 'Please fill in all fields',
        variant: 'danger',
      });
      return;
    }

    if (trimmedPassword.length < MIN_PASSWORD_LENGTH) {
      toast.show({
        label: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        variant: 'danger',
      });
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      toast.show({
        label: 'Passwords do not match',
        variant: 'danger',
      });
      return;
    }

    setIsLoading(true);
    try {
      await signIn('password', {
        flow: 'signUp',
        email: trimmedEmail,
        password: trimmedPassword,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create account';
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
      className="px-4 justify-center"
      scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
    >
      <View className="gap-6 max-w-md w-full mx-auto justify-center flex-1">
        <Card variant="secondary" className="p-6 rounded-2xl">
          <Card.Body className="gap-6">
            <View className="gap-1">
              <Card.Title className="text-2xl">Create account</Card.Title>
              <Card.Description>
                Sign up to get started with your account
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
                <View className="w-full flex-row items-center">
                  <Input
                    value={password}
                    onChangeText={setPassword}
                    className="flex-1 pr-10"
                    placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                    secureTextEntry={!isPasswordVisible}
                    autoComplete="new-password"
                    editable={!isLoading}
                  />
                </View>
              </TextField>

              <TextField
                isRequired
                isInvalid={
                  confirmPassword !== '' && password !== confirmPassword
                }
              >
                <Label>Confirm password</Label>
                <View className="w-full flex-row items-center">
                  <Input
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    className="flex-1 pr-10"
                    placeholder="Confirm your password"
                    secureTextEntry={!isConfirmPasswordVisible}
                    autoComplete="new-password"
                    editable={!isLoading}
                  />
                </View>
                {confirmPassword !== '' && password !== confirmPassword && (
                  <FieldError>Passwords do not match</FieldError>
                )}
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
                <Button.Label>Create account</Button.Label>
              )}
            </Button>

            <View className="flex-row justify-center pt-2">
              <Link href="/login" asChild>
                <Button variant="ghost" size="sm" isDisabled={isLoading}>
                  <Button.Label className="text-muted">
                    Already have an account? Sign in
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
