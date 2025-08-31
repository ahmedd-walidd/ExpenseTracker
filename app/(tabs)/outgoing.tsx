import ExpenseDetailModal from '@/components/modals/ExpenseDetailModal';
import SortButtons from '@/components/SortButtons';
import SwipeableExpenseItem from '@/components/SwipeableExpenseItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useExpenses, useExpenseStats } from '@/hooks/useExpenses';
import { Expense } from '@/types/expense';
import { sortExpenses, SortOrder, SortType } from '@/utils/sortExpenses';
import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OutgoingScreen() {
  const insets = useSafeAreaInsets();
  const { formatAmount } = useCurrency();
  const { user } = useAuth();
  const { data: expenses, isLoading: expensesLoading } = useExpenses({ type: 'outgoing' });
  const { data: stats, isLoading: statsLoading } = useExpenseStats();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [sortType, setSortType] = useState<SortType>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const outgoingExpenses = useMemo(() => {
    const rawExpenses = expenses || [];
    return sortExpenses(rawExpenses, sortType, sortOrder);
  }, [expenses, sortType, sortOrder]);

  const handleExpensePress = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedExpense(null);
  };

  const handleSortChange = (type: SortType, order: SortOrder) => {
    setSortType(type);
    setSortOrder(order);
  };
  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
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
          <ThemedText type="subtitle" darkColor='black' style={styles.totalLabel}>Total Spent</ThemedText>
          <ThemedText 
            type="title" 
            style={styles.totalAmount}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.6}
          >
            {statsLoading ? '...' : `-${formatAmount(stats?.totalOutgoing || 0)}`}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Expense Transactions</ThemedText>
            <SortButtons
              currentSort={sortType}
              currentOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </View>
          {expensesLoading ? (
            <ThemedText style={styles.placeholder}>Loading expenses...</ThemedText>
          ) : outgoingExpenses.length === 0 ? (
            <ThemedText style={styles.placeholder}>
              No expenses recorded yet. Add your first expense to start tracking your spending.
            </ThemedText>
          ) : (
            <FlatList
              data={outgoingExpenses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.swipeableContainer}>
                  <SwipeableExpenseItem
                    item={item}
                    onPress={handleExpensePress}
                  />
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </ThemedView>
      </ScrollView>
      
      <ExpenseDetailModal
        visible={isDetailModalVisible}
        onClose={handleCloseDetailModal}
        expense={selectedExpense}
      />
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  swipeableContainer: {
    marginBottom: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#dc3545',
  },
  expenseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expenseDetails: {
    marginLeft: 12,
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  expenseDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  expenseDate: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  expenseCategory: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
    fontStyle: 'italic',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
