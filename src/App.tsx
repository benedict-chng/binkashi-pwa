import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { BinList } from './components/BinList';
import { BinForm } from './components/BinForm';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-600">Binkashi</h1>
          <AddBinButton />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<BinList />} />
          <Route path="/bins/new" element={<CreateBinPage />} />
        </Routes>
      </main>
    </div>
    </ToastProvider>
  );
}

function AddBinButton() {
  return (
    <Link
      to="/bins/new"
      className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors text-lg"
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
    <div className="w-full max-w-lg mx-auto px-4">
      <button
        onClick={() => navigate('/')}
        className="text-gray-600 hover:text-gray-900 mb-4"
      >
        ← Back to List
      </button>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Bin</h2>
        <BinForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default App;
