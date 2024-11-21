import React from 'react';
import FileUpload from '@/components/custom/FileUpload';

const HomePage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <FileUpload />
    </div>
  );
};

export default HomePage;