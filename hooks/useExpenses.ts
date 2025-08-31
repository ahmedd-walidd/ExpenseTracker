import { useAuth } from '@/contexts/AuthContext';
import { ExpenseService } from '@/services/ExpenseService';
import { ExpenseFilters, ExpenseUpdate } from '@/types/expense';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys for caching
export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (userId: string, filters?: ExpenseFilters) => [...expenseKeys.lists(), userId, filters] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
  stats: (userId: string) => [...expenseKeys.all, 'stats', userId] as const,
};

// Hook to fetch expenses
export function useExpenses(filters?: ExpenseFilters) {
  const { user } = useAuth();

  return useQuery({
    queryKey: expenseKeys.list(user?.id || '', filters),
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return await ExpenseService.getExpenses(user.id, filters);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Hook to fetch single expense
export function useExpense(id: string) {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: async () => {
      return await ExpenseService.getExpenseById(id);
    },
    enabled: !!id,
  });
}

// Hook to fetch expense statistics
export function useExpenseStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: expenseKeys.stats(user?.id || ''),
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return await ExpenseService.getExpenseStats(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

// Hook to create expense
export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ExpenseService.createExpense,
    onSuccess: () => {
      // Invalidate and refetch expenses
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.stats(user?.id || '') });
    },
    onError: (error) => {
      console.error('Failed to create expense:', error);
    },
  });
}

// Hook to update expense
export function useUpdateExpense() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ExpenseUpdate }) =>
      ExpenseService.updateExpense(id, updates),
    onSuccess: (data) => {
      // Update the specific expense in cache
      if (data) {
        queryClient.setQueryData(expenseKeys.detail(data.id), data);
      }
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.stats(user?.id || '') });
    },
    onError: (error) => {
      console.error('Failed to update expense:', error);
    },
  });
}

// Hook to delete expense
export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ExpenseService.deleteExpense,
    onSuccess: () => {
      // Invalidate and refetch expenses
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.stats(user?.id || '') });
    },
    onError: (error) => {
      console.error('Failed to delete expense:', error);
    },
  });
}
