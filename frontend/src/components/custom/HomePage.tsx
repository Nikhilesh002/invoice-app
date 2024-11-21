import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

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
