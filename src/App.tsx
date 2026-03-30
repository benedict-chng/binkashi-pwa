import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { BinList } from './components/BinList';
import { BinForm } from './components/BinForm';
import { ToastProvider, useToast } from './components/Toast';
import { LoadingState } from './components/LoadingState';
import { useBin } from './hooks/useBin';
import type { BinFormData } from './types/bin';

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

function AppContent() {
  const { showToast } = useToast();

  useEffect(() => {
    // Listen for service worker updates (custom event from vite-plugin-pwa)
    const handleUpdate = () => {
      // Show toast notification about new version
      // User can refresh to get update
      showToast('New version available. Refresh to update.', 'info');
    };

    // Listen for custom event dispatched by vite-plugin-pwa
    window.addEventListener('swUpdate', handleUpdate);

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser');
      // Show a toast to inform the user
      setTimeout(() => {
        showToast('PWA features may be limited in this browser', 'info');
      }, 1000);
    }

    return () => {
      window.removeEventListener('swUpdate', handleUpdate);
    };
  }, [showToast]);

  return (
    <div className="min-h-screen bg-soft-linen">
      {/* Header */}
      <header className="bg-soft-linen shadow-sm border-b border-khaki-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Binkashi</h1>
          <AddBinButton />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<BinList />} />
          <Route path="/bins/new" element={<CreateBinPage />} />
          <Route path="/bins/:id/edit" element={<EditBinPage />} />
        </Routes>
      </main>
    </div>
  );
}

function AddBinButton() {
  return (
    <Link
      to="/bins/new"
      className="btn-primary bg-sky-surge text-black px-6 py-3 rounded-md text-base font-medium"
    >
      + Add Bin
    </Link>
  );
}

function CreateBinPage() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Form submission is handled by BinForm component
    // Just navigate back to list
    navigate('/');
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate('/')}
        className="text-dim-grey hover:text-black mb-4 font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-surge focus:ring-offset-2 rounded-md px-2 py-1"
      >
        ← Back to List
      </button>
      <div className="bg-white border border-khaki-beige rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-black mb-6 leading-tight">Create New Bin</h2>
        <BinForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

function EditBinPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const bin = useBin(parseInt(id!));

  if (!bin) {
    return <LoadingState message="Loading bin..." size="medium" />;
  }

  const handleSubmit = () => {
    navigate('/');
  };

  // Convert bin to BinFormData (exclude createdAt, updatedAt)
  const initialData: BinFormData = {
    name: bin.name,
    state: bin.state,
    inUseStartDate: bin.inUseStartDate,
    fermentingStartDate: bin.fermentingStartDate,
    image: bin.image,
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate('/')}
        className="text-dim-grey hover:text-black mb-4 font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-surge focus:ring-offset-2 rounded-md px-2 py-1"
      >
        ← Back to List
      </button>
      <div className="bg-white border border-khaki-beige rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-black mb-6 leading-tight">Edit Bin</h2>
        <BinForm onSubmit={handleSubmit} initialData={initialData} editMode binId={bin.id} />
      </div>
    </div>
  );
}

export default App;
