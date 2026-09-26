import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <AlertTriangle size={64} className="text-orange-500 mb-6" />
      <h1 className="text-4xl font-bold text-slate-800 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center space-x-2 bg-[#138808] hover:bg-green-800 text-white px-6 py-3 rounded-md font-semibold transition-all shadow-sm"
      >
        <Home size={18} />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};

export default NotFound;
