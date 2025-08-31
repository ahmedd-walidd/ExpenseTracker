# Supabase Setup Instructions

## 1. Supabase Project Setup

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Note down your project URL and anon key from Settings > API

## 2. Database Tables

You'll need to create these tables in your Supabase dashboard (SQL Editor):

### Expenses Table
```sql
-- This table will store all expense records
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('incoming', 'outgoing')) NOT NULL,
  category TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS (Row Level Security)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies so users can only access their own expenses
CREATE POLICY "Users can view own expenses" ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expenses" ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expenses" ON expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own expenses" ON expenses FOR DELETE USING (auth.uid() = user_id);
```

### Profiles Table (Optional)
```sql
-- This table stores additional user profile information
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  default_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

## 3. Environment Configuration

1. Copy `.env.example` to `.env`
2. Replace the placeholder values with your actual Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 4. Authentication Setup

- Email/Password authentication is already configured
- Users will be automatically redirected to login if not authenticated
- User sessions are persisted using AsyncStorage

## 5. Features Included

- ✅ User authentication (sign up, sign in, sign out)
- ✅ Expense CRUD operations (create, read, update, delete)
- ✅ Real-time data synchronization
- ✅ Row-level security (users can only access their own data)
- ✅ Currency support with user preferences
- ✅ Expense categorization
- ✅ Statistics and totals calculation

## 6. Usage

Once configured, your app will:
- Require users to sign in before accessing expenses
- Automatically save expenses to Supabase
- Keep data synchronized across devices
- Provide secure, user-isolated data storage
