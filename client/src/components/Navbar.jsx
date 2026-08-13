
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <header className="topbar">

            {/* Mobile hamburger */}
            <button
                className="mobile-menu-button"
                onClick={onMenuClick}
                aria-label="Open menu"
            >
                ☰
            </button>

            <div className="topbar-user">

                <div>
                    <strong>{user?.name}</strong>
                    <span>{user?.role}</span>
                </div>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>

        </header>
    );
};

export default Navbar;