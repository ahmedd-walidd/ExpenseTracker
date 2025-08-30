import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function OutgoingScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <IconSymbol name="arrow.up.circle.fill" size={32} color="#dc3545" />
          <ThemedText type="title" style={styles.title}>Outgoing (Spent)</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Money Spent</ThemedText>
          <ThemedText style={styles.description}>
            Track all your expenses and spending. This includes bills, groceries, entertainment, and any other outgoing payments.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.totalCard}>
          <ThemedText type="subtitle" style={styles.totalLabel}>Total Spent</ThemedText>
          <ThemedText type="title" style={styles.totalAmount}>$0.00</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Recent Expenses</ThemedText>
          <ThemedText style={styles.placeholder}>
            No expenses recorded yet. Add your first expense to start tracking your spending.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Categories</ThemedText>
          <ThemedText style={styles.description}>
            Common expense categories: Food, Transportation, Entertainment, Bills, Shopping, Healthcare
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
    backgroundColor: '#fdf2f2',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
  },
  totalLabel: {
    marginBottom: 5,
  },
  totalAmount: {
    color: '#dc3545',
  },
  placeholder: {
    marginTop: 10,
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
