import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onAddExpense: (expense: {
    amount: number;
    title: string;
    description: string;
    type: 'incoming' | 'outgoing';
    date: Date;
  }) => void;
}

export default function AddExpenseModal({ visible, onClose, onAddExpense }: AddExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'incoming' | 'outgoing'>('outgoing');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleAddExpense = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please enter a description');
      return;
    }

    onAddExpense({
      amount: numAmount,
      title: title.trim(),
      description: description.trim(),
      type,
      date: new Date(),
    });

    // Reset form
    setAmount('');
    setTitle('');
    setDescription('');
    setType('outgoing');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol size={24} name="xmark" color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Add Expense</Text>
          <TouchableOpacity onPress={handleAddExpense} style={styles.saveButton}>
            <IconSymbol size={24} name="checkmark" color="white" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Title</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title..."
              placeholderTextColor={colors.tabIconDefault}
              autoFocus
            />
          </View>

          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.tabIconDefault}
              keyboardType="numeric"
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description..."
              placeholderTextColor={colors.tabIconDefault}
              multiline
            />
          </View>

          {/* Type Selection */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Type</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  type === 'incoming' && { backgroundColor: '#22c55e', borderColor: '#22c55e' }
                ]}
                onPress={() => setType('incoming')}
              >
                <IconSymbol 
                  size={20} 
                  name="arrow.down.circle.fill" 
                  color={type === 'incoming' ? 'white' : colors.text} 
                />
                <Text style={[
                  styles.typeButtonText, 
                  { color: type === 'incoming' ? 'white' : colors.text }
                ]}>
                  Income
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  type === 'outgoing' && { backgroundColor: '#ef4444', borderColor: '#ef4444' }
                ]}
                onPress={() => setType('outgoing')}
              >
                <IconSymbol 
                  size={20} 
                  name="arrow.up.circle.fill" 
                  color={type === 'outgoing' ? 'white' : colors.text} 
                />
                <Text style={[
                  styles.typeButtonText, 
                  { color: type === 'outgoing' ? 'white' : colors.text }
                ]}>
                  Expense
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});