
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { user } = useAuth();

    const linkClass = ({ isActive }) =>
        `sidebar-link ${isActive ? "active" : ""}`;

    const handleLinkClick = () => {
        // Close sidebar after clicking a link on mobile
        setSidebarOpen(false);
    };

    return (
        <>
            {/* Dark overlay */}
            <div
                className={`sidebar-overlay ${
                    sidebarOpen ? "show" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            <aside
                className={`sidebar ${
                    sidebarOpen ? "sidebar-open" : ""
                }`}
            >

                {/* Mobile close button */}
                <button
                    className="mobile-close-button"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close menu"
                >
                    ×
                </button>

                <div className="sidebar-brand">
                    <h2>TeamFlow</h2>
                    <span>Project Management</span>
                </div>

                <nav className="sidebar-nav">

                    <NavLink
                        to="/dashboard"
                        className={linkClass}
                        onClick={handleLinkClick}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/projects"
                        className={linkClass}
                        onClick={handleLinkClick}
                    >
                        Projects
                    </NavLink>

                    <NavLink
                        to="/tasks"
                        className={linkClass}
                        onClick={handleLinkClick}
                    >
                        Tasks
                    </NavLink>

                    {user?.role === "ADMIN" && (
                        <>
                            <NavLink
                                to="/users"
                                className={linkClass}
                                onClick={handleLinkClick}
                            >
                                Users
                            </NavLink>

                            <NavLink
                                to="/audit-logs"
                                className={linkClass}
                                onClick={handleLinkClick}
                            >
                                Audit Logs
                            </NavLink>
                        </>
                    )}

                </nav>

                <div className="sidebar-role">
                    <span>Signed in as</span>
                    <strong>{user?.role}</strong>
                </div>

            </aside>
        </>
    );
};

export default Sidebar;