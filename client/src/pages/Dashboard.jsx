import { useEffect, useState } from "react";

import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
    const { user } = useAuth();

    const [projectCount, setProjectCount] = useState(0);
    const [taskCount, setTaskCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    projectsResponse,
                    tasksResponse
                ] = await Promise.all([
                    api.get("/projects"),
                    api.get("/tasks")
                ]);

                setProjectCount(
                    projectsResponse.data.projects.length
                );

                setTaskCount(
                    tasksResponse.data.tasks.length
                );
            } catch (error) {
                console.error(
                    "Unable to load dashboard data",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <AppLayout>
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Welcome back, {user?.name}.
                    </p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <span>Your role</span>

                    <strong>
                        {user?.role}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Projects</span>

                    <strong>
                        {loading
                            ? "..."
                            : projectCount}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Tasks</span>

                    <strong>
                        {loading
                            ? "..."
                            : taskCount}
                    </strong>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;