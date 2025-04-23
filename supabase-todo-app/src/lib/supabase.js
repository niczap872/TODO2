import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export const googleSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  return { data, error };
}

// Get the current authenticated user's ID
const getUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  return user.id;
}

// Todo functions with enhanced error handling
export const getTodos = async () => {
  try {
    // Make sure user is authenticated before fetching
    const userId = await getUserId();
    
    console.log('Fetching todos for user:', userId);
    
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error fetching todos:', error);
      throw error;
    }
    
    console.log('Fetched todos:', data?.length || 0);
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching todos:', error);
    return { data: [], error };
  }
}

export const addTodo = async (todo) => {
  try {
    // Make sure user is authenticated
    const userId = await getUserId();
    
    // Ensure user_id is set correctly
    const todoWithUserId = {
      ...todo,
      user_id: userId
    };
    
    console.log('Adding todo:', todoWithUserId);
    
    const { data, error } = await supabase
      .from('todos')
      .insert([todoWithUserId])
      .select();
    
    if (error) {
      console.error('Supabase error adding todo:', error);
      throw error;
    }
    
    console.log('Todo added successfully:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error adding todo:', error);
    return { data: null, error };
  }
}

export const updateTodo = async (id, updates) => {
  try {
    // Make sure user is authenticated
    const userId = await getUserId();
    
    console.log('Updating todo:', id, updates);
    
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId) // Add this extra check for security
      .select();
    
    if (error) {
      console.error('Supabase error updating todo:', error);
      throw error;
    }
    
    console.log('Todo updated successfully:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error updating todo:', error);
    return { data: null, error };
  }
}

export const deleteTodo = async (id) => {
  try {
    // Make sure user is authenticated
    const userId = await getUserId();
    
    console.log('Deleting todo:', id);
    
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Add this extra check for security
    
    if (error) {
      console.error('Supabase error deleting todo:', error);
      throw error;
    }
    
    console.log('Todo deleted successfully');
    return { error: null };
  } catch (error) {
    console.error('Error deleting todo:', error);
    return { error };
  }
}

// Categories
export const getCategories = async () => {
  try {
    // Make sure user is authenticated
    const userId = await getUserId();
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Supabase error fetching categories:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: [], error };
  }
}

export const addCategory = async (category) => {
  try {
    // Make sure user is authenticated
    const userId = await getUserId();
    
    // Ensure user_id is set correctly
    const categoryWithUserId = {
      ...category,
      user_id: userId
    };
    
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryWithUserId])
      .select();
    
    if (error) {
      console.error('Supabase error adding category:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error adding category:', error);
    return { data: null, error };
  }
}
