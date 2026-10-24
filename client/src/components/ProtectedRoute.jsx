import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div
                className="flex h-screen overflow-hidden bg-[#F4F3F1]"
                role="status"
                aria-busy="true"
            >
                <span className="sr-only">Loading your workspace...</span>

                <aside className="hidden w-[260px] shrink-0 flex-col border-r border-[#292929] bg-[#0A0A0A] px-6 py-7 md:flex">
                    <div className="flex items-center gap-3 border-b border-[#292929] pb-7">
                        <div className="h-9 w-1.5 rounded-full bg-[#FF7A45]" />
                        <div className="space-y-2">
                            <div className="h-4 w-24 animate-pulse rounded bg-[#292929]" />
                            <div className="h-3 w-32 animate-pulse rounded bg-[#202020]" />
                        </div>
                    </div>
                    <div className="mt-8 space-y-3">
                        {["w-4/5", "w-full", "w-3/4", "w-5/6"].map((width) => (
                            <div
                                key={width}
                                className={`h-11 animate-pulse rounded-xl bg-[#171717] ${width}`}
                            />
                        ))}
                    </div>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-[#292929] bg-[#1a1919] px-5 sm:px-7">
                        <div className="h-4 w-32 animate-pulse rounded bg-[#292929] md:hidden" />
                        <div className="ml-auto flex items-center gap-3">
                            <div className="hidden space-y-2 sm:block">
                                <div className="h-3 w-24 animate-pulse rounded bg-[#292929]" />
                                <div className="h-2.5 w-16 animate-pulse rounded bg-[#202020]" />
                            </div>
                            <div className="h-10 w-10 animate-pulse rounded-full bg-[#292929]" />
                        </div>
                    </header>

                    <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-7 lg:p-9">
                        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
                            <div className="space-y-3">
                                <div className="h-3 w-28 rounded bg-[#E5E0DC]" />
                                <div className="h-8 w-56 rounded bg-white" />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="h-28 rounded-xl border border-[#E3DED9] bg-white p-5"
                                    >
                                        <div className="h-3 w-20 rounded bg-[#E5E0DC]" />
                                        <div className="mt-5 h-7 w-14 rounded bg-[#F1F0EE]" />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                                <div className="h-72 rounded-xl border border-[#E3DED9] bg-white xl:col-span-2" />
                                <div className="h-72 rounded-xl border border-[#E3DED9] bg-white" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;