import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import Navigation from '@/components/custom/Navigation';
import HomePage from '@/components/custom/HomePage';
import BillDetailsPage from '@/pages/BillDetails';
import { Toaster } from '@/components/ui/toaster';
import FileUpload from '@/components/custom/FileUpload';
import Files from '@/pages/Files';
import Bills from '@/pages/Bills';
import { Toaster as ReactHotToaster } from 'react-hot-toast';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col h-screen">
          <ReactHotToaster />
          <Navigation />
          <div className="flex-grow overflow-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              <Route path="/files" element={<Files />} />
              <Route path="/file/:fileId" element={<Bills />} />
              <Route path="/file/:fileId/:billId" element={<BillDetailsPage />} />
              
              <Route path="/upload-file" element={<FileUpload />} />
              
              <Route path="/auth">
                <Route path="signin" element={<div>SignIn</div>} />
                <Route path="signup" element={<div>SignUp</div>} />
              </Route>
            </Routes>
          </div>
          <Toaster />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
