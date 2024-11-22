import { Button } from '@/components/ui/button';
import { storeFiles } from '@/redux/slices/fileSlice';
import { UserFile } from '@/types';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get<UserFile[]>(`${window.location.origin}/api/file`);
        dispatch(storeFiles(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchFiles();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold">Welcome to Swipe</h1>
      <Button
        className="mt-4"
        onClick={() => navigate('/upload-file')}
      >
        Get Started
      </Button>
    </div>
  )
}

export default HomePage;
