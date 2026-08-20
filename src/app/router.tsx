import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../features/home/page/Home";
import { ROUTES } from "../config";
import Auth from "../features/auth/pages/Auth";
import About from "../features/about/page/About";
import Contact from "../features/contact/page/Contact";
import Dashboard from "../features/dashboard/page/Dashboard";
import History from "../features/history/pages/History";
import HistoryDetail from "../features/history/pages/HistoryDetail";
import AnalyzeIntro from "../features/analysis/pages/AnalyzeIntro";
import Guidance from "../features/analysis/pages/Guidance";
import Analyze from "../features/analysis/pages/Analyze";
import Results from "../features/results/page/Results";
import ProtectedRoute from "../routes/ProtectedRoute";
import Success from "../features/auth/pages/Success";
import AuthCallback from "../features/auth/pages/AuthCallback";

export const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: ROUTES.ABOUT,
                element: <About />
            },
            {
                path: ROUTES.CONTACT,
                element: <Contact />
            },
            {
                path: ROUTES.LOGIN,
                element: <Auth />
            },
            {
                path: ROUTES.SUCCESS,
                element: <Success />
            },
            {
                path: ROUTES.AUTH_CALLBACK,
                element: <AuthCallback />
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: ROUTES.DASHBOARD,
                        element: <Dashboard />
                    },
                    {
                        path: ROUTES.HISTORY,
                        element: <History />
                    },
                    {
                        path: ROUTES.HISTORY_DETAIL,
                        element: <HistoryDetail />
                    },
                    {
                        path: ROUTES.ANALYZE,
                        element: <AnalyzeIntro />
                    },
                    {
                        path: ROUTES.GUIDANCE,
                        element: <Guidance />
                    },
                    {
                        path: ROUTES.LIVECAM,
                        element: <Analyze initialMode="camera" />
                    },
                    {
                        path: ROUTES.UPLOAD,
                        element: <Analyze initialMode="upload" />
                    },
                    {
                        path: ROUTES.RESULTS,
                        element: <Results />
                    }
                ]
            },

        ]
    }
])