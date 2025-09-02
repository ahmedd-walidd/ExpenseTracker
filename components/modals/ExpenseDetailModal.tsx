import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUpdateExpense } from '@/hooks/useExpenses';
import { Expense } from '@/types/expense';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';

interface ExpenseDetailModalProps {
  visible: boolean;
  onClose: () => void;
  expense: Expense | null;
}

interface FormData {
  title: string;
  description: string | null;
  amount: string;
  type: 'incoming' | 'outgoing';
  category: string | null;
  created_at: string;
}

export default function ExpenseDetailModal({ visible, onClose, expense }: ExpenseDetailModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { formatAmount } = useCurrency();
  const updateExpenseMutation = useUpdateExpense();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: null,
    amount: '',
    type: 'outgoing',
    category: null,
    created_at: '',
  });

  // Initialize form data when expense changes
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        description: expense.description,
        amount: expense.amount.toString(),
        type: expense.type,
        category: expense.category,
        created_at: expense.created_at,
      });
    }
  }, [expense]);

  if (!expense) return null;

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        Alert.alert('Error', 'Title is required');
        return;
      }

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        Alert.alert('Error', 'Please enter a valid amount greater than 0');
        return;
      }

      // Create update object with only changed fields
      const updates: any = {};
      if (formData.title !== expense.title) updates.title = formData.title.trim();
      if (formData.description !== expense.description) updates.description = formData.description?.trim() || null;
      if (amount !== expense.amount) updates.amount = amount;
      if (formData.type !== expense.type) updates.type = formData.type;
      if (formData.category !== expense.category) updates.category = formData.category?.trim() || null;

      // Only update if there are changes
      if (Object.keys(updates).length === 0) {
        setIsEditing(false);
        return;
      }

      await updateExpenseMutation.mutateAsync({
        id: expense.id,
        updates,
      });

      Toast.show({
        type: 'success',
        text1: 'Expense Updated',
        text2: `"${formData.title}" has been successfully updated`,
        position: 'top',
        visibilityTime: 3000,
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update expense:', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Failed to update expense. Please try again.',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const handleCancel = () => {
    // Reset form data to original expense values
    setFormData({
      title: expense.title,
      description: expense.description,
      amount: expense.amount.toString(),
      type: expense.type,
      category: expense.category,
      created_at: expense.created_at,
    });
    setIsEditing(false);
  };

  const handleClose = () => {
    if (isEditing) {
      Alert.alert(
        'Unsaved Changes',
        'Are you sure you want to close? Your changes will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Close',
            style: 'destructive',
            onPress: () => {
              handleCancel();
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

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

  const { date, time } = formatDate(isEditing ? formData.created_at : expense.created_at);
  const displayAmount = isEditing ? parseFloat(formData.amount) || 0 : expense.amount;
  const displayType = isEditing ? formData.type : expense.type;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <IconSymbol size={24} name="xmark" color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>
            {isEditing ? 'Edit Expense' : 'Expense Details'}
          </ThemedText>
          {isEditing ? (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <ThemedText style={[styles.cancelText, { color: colors.text }]}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSave} 
                style={[styles.saveButton, { backgroundColor: '#007AFF' }]}
                disabled={updateExpenseMutation.isPending}
              >
                <ThemedText style={styles.saveText}>
                  {updateExpenseMutation.isPending ? 'Saving...' : 'Save'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
              <IconSymbol size={20} name="pencil" color="#007AFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          {/* Amount Card */}
          <ThemedView style={[
            styles.amountCard, 
            { backgroundColor: displayType === 'incoming' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)' }
          ]}>
            <IconSymbol 
              name={displayType === 'incoming' ? "arrow.down.circle.fill" : "arrow.up.circle.fill"} 
              size={28} 
              color={displayType === 'incoming' ? "#28a745" : "#dc3545"} 
            />
            <View style={styles.amountTextContainer}>
              {isEditing ? (
                <View style={styles.editAmountContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.typeButton, 
                      formData.type === 'incoming' && styles.typeButtonActive,
                      { borderColor: colors.border }
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, type: 'incoming' }))}
                  >
                    <ThemedText style={[
                      styles.typeButtonText,
                      formData.type === 'incoming' && styles.typeButtonTextActive
                    ]}>
                      Income
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.typeButton, 
                      formData.type === 'outgoing' && styles.typeButtonActive,
                      { borderColor: colors.border }
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, type: 'outgoing' }))}
                  >
                    <ThemedText style={[
                      styles.typeButtonText,
                      formData.type === 'outgoing' && styles.typeButtonTextActive
                    ]}>
                      Expense
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              ) : null}
              
              {isEditing ? (
                <TextInput
                  style={[styles.amountInput, { color: displayType === 'incoming' ? '#28a745' : '#dc3545' }]}
                  value={formData.amount}
                  onChangeText={(text) => {
                    // Only allow numbers and decimal point
                    const numericValue = text.replace(/[^0-9.]/g, '');
                    // Prevent multiple decimal points
                    const parts = numericValue.split('.');
                    const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
                    setFormData(prev => ({ ...prev, amount: formattedValue }));
                  }}
                  placeholder="0.00"
                  placeholderTextColor={colors.text + '80'}
                  keyboardType="numeric"
                  returnKeyType="done"
                  autoFocus={false}
                />
              ) : (
                <ThemedText 
                  style={[
                    styles.amountText, 
                    { color: displayType === 'incoming' ? '#28a745' : '#dc3545' }
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.3}
                >
                  {displayType === 'incoming' ? '+' : '-'}{formatAmount(displayAmount)}
                </ThemedText>
              )}
            </View>
            <ThemedText style={styles.typeText}>
              {displayType === 'incoming' ? 'Income' : 'Expense'}
            </ThemedText>
          </ThemedView>

          {/* Details */}
          <ThemedView style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <IconSymbol name="doc.text" size={20} color={colors.text} />
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Title</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={[styles.detailInput, { color: colors.text, borderColor: colors.border }]}
                    value={formData.title}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                    placeholder="Enter title"
                    placeholderTextColor={colors.text + '80'}
                    returnKeyType="next"
                  />
                ) : (
                  <ThemedText 
                    style={styles.detailValue}
                    numberOfLines={2}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.8}
                  >
                    {expense.title}
                  </ThemedText>
                )}
              </View>
            </View>

            <View style={styles.detailRow}>
              <IconSymbol name="text.quote" size={20} color={colors.text} />
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Description</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={[styles.detailInput, styles.descriptionInput, { color: colors.text, borderColor: colors.border }]}
                    value={formData.description || ''}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, description: text || null }))}
                    placeholder="Enter description (optional)"
                    placeholderTextColor={colors.text + '80'}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    returnKeyType="next"
                  />
                ) : (
                  <ThemedText style={styles.detailValue}>
                    {expense.description || 'No description'}
                  </ThemedText>
                )}
              </View>
            </View>

            <View style={styles.detailRow}>
              <IconSymbol name="tag" size={20} color={colors.text} />
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Category</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={[styles.detailInput, { color: colors.text, borderColor: colors.border }]}
                    value={formData.category || ''}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, category: text || null }))}
                    placeholder="Enter category (optional)"
                    placeholderTextColor={colors.text + '80'}
                    returnKeyType="next"
                  />
                ) : (
                  <ThemedText style={styles.detailValue}>
                    {expense.category || 'No category'}
                  </ThemedText>
                )}
              </View>
            </View>

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
                <ThemedText style={[styles.detailValue, { opacity: 0.7 }]}>
                  {expense.currency} (Read-only)
                </ThemedText>
              </View>
            </View>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
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
  editAmountContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  amountInput: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    minWidth: 120,
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
  detailInput: {
    fontSize: 16,
    fontWeight: '500',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  descriptionInput: {
    minHeight: 60,
    paddingTop: 8,
  },
});
