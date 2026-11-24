import React from 'react';
import { useBookstore } from '../context/BookstoreContext';

export const Toast = () => {
  const { toast } = useBookstore();

  if (!toast.show) return null;

  const isError = toast.type === 'error';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl text-on-primary ${
        isError ? 'bg-error' : 'bg-primary'
      }`}
    >
      <span className="material-symbols-outlined text-[20px] text-secondary-container">
        {isError ? 'error' : 'check_circle'}
      </span>
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
};

export default Toast;
