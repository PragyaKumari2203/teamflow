import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const { user } = useAuth();

    const linkClass = ({ isActive }) =>
        `sidebar-link ${isActive ? "active" : ""}`;

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h2>TeamFlow</h2>
                <span>Project Management</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/dashboard"
                    className={linkClass}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/projects"
                    className={linkClass}
                >
                    Projects
                </NavLink>

                <NavLink
                    to="/tasks"
                    className={linkClass}
                >
                    Tasks
                </NavLink>

                {user?.role === "ADMIN" && (
                    <>
                        <NavLink
                            to="/users"
                            className={linkClass}
                        >
                            Users
                        </NavLink>

                        <NavLink
                            to="/audit-logs"
                            className={linkClass}
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
    );
};

export default Sidebar;