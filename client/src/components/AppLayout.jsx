



import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AppLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-layout">

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="main-area">

                <Navbar
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="page-content">
                    {children}
                </main>

            </div>

        </div>
    );
};

export default AppLayout;