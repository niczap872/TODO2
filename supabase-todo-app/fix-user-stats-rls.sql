-- Add missing RLS policies for user_stats table
DO $$
BEGIN
    -- Check if the policy already exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_stats' 
        AND policyname = 'Users can insert their own stats'
    ) THEN
        CREATE POLICY "Users can insert their own stats" 
        ON user_stats FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_stats' 
        AND policyname = 'Users can update their own stats'
    ) THEN
        CREATE POLICY "Users can update their own stats" 
        ON user_stats FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Modify the update_user_stats_on_complete function to handle RLS
CREATE OR REPLACE FUNCTION update_user_stats_on_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_complete = TRUE AND OLD.is_complete = FALSE THEN
    -- Use the security definer option to bypass RLS
    INSERT INTO user_stats (user_id, date, tasks_completed)
    VALUES (NEW.user_id, CURRENT_DATE, 1)
    ON CONFLICT (user_id, date)
    DO UPDATE SET tasks_completed = user_stats.tasks_completed + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Modify the update_user_stats_on_create function to handle RLS
CREATE OR REPLACE FUNCTION update_user_stats_on_create()
RETURNS TRIGGER AS $$
BEGIN
  -- Use the security definer option to bypass RLS
  INSERT INTO user_stats (user_id, date, tasks_created)
  VALUES (NEW.user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET tasks_created = user_stats.tasks_created + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
