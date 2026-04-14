import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AnalysisProvider>
              <Routes>
                {/* Home */}
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                <Route path={ROUTES.PAPER} element={<PaperPage />} />
                <Route path={ROUTES.CONTACT} element={<ContactPage />} />

                {/* Intro Page */}
                <Route path={ROUTES.INTRO_WEB} element={<IntroWebPage />} />

                {/* Main pages */}
                <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path="/history/:id" element={<HistoryDetailPage />} />
                <Route path={ROUTES.HISTORY_LIST} element={<HistoryListPage />} />

                {/* Analysis Routes */}
                <Route path={ROUTES.ANALYZE} element={<AnalyzeIntroPage />} />
                <Route path={ROUTES.GUIDANCE} element={<GuidancePage />} />
                <Route path={ROUTES.LIVECAM} element={<SmartCameraPage initialMode="camera" />} />
                <Route path={ROUTES.UPLOAD} element={<SmartCameraPage initialMode="upload" />} />

                {/* Auth pages */}
                <Route path={ROUTES.LOGIN} element={<AuthPage />} />
                <Route path={ROUTES.REGISTER} element={<AuthPage />} />

                {/* Fallback */}
                <Route path="*" element={<Home />} />
              </Routes>
            </AnalysisProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;