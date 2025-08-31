import CurrencySelectionModal from '@/components/modals/CurrencySelectionModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCurrency } from '@/contexts/CurrencyContext';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const { selectedCurrency } = useCurrency();
  const insets = useSafeAreaInsets();

  const handleLogin = () => {
    Alert.alert(
      'Login',
      'Login functionality would be implemented here',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Login',
          onPress: () => setIsLoggedIn(true),
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => setIsLoggedIn(false),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <IconSymbol name="gear" size={32} color="#007AFF" />
          <ThemedText type="title" style={styles.title}>Settings</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Account</ThemedText>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <IconSymbol 
                name={isLoggedIn ? "person.fill" : "person"} 
                size={24} 
                color={isLoggedIn ? "#28a745" : "#666"} 
              />
              <ThemedView style={styles.settingText}>
                <ThemedText type="defaultSemiBold">
                  {isLoggedIn ? "Logged In" : "Not Logged In"}
                </ThemedText>
                <ThemedText style={styles.settingDescription}>
                  {isLoggedIn ? "user@example.com" : "Sign in to sync your expenses"}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            
            <TouchableOpacity
              style={[
                styles.authButton,
                isLoggedIn ? styles.logoutButton : styles.loginButton
              ]}
              onPress={isLoggedIn ? handleLogout : handleLogin}
            >
              <ThemedText style={[
                styles.authButtonText,
                isLoggedIn ? styles.logoutButtonText : styles.loginButtonText
              ]}>
                {isLoggedIn ? "Logout" : "Login"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">App Settings</ThemedText>
          
          <TouchableOpacity style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <IconSymbol name="bell" size={24} color="#666" />
              <ThemedView style={styles.settingText}>
                <ThemedText type="defaultSemiBold">Notifications</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Manage your notification preferences
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setCurrencyModalVisible(true)}
          >
            <ThemedView style={styles.settingInfo}>
              <IconSymbol name="dollarsign.circle" size={24} color="#666" />
              <ThemedView style={styles.settingText}>
                <ThemedText type="defaultSemiBold">Currency</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  {selectedCurrency.flag} {selectedCurrency.name} ({selectedCurrency.symbol})
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <IconSymbol name="folder" size={24} color="#666" />
              <ThemedView style={styles.settingText}>
                <ThemedText type="defaultSemiBold">Categories</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Manage expense categories
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">About</ThemedText>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <IconSymbol name="info.circle" size={24} color="#666" />
              <ThemedView style={styles.settingText}>
                <ThemedText type="defaultSemiBold">Version</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Expense Tracker v1.0.0
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
      
      <CurrencySelectionModal
        visible={currencyModalVisible}
        onClose={() => setCurrencyModalVisible(false)}
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
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  authButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#007AFF',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  authButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButtonText: {
    color: 'white',
  },
  logoutButtonText: {
    color: 'white',
  },
});
