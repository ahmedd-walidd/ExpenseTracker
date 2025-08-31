import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Expense } from '@/types/expense';
import React from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

interface ExpenseDetailModalProps {
  visible: boolean;
  onClose: () => void;
  expense: Expense | null;
}

export default function ExpenseDetailModal({ visible, onClose, expense }: ExpenseDetailModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { formatAmount } = useCurrency();

  if (!expense) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return { date: 'Invalid date', time: 'Invalid time' };
      }
      
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      };
    } catch (error) {
      return { date: 'Invalid date', time: 'Invalid time' };
    }
  };

  const { date, time } = formatDate(expense.created_at);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol size={24} name="xmark" color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Expense Details</ThemedText>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          {/* Amount Card */}
          <ThemedView style={[
            styles.amountCard, 
            { backgroundColor: expense.type === 'incoming' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)' }
          ]}>
            <IconSymbol 
              name={expense.type === 'incoming' ? "arrow.down.circle.fill" : "arrow.up.circle.fill"} 
              size={28} 
              color={expense.type === 'incoming' ? "#28a745" : "#dc3545"} 
            />
            <View style={styles.amountTextContainer}>
              <ThemedText 
                style={[
                  styles.amountText, 
                  { color: expense.type === 'incoming' ? '#28a745' : '#dc3545' }
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.3}
              >
                {expense.type === 'incoming' ? '+' : '-'}{formatAmount(expense.amount)}
              </ThemedText>
            </View>
            <ThemedText style={styles.typeText}>
              {expense.type === 'incoming' ? 'Income' : 'Expense'}
            </ThemedText>
          </ThemedView>

          {/* Details */}
          <ThemedView style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <IconSymbol name="doc.text" size={20} color={colors.text} />
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Title</ThemedText>
                <ThemedText 
                  style={styles.detailValue}
                  numberOfLines={2}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.8}
                >
                  {expense.title}
                </ThemedText>
              </View>
            </View>

            {expense.description && (
              <View style={styles.detailRow}>
                <IconSymbol name="text.quote" size={20} color={colors.text} />
                <View style={styles.detailContent}>
                  <ThemedText style={styles.detailLabel}>Description</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {expense.description}
                  </ThemedText>
                </View>
              </View>
            )}

            <View style={styles.detailRow}>
              <IconSymbol name="calendar" size={20} color={colors.text} />
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Date</ThemedText>
                <ThemedText style={styles.detailValue}>{date}</ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <IconSymbol name="clock" size={20} color={colors.text} />
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Time</ThemedText>
                <ThemedText style={styles.detailValue}>{time}</ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <IconSymbol name="dollarsign.circle" size={20} color={colors.text} />
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Currency</ThemedText>
                <ThemedText style={styles.detailValue}>{expense.currency}</ThemedText>
              </View>
            </View>

            {expense.category && (
              <View style={styles.detailRow}>
                <IconSymbol name="tag" size={20} color={colors.text} />
                <View style={styles.detailContent}>
                  <ThemedText style={styles.detailLabel}>Category</ThemedText>
                  <ThemedText style={styles.detailValue}>{expense.category}</ThemedText>
                </View>
              </View>
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40, // Same width as close button for centering
  },
  content: {
    flex: 1,
    padding: 16,
  },
  amountCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  amountTextContainer: {
    width: '90%',
    marginTop: 12,
    marginBottom: 8,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: '100%',
  },
  typeText: {
    fontSize: 16,
    marginTop: 4,
    opacity: 0.7,
    fontWeight: '500',
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});
