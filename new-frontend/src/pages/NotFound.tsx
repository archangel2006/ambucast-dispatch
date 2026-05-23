import React from 'react';

export const NotFound: React.FC = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-2xl">Page Not Found</p>
      <p className="mt-2 text-slate-600">The page you're looking for doesn't exist.</p>
      <a href="/" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Back to Dashboard
      </a>
    </div>
  </div>
);

export default NotFound;
