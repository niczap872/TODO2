import { useState, useEffect } from 'react';
import { getTodos, updateTodo, deleteTodo } from '../lib/supabase';
import TodoItem from './TodoItem';
import { format } from 'date-fns';

const TodoList = ({ onEdit, filter, searchQuery, categories, refreshTrigger = 0 }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await getTodos();
      
      if (error) throw new Error(error.message || 'Failed to fetch tasks');
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Could not load tasks. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch todos when the component mounts or refreshTrigger changes
  useEffect(() => {
    fetchTodos();
    console.log('Fetching todos, trigger:', refreshTrigger);
  }, [refreshTrigger]);

  const handleToggleComplete = async (id, isComplete) => {
    try {
      const { error } = await updateTodo(id, { is_complete: !isComplete });
      if (error) throw new Error(error.message || 'Failed to update task');
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, is_complete: !isComplete } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await deleteTodo(id);
      if (error) throw new Error(error.message || 'Failed to delete task');
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const filteredTodos = todos.filter(todo => {
    // Filter by status
    if (filter === 'completed' && !todo.is_complete) return false;
    if (filter === 'active' && todo.is_complete) return false;
    
    // Filter by search
    if (searchQuery && !todo.task.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Filter by category if a category is selected
    if (filter?.startsWith('category:') && todo.category !== filter.split(':')[1]) return false;
    
    return true;
  });

  const getCategoryColor = (categoryId) => {
    const category = categories?.find(cat => cat.id === categoryId);
    return category?.color || '#6B7280'; // Default gray
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <div className="text-xl mb-2">Error</div>
        <p>{error}</p>
        <button 
          onClick={fetchTodos}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-gray-400 text-xl">No tasks found</div>
        <p className="text-gray-500 mt-2">
          {filter === 'all' 
            ? 'Create a new task to get started' 
            : 'Try changing your filters'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={handleToggleComplete}
          onEdit={() => onEdit(todo)}
          onDelete={handleDelete}
          categoryColor={getCategoryColor(todo.category)}
          categories={categories}
        />
      ))}
    </div>
  );
};

export default TodoList;
