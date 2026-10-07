import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";

export const MainLayout = () => {
    return (
        <div className="p-4 bg-min-h-screen">
            <Header/>
            <Outlet />
            <Navbar />
        </div>
    );
};