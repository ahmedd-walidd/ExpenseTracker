import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <IconSymbol name="list.bullet" size={32} color="#007AFF" />
          <ThemedText type="title" style={styles.title}>All Expenses Overview</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Overview</ThemedText>
          <ThemedText style={styles.description}>
            View all your expenses in one place. This screen will show both incoming and outgoing transactions.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statCard}>
            <IconSymbol name="arrow.down.circle.fill" size={24} color="#28a745" />
            <ThemedText style={styles.statLabel}>Incoming</ThemedText>
            <ThemedText style={styles.statAmount}>$0.00</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.statCard}>
            <IconSymbol name="arrow.up.circle.fill" size={24} color="#dc3545" />
            <ThemedText style={styles.statLabel}>Outgoing</ThemedText>
            <ThemedText style={styles.statAmount}>$0.00</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Recent Transactions</ThemedText>
          <ThemedText style={styles.placeholder}>
            No expenses recorded yet. Start tracking your expenses to see them here.
          </ThemedText>
          
          <ThemedView style={styles.quickActions}>
            <ThemedText style={styles.quickActionsTitle}>Quick Actions:</ThemedText>
            <ThemedText style={styles.quickActionItem}>• Add new expense</ThemedText>
            <ThemedText style={styles.quickActionItem}>• Record income</ThemedText>
            <ThemedText style={styles.quickActionItem}>• View reports</ThemedText>
          </ThemedView>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 8,
    opacity: 0.7,
  },
  statAmount: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  placeholder: {
    marginTop: 10,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  quickActions: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
  },
  quickActionsTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  quickActionItem: {
    marginLeft: 10,
    marginBottom: 4,
    opacity: 0.8,
  },
});
