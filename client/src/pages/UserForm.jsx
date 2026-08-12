import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";

const UserForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "MEMBER"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.post("/users", formData);

            navigate("/users");
        } catch (error) {
            const validationErrors =
                error.response?.data?.errors;

            if (validationErrors?.length) {
                setError(
                    validationErrors
                        .map((item) => item.msg)
                        .join(", ")
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    "Unable to create user"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="page-header">
                <div>
                    <h1>Add User</h1>

                    <p>
                        Create a new user and assign their role.
                    </p>
                </div>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Temporary Password</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 8 characters"
                            minLength="8"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Role</label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="MEMBER">
                                Member
                            </option>

                            <option value="MANAGER">
                                Manager
                            </option>

                            <option value="ADMIN">
                                Admin
                            </option>
                        </select>
                    </div>

                    {error && (
                        <div className="error-box">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate("/users")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default UserForm;