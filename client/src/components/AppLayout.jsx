import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AppLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div
            className="
                h-screen
                overflow-hidden
                bg-[#F4F3F1]
            "
        >

            {/* =====================================================
                SIDEBAR
            ====================================================== */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />


            {/* =====================================================
                MAIN AREA
            ====================================================== */}
            <div
                className="
                    h-screen
                    md:ml-[260px]
                    flex
                    flex-col
                    overflow-hidden
                "
            >

                {/* =================================================
                    NAVBAR
                ================================================== */}
                <div className="shrink-0">
                    <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                    />
                </div>


                {/* =================================================
                    PAGE CONTENT

                    THIS is the single AppLayout scrollbar.

                    Dashboard uses this scrollbar.
                ================================================== */}
                <main
                    className="
                        flex-1
                        min-h-0
                        overflow-y-auto
                        overflow-x-hidden
                    "
                >
                    {children}
                </main>

            </div>

        </div>
    );
};

export default AppLayout;