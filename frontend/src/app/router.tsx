import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login/LoginPage";
import Financial from "../pages/Financial/FinancialPage";
import { useAuthStore } from "../shared/stores/user.store";
import { Investment } from "../pages/Investment/InvestmentPage";
import Highlight from "../pages/Highlight/HighlightPage";
import { MainLayout } from "../components/MainApp";

const ProtectedRoute = ({ children }: any) => {
    const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};


export const router = createBrowserRouter([
    {
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/finance",
                element: <Financial />,
            },
            {
                path: "/invest",
                element: <Investment />,
            },
            {
                path: "/highlight",
                element: <Highlight />,
            },

        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
]);