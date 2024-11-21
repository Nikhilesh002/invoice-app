import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentFile } from '@/redux/slices/fileSlice';
import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RootState } from '@/redux/store';
import axios from 'axios';

const YourFiles: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxFiles = useSelector((state: RootState) => state.files.files);
  const [files, setFiles] = useState<any[]>(reduxFiles);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:3217/api/files');
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    if (reduxFiles.length === 0) {
      fetchFiles();
    }
  }, [reduxFiles]);

  const handleFileClick = (file: any) => {
    dispatch(setCurrentFile(file));
    navigate('/file-bills');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Files</h1>
      <div className="grid grid-cols-3 gap-6">
        {files.map((file) => (
          <Card 
            key={file.id} 
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

export default YourFiles;