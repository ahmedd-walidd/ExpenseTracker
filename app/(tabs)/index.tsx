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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { formatAmount } = useCurrency();
  const { user } = useAuth();
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: stats, isLoading: statsLoading } = useExpenseStats();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [sortType, setSortType] = useState<SortType>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  const recentExpenses = useMemo(() => {
    const rawExpenses = expenses?.slice(0, 10) || [];
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
            <ThemedText 
              style={styles.statLabel}
              numberOfLines={1}
            >
              Incoming
            </ThemedText>
            <ThemedText 
              style={styles.statAmount}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.6}
            >
              {statsLoading ? '...' : `+${formatAmount(stats?.totalIncoming || 0)}`}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.statCard}>
            <IconSymbol name="arrow.up.circle.fill" size={24} color="#dc3545" />
            <ThemedText 
              style={styles.statLabel}
              numberOfLines={1}
            >
              Outgoing
            </ThemedText>
            <ThemedText 
              style={styles.statAmount}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.6}
            >
              {statsLoading ? '...' : `-${formatAmount(stats?.totalOutgoing || 0)}`}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.statCard}>
            <IconSymbol name="equal.circle.fill" size={24} color="#007AFF" />
            <ThemedText 
              style={styles.statLabel}
              numberOfLines={1}
            >
              Balance
            </ThemedText>
            <ThemedText 
              style={[styles.statAmount, { 
                color: (stats?.netAmount || 0) >= 0 ? '#28a745' : '#dc3545' 
              }]}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.6}
            >
              {statsLoading ? '...' : 
                (stats?.netAmount || 0) >= 0 
                  ? `+${formatAmount(stats?.netAmount || 0)}`
                  : formatAmount(stats?.netAmount || 0)
              }
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Recent Transactions</ThemedText>
            <SortButtons
              currentSort={sortType}
              currentOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </View>
          {expensesLoading ? (
            <ThemedText style={styles.placeholder}>Loading expenses...</ThemedText>
          ) : recentExpenses.length === 0 ? (
            <>
              <ThemedText style={styles.placeholder}>
                No expenses recorded yet. Start tracking your expenses to see them here.
              </ThemedText>
            </>
          ) : (
            <FlatList
              data={recentExpenses}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 6,
    opacity: 0.7,
    textAlign: 'center',
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
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
  swipeableContainer: {
    marginBottom: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
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
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
