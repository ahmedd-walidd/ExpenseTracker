import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function IncomingScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <IconSymbol name="arrow.down.circle.fill" size={32} color="#28a745" />
          <ThemedText type="title" style={styles.title}>Incoming (Received)</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Money Received</ThemedText>
          <ThemedText style={styles.description}>
            Track all the money you've received. This includes salary, refunds, gifts, and any other income.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.totalCard}>
          <ThemedText type="subtitle" darkColor='black' style={styles.totalLabel}>Total Received</ThemedText>
          <ThemedText type="title" style={styles.totalAmount}>$0.00</ThemedText>
        </ThemedView> 

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Recent Income</ThemedText>
          <ThemedText style={styles.placeholder}>
            No incoming transactions recorded yet. Add your first income to get started.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  description: {
    marginTop: 10,
    lineHeight: 20,
  },
  totalCard: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
  },
  totalLabel: {
    marginBottom: 5,
  },
  totalAmount: {
    color: '#28a745',
  },
  placeholder: {
    marginTop: 10,
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
