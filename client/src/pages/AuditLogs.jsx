import { useEffect, useState } from "react";

import AppLayout from "../components/AppLayout";
import api from "../services/api";

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchLogs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/audit-logs");

            setLogs(response.data.logs);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load audit logs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    return (
        <AppLayout>
            <div className="page-header">
                <div>
                    <h1>Audit Logs</h1>

                    <p>
                        Track important activities performed
                        within the application.
                    </p>
                </div>
            </div>

            {loading && (
                <div className="state-message">
                    Loading audit logs...
                </div>
            )}

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            {!loading && !error && logs.length === 0 && (
                <div className="empty-state">
                    <h3>No activity recorded</h3>

                    <p>
                        Audit activity will appear here when
                        users perform important actions.
                    </p>
                </div>
            )}

            {!loading && !error && logs.length > 0 && (
                <div className="audit-table-wrapper">
                    <table className="audit-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>User</th>
                                <th>Role</th>
                                <th>Action</th>
                                <th>Entity</th>
                                <th>Description</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.map((log) => (
                                <tr key={log._id}>
                                    <td>
                                        {formatDate(
                                            log.createdAt
                                        )}
                                    </td>

                                    <td>
                                        {log.user?.name ||
                                            "Unknown"}
                                    </td>

                                    <td>
                                        <span className="role-badge">
                                            {log.user?.role ||
                                                "UNKNOWN"}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={`audit-action ${log.action.toLowerCase()}`}
                                        >
                                            {log.action}
                                        </span>
                                    </td>

                                    <td>
                                        {log.entity}
                                    </td>

                                    <td>
                                        {log.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AppLayout>
    );
};

export default AuditLogs;