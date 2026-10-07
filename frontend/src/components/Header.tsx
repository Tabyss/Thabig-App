import { useLocation } from "react-router-dom";
import { Text } from "./Text";
import { MdLogout } from "react-icons/md";
import { useAuthStore } from "../shared/stores/user.store";

const Header = () => {
    const location = useLocation();

    const logout = useAuthStore((state: any) => state.logout);

    const getPageTitle = (pathname: string) => {
        switch (pathname) {
            case "/finance":
                return "Financial";
            case "/invest":
                return "Investment";
            case "/highlight":
                return "Highlight";
            default:
                return "Dashboard";
        }
    };

    const title = getPageTitle(location.pathname);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="flex justify-between items-center py-1.5 px-3 mb-4 rounded-xl bg-steel-900">
            <Text as="h2" variant="h4Bold" className="text-steel-50">
                {title}
            </Text>

            <button
                onClick={handleLogout}
                className="flex justify-center items-center rounded-full bg-steel-50 size-7 cursor-pointer hover:bg-gray-200 transition-colors"
                title="Logout"
            >
                <MdLogout className="text-steel-900" />
            </button>
        </div>
    );
};

export default Header;
