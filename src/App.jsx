import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import ViewFlipbook from './pages/ViewFlipbook';
import AuthModal from './components/AuthModal';
import ShareModal from './components/ShareModal';
import AdminSidebar from './components/AdminSidebar';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';
import { EbookService } from './services/ebookService';
import { ChevronLeft, ChevronRight, Share2, RotateCcw, Loader2 } from 'lucide-react';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};

function AppContent() {
  const { user, signOut, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-redirect admin to dashboard if they land on home
  React.useEffect(() => {
    console.log('DEBUG: App Redirect Effect - isAdmin:', isAdmin, 'loading:', authLoading, 'path:', location.pathname);
    if (!authLoading && isAdmin && location.pathname === '/') {
      console.log('DEBUG: Triggering redirect to /admin');
      navigate('/admin');
    }
  }, [isAdmin, authLoading, location.pathname, navigate]);

  const [pages, setPages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [ebookId, setEbookId] = useState(null);
  const [ebookTitle, setEbookTitle] = useState('');
  const [currentOrientation, setCurrentOrientation] = useState('portrait');
  const flipbookRef = useRef(null);


  const handleFilesSelected = async (files, type) => {
    if (!files) {
      handleReset();
      return;
    }

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (type === 'pdf') {
      setIsProcessing(true);
      setPdfFile(files[0]);
    } else {
      // Images
      setIsProcessing(true);
      try {
        const imageUrls = [];
        const storagePaths = [];
        for (const file of files) {
          const path = await EbookService.uploadFile(user.id, file);
          const publicUrl = EbookService.getPublicUrl(path);
          imageUrls.push(publicUrl);
          storagePaths.push(path);
        }

        const title = files[0].name.split('.')[0] || 'Untitled Ebook';
        const ebook = await EbookService.createEbook({
          title: title,
          filePath: user.id,
          pages: storagePaths,
          userId: user.id,
          type: 'images'
        });



        setEbookId(ebook.id);
        setEbookTitle(title);
        setPages(imageUrls);
        setIsShareModalOpen(true);
      } catch (err) {
        console.error('Upload Error Details:', err);
        alert(`Gagal mengupload gambar: ${err.message || 'Error tidak dikenal'}`);
      } finally {
        setIsProcessing(false);
      }

    }
  };

  const handlePDFProcessingComplete = async (renderedPages, orientation) => {
    // For PDF, we'll actually upload the original PDF and use renderedPages for instant preview
    setPages(renderedPages);
    setCurrentOrientation(orientation);

    if (pdfFile && user) {
      try {
        const title = pdfFile.name.split('.')[0] || 'Untitled Ebook';
        const path = await EbookService.uploadFile(user.id, pdfFile);
        const ebook = await EbookService.createEbook({
          title: title,
          filePath: path,
          userId: user.id,
          type: 'pdf',
          orientation: orientation // 'portrait' or 'landscape'
        });
        setEbookId(ebook.id);
        setEbookTitle(title);
        setIsShareModalOpen(true);
      } catch (err) {
        console.error('PDF Upload error details:', err);
        alert(`Gagal mengupload PDF ke storage: ${err.message}`);
      }

    }


    setIsProcessing(false);
    setPdfFile(null);
  };


  const handleReset = () => {
    setPages([]);
    setPdfFile(null);
    setIsProcessing(false);
    setEbookId(null);
  };

  const handleShare = () => {
    if (!ebookId) return;
    const shareUrl = `${window.location.origin}/v/${ebookId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link share telah disalin ke clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        ebookId={ebookId}
        title={ebookTitle}
      />

      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          isAdmin ? (
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/library" element={<div className="p-8 text-neutral-500">Global Library (Coming Soon)</div>} />
                <Route path="/users" element={<div className="p-8 text-neutral-500">User Management (Coming Soon)</div>} />
              </Routes>
            </AdminLayout>
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">403</h1>
                <p className="text-neutral-500">Anda tidak memiliki akses ke halaman ini.</p>
                <button onClick={() => window.location.href = '/'} className="mt-6 px-6 py-2 bg-blue-600 rounded-full">Pulang</button>
              </div>
            </div>
          )
        } />

        {/* Public/User Routes */}
        <Route path="*" element={
          <>
            <Header
              user={user}
              authLoading={authLoading}
              pages={pages}
              onShare={handleShare}
              onReset={handleReset}
              onLoginClick={() => setIsAuthModalOpen(true)}
              onLogoutClick={signOut}
              ebookId={ebookId}
              isAdmin={isAdmin}
            />
            <Routes>
              <Route path="/" element={
                <LandingPage
                  pages={pages}
                  orientation={currentOrientation}
                  isProcessing={isProcessing}
                  pdfFile={pdfFile}
                  handleFilesSelected={handleFilesSelected}
                  handlePDFProcessingComplete={handlePDFProcessingComplete}
                  handleReset={handleReset}
                  flipbookRef={flipbookRef}
                />
              } />
              <Route path="/v/:id" element={<ViewFlipbook />} />
            </Routes>
          </>
        } />
      </Routes>


      {/* Global Viewer Controls for Landing Page only */}
      {pages.length > 0 && window.location.pathname === '/' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full shadow-2xl z-50">
          <button
            onClick={() => flipbookRef.current?.prevPage()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="text-sm font-medium text-neutral-400">
            {pages.length} Halaman
          </div>

          <button
            onClick={() => flipbookRef.current?.nextPage()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Footer */}
      {!pages.length && (
        <footer className="p-8 text-center text-neutral-600 text-xs uppercase tracking-widest">
          &copy; 2026 Antigravity Labs &bull; Premium Flipbook Experience
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

