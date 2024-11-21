import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import Navigation from '@/components/custom/Navigation';
import HomePage from '@/components/custom/HomePage';
import YourFiles from '@/pages/YourFiles';
import FileBillsPage from '@/pages/FileBillsPage';
import BillDetailsPage from '@/pages/BillDetails';
import { Toaster } from '@/components/ui/toaster';
import FileUpload from '@/components/custom/FileUpload';

function App() {
  
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col h-screen">
          <Navigation />
          <div className="flex-grow overflow-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/your-files" element={<YourFiles />} />
              <Route path="/upload-file" element={<FileUpload />} />
              <Route path="/file-bills" element={<FileBillsPage />} />
              <Route path="/bill-details" element={<BillDetailsPage />} />
              <Route path='/auth'>
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