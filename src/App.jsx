import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnalysisProvider } from './context/AnalysisContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ROUTES } from './config';

// Pages
import SmartCameraPage from './pages/SmartCameraPage';
import AnalyzeIntroPage from './pages/AnalyzeIntroPage';
import ResultsPage from './pages/ResultsPage';
import DashboardPage from './pages/DashboardPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import AuthPage from './pages/AuthPage';
import Home from './pages/HomePage';
import HistoryListPage from './pages/HistoryListPage';
import IntroWebPage from './pages/IntroWebPage';
import AboutPage from './pages/AboutPage';
import PaperPage from './pages/PaperPage';
import ContactPage from './pages/ContactPage';
import GuidancePage from './pages/GuidancePage';
import SuccessPage from './pages/SuccessPage';
import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AnalysisProvider>
              <Routes>

                <Route path={ROUTES.HOME} element={<GuestRoute><Home /></GuestRoute>} />
                <Route path={ROUTES.INTRO_WEB} element={<GuestRoute><IntroWebPage /></GuestRoute>} />
                <Route path={ROUTES.LOGIN} element={<GuestRoute><AuthPage /></GuestRoute>} />
                <Route path={ROUTES.REGISTER} element={<GuestRoute><AuthPage /></GuestRoute>} />

                {/* --- PROTECTED (Wajib Login) --- */}
                <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/history/:id" element={<ProtectedRoute><HistoryDetailPage /></ProtectedRoute>} />
                <Route path={ROUTES.HISTORY_LIST} element={<ProtectedRoute><HistoryListPage /></ProtectedRoute>} />


                {/* --- PUBLIC (Bisa diakses siapa saja) --- */}
                <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                <Route path={ROUTES.PAPER} element={<PaperPage />} />
                <Route path={ROUTES.CONTACT} element={<ContactPage />} />
                <Route path={ROUTES.SUCCESS} element={<SuccessPage />} />
                <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
                <Route path={ROUTES.ANALYZE} element={<AnalyzeIntroPage />} />
                <Route path={ROUTES.GUIDANCE} element={<GuidancePage />} />
                <Route path={ROUTES.LIVECAM} element={<SmartCameraPage initialMode="camera" />} />
                <Route path={ROUTES.UPLOAD} element={<SmartCameraPage initialMode="upload" />} />

                {/* Fallback - Jika rute tidak ditemukan, balikkan ke Home (GuestRoute akan handle auto-redirect jika sudah login) */}
                <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
              </Routes>
            </AnalysisProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;