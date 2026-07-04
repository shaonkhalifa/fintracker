-- Create the transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('deposit', 'expense')),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    person_or_purpose TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies (for this simple personal app, we allow public read, insert, update, and delete access)
-- In a production environment, you would restrict these policies to authenticated users.
CREATE POLICY "Allow public read access" ON public.transactions
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.transactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON public.transactions
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON public.transactions
    FOR DELETE USING (true);
