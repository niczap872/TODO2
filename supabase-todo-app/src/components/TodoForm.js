import { useState, useEffect } from 'react';
import { addTodo, updateTodo, getCategories, addCategory } from '../lib/supabase';

const TodoForm = ({ onClose, todo = null, onSuccess }) => {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(1);
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (todo) {
      setTask(todo.task || '');
      setDescription(todo.description || '');
      setDueDate(todo.due_date ? new Date(todo.due_date).toISOString().split('T')[0] : '');
      setPriority(todo.priority || 1);
      setCategory(todo.category || '');
    }
    
    fetchCategories();
  }, [todo]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await getCategories();
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Could not load categories. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!task.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const todoData = {
        task,
        description,
        due_date: dueDate || null,
        priority: Number(priority),
        category: category || null
      };
      
      let result;
      
      if (todo) {
        result = await updateTodo(todo.id, todoData);
      } else {
        result = await addTodo(todoData);
      }
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to save task');
      }
      
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (error) {
      console.error('Error saving todo:', error);
      setError(error.message || 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Generate a random pastel color
      const hue = Math.floor(Math.random() * 360);
      const color = `hsl(${hue}, 70%, 80%)`;
      
      const { data, error } = await addCategory({
        name: newCategory,
        color
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to add category');
      }
      
      setCategories([...categories, data[0]]);
      setCategory(data[0].id);
      setNewCategory('');
      setShowCategoryForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
      setError(error.message || 'Failed to add category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        {todo ? 'Edit Task' : 'Add New Task'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-1">
            Task*
          </label>
          <input
            type="text"
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
            className="input-field"
            placeholder="What needs to be done?"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field min-h-[100px]"
            placeholder="Add details about this task"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input-field"
            >
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          
          {showCategoryForm ? (
            <div className="flex">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="input-field flex-1 mr-2"
                placeholder="New category name"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={loading}
                className="btn-secondary"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowCategoryForm(false)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field flex-1 mr-2"
              >
                <option value="">No Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowCategoryForm(true)}
                className="btn-secondary"
              >
                New
              </button>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !task.trim()}
            className="btn-primary"
          >
            {loading ? 'Saving...' : todo ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
