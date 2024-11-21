import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentFile, storeFiles } from '@/redux/slices/fileSlice';
import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { UserFile } from '@/types';

const Files: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxFiles = useSelector((state: RootState) => state.files.files);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get<UserFile[]>('http://localhost:3217/api/file');
        dispatch(storeFiles(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchFiles();
  }, []);

  const handleFileClick = (file: any) => {
    dispatch(setCurrentFile(file));
    navigate('/file/' + file._id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Files</h1>
      <div className="grid grid-cols-3 gap-6">
        {reduxFiles.map((file,index) => (
          <Card 
            key={index} 
            onClick={() => handleFileClick(file)}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardTitle className="p-4">{file.name}</CardTitle>
            <CardDescription className="px-4 pb-2">
              {file.bills.length} Bills
            </CardDescription>
            <CardContent>
              <p className="text-sm text-gray-500">
                Uploaded on: {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Files;