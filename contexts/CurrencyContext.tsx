import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', flag: '🇸🇦' },
];

interface CurrencyContextType {
  selectedCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = '@expense_tracker_currency';

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]); // Default to USD

  // Load saved currency on app start
  useEffect(() => {
    loadSavedCurrency();
  }, []);

  const loadSavedCurrency = async () => {
    try {
      const savedCurrencyCode = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
      if (savedCurrencyCode) {
        const savedCurrency = currencies.find(c => c.code === savedCurrencyCode);
        if (savedCurrency) {
          setSelectedCurrency(savedCurrency);
        }
      }
    } catch (error) {
      console.error('Error loading saved currency:', error);
    }
  };

  const setCurrency = async (currency: Currency) => {
    try {
      setSelectedCurrency(currency);
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, currency.code);
    } catch (error) {
      console.error('Error saving currency:', error);
    }
  };

  const formatAmount = (amount: number): string => {
    return `${selectedCurrency.symbol}${amount.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      setCurrency,
      formatAmount,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
