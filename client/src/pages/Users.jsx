import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/users");

            setUsers(response.data.users);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load users"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <AppLayout>
            <div className="page-header">
                <div>
                    <h1>Users</h1>

                    <p>
                        Manage users and their application roles.
                    </p>
                </div>

                <Link
                    to="/users/new"
                    className="primary-button"
                >
                    + Add User
                </Link>
            </div>

            {loading && (
                <div className="state-message">
                    Loading users...
                </div>
            )}

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="user-grid">
                    {users.map((user) => (
                        <div
                            className="user-card"
                            key={user._id}
                        >
                            <div className="user-card-header">
                                <div className="member-avatar">
                                    {user.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <span className="role-badge">
                                    {user.role}
                                </span>
                            </div>

                            <h3>{user.name}</h3>

                            <p>{user.email}</p>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
};

export default Users;