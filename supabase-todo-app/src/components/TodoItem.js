import { useState } from 'react';
import { format } from 'date-fns';

const TodoItem = ({ todo, onToggleComplete, onEdit, onDelete, categoryColor, categories }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const categoryName = categories?.find(cat => cat.id === todo.category)?.name || '';

  const priorityLabels = {
    1: { text: 'Low', color: 'bg-blue-100 text-blue-800' },
    2: { text: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    3: { text: 'High', color: 'bg-red-100 text-red-800' }
  };

  const priorityLabel = priorityLabels[todo.priority] || priorityLabels[1];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center p-4">
        <div>
          <input
            type="checkbox"
            checked={todo.is_complete}
            onChange={() => onToggleComplete(todo.id, todo.is_complete)}
            className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
        
        <div className="ml-3 flex-1">
          <div 
            className={`text-sm font-medium ${todo.is_complete ? 'line-through text-gray-400' : 'text-gray-700'}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {todo.task}
          </div>
          
          <div className="flex items-center mt-1 space-x-2">
            {todo.due_date && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {format(new Date(todo.due_date), 'MMM d, yyyy')}
              </span>
            )}
            
            {todo.priority && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityLabel.color}`}>
                {priorityLabel.text}
              </span>
            )}
            
            {categoryName && (
              <span 
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
              >
                {categoryName}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-1 rounded-full text-gray-400 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1 rounded-full text-gray-400 hover:text-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {isExpanded && todo.description && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          <p className="text-sm text-gray-600">{todo.description}</p>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
