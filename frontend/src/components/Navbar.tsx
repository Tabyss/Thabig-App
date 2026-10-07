import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Wallet, Home, CreditCard, ChevronUp, ChevronDown } from "lucide-react";

interface MenuItem {
    route: string;
    label: string;
    icon: React.ElementType;
}

const menuItems: MenuItem[] = [
    { route: "/", label: "Home", icon: Home },
    { route: "/finance", label: "Wallet", icon: Wallet },
    { route: "/invest", label: "Home", icon: CreditCard },
];

const hideNavbarRoutes = ["/login", "/register", "/auth"];

export const Navbar: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

    if (shouldHideNavbar) {
        return null;
    }

    const handleMenuClick = (route: string) => {
        navigate(route);
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100">
            <div className="relative">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="md:hidden absolute -top-7 left-1/2 -translate-x-1/2 bg-steel-800 w-16 h-8 rounded-t-2xl flex items-center justify-center text-steel-50 transition-colors z-40"
                    aria-label="Toggle menu"
                >
                    {isExpanded ? (
                        <ChevronDown size={20} />
                    ) : (
                        <ChevronUp size={20} />
                    )}
                </button>

                <div
                    className={`bg-steel-800 py-3 px-4 rounded-2xl shadow-2xl relative z-50 grid grid-cols-5 md:flex gap-2 justify-center items-center transition-all duration-300`}
                >
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.route;

                        const isVisibleOnMobile = isExpanded || index < 5;

                        return (
                            <button
                                key={item.route}
                                onClick={() => handleMenuClick(item.route)}
                                title={item.label}
                                className={`w-max p-1 sm:p-2 rounded-2xl transition-all duration-200 flex items-center justify-center ${
                                    isVisibleOnMobile ? "flex" : "hidden"
                                } md:flex 
                                    ${
                                        isActive
                                            ? "bg-tangerine-400 text-steel-50 shadow-lg shadow-indigo-500/20"
                                            : "text-steel-300 hover:text-white hover:bg-[#2a3143]"
                                    }
                                `}
                            >
                                <item.icon size={16} strokeWidth={2} />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
