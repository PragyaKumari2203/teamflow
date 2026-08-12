import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AppLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />

            <div className="main-area">
                <Navbar />

                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;