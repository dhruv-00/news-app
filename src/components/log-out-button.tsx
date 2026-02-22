import { useAuthActions } from '@convex-dev/auth/react';
import { Ionicons } from '@expo/vector-icons';
import { Button, Dialog } from 'heroui-native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { withUniwind } from 'uniwind';

const StyledIonicons = withUniwind(Ionicons);

const LogOutButton = () => {
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const { signOut } = useAuthActions();

  return (
    <Dialog isOpen={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
      <Button
        variant="ghost"
        size="sm"
        className="min-w-0"
        onPress={() => setSignOutDialogOpen(true)}
      >
        <StyledIonicons
          name="log-out-outline"
          size={20}
          className="text-muted"
        />
      </Button>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="mx-4">
          <Dialog.Title className="text-lg font-semibold">
            Sign out
          </Dialog.Title>
          <Dialog.Description className="text-muted text-sm mt-1 mb-4">
            Are you sure you want to sign out?
          </Dialog.Description>
          <View className="flex-row gap-2 justify-end">
            <Button
              variant="tertiary"
              onPress={() => setSignOutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onPress={signOut}>
              Sign out
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default LogOutButton;

const styles = StyleSheet.create({});
