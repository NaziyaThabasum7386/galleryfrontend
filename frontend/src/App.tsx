import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import GalleryManagement from './pages/GalleryManagement';
import GalleryUpload from './pages/GalleryUpload';
import { Button } from './components/ui/button';

function NavigationButtons(): JSX.Element {
  const navigate = useNavigate();
  return (
    <div className="p-4 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto flex gap-3">
        <Button onClick={() => navigate('/gallery-management')} className="mr-2">
          Gallery Management
        </Button>
        <Button onClick={() => navigate('/gallery-upload')}>
          Gallery Upload
        </Button>
      </div>
    </div>
  );
}

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <NavigationButtons />
        <Routes>
          <Route path="/" element={<GalleryManagement />} />
          <Route path="/gallery-management" element={<GalleryManagement />} />
          <Route path="/gallery-upload" element={<GalleryUpload />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
