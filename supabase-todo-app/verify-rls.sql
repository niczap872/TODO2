-- Check if RLS is enabled for todos table
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'todos';

-- Check RLS policies for todos table
SELECT 
  policyname, 
  tablename, 
  permissive, 
  roles, 
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'todos' 
ORDER BY policyname;

-- Check if RLS is enabled for categories table
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'categories';

-- Check RLS policies for categories table
SELECT 
  policyname, 
  tablename, 
  permissive, 
  roles, 
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'categories' 
ORDER BY policyname;
