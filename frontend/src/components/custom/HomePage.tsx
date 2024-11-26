import { Button } from '@/components/ui/button';
import { storeFiles } from '@/redux/slices/fileSlice';
import { UserFile } from '@/types';
import axios from 'axios';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        toast.loading('Fetching files...');
        const response = await axios.get<UserFile[]>(`${import.meta.env.VITE_BACKEND_URL}/api/file`);
        toast.dismiss();
        dispatch(storeFiles(response.data));
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch files');
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
