import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-gray-100 p-4 flex justify-between items-center">
      <div className="flex space-x-4 items-center">
        <h1 className="text-xl font-bold">Swipe</h1>
        <Link to="/">
          <Button variant="ghost">Home</Button>
        </Link>
        <Link to="/your-files">
          <Button variant="ghost">Your Files</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;