import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';

export default function AddScreen() {
  // This screen is hidden and not directly accessible
  // The add functionality is handled through the modal
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>Add Expense</ThemedText>
    </ThemedView>
  );
}