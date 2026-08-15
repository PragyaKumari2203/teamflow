import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { user } = useAuth();

    const handleLinkClick = () => {
        setSidebarOpen(false);
    };

    const linkClass = ({ isActive }) =>
        `
        group relative flex items-center
        px-4 py-3
        rounded-xl
        text-sm font-medium

        transition-all duration-200 ease-out

        ${
            isActive
                ? `
                    bg-[#171717]
                    text-[#FF7A45]
                    shadow-[inset_0_0_0_1px_rgba(255,122,69,0.12)]
                  `
                : `
                    text-[#999999]
                    hover:bg-[#151515]
                    hover:text-[#EEEEEE]
                    hover:translate-x-1
                  `
        }
        `;

    return (
        <>
            {/* =====================================================
                MOBILE OVERLAY
            ====================================================== */}
            <div
                className={`
                    fixed
                    inset-0
                    bg-black/60
                    backdrop-blur-[2px]
                    z-40
                    md:hidden

                    transition-all
                    duration-300

                    ${
                        sidebarOpen
                            ? "opacity-100 visible"
                            : "opacity-0 invisible"
                    }
                `}
                onClick={() => setSidebarOpen(false)}
            />

            {/* =====================================================
                FIXED SIDEBAR
            ====================================================== */}
            <aside
                className={`
                    fixed
                    top-0
                    left-0
                    z-50

                    w-[260px]
                    h-screen

                    bg-[#0A0A0A]
                    border-r border-[#292929]

                    text-white

                    flex
                    flex-col

                    transform
                    transition-transform
                    duration-300
                    ease-out

                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full md:translate-x-0"
                    }

                    overflow-hidden
                `}
            >

                {/* =================================================
                    MOBILE CLOSE BUTTON
                ================================================== */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close menu"
                    className="
                        md:hidden

                        absolute
                        top-5
                        right-5

                        w-9
                        h-9

                        rounded-lg

                        flex
                        items-center
                        justify-center

                        bg-[#171717]
                        border border-[#292929]

                        text-[#999999]
                        text-xl

                        hover:bg-[#222222]
                        hover:text-white
                        hover:border-[#3A3A3A]

                        hover:rotate-90

                        transition-all
                        duration-200
                    "
                >
                    ×
                </button>


                {/* =================================================
                    BRAND
                ================================================== */}
                <div
                    className="
                        px-6
                        pt-7
                        pb-7

                        border-b
                        border-[#292929]
                    "
                >
                    <div className="flex items-center gap-3">

                        {/* Orange accent */}
                        <div
                            className="
                                w-1.5
                                h-9

                                rounded-full

                                bg-[#FF7A45]

                                shadow-[0_0_12px_rgba(255,122,69,0.3)]

                                transition-all
                                duration-300
                            "
                        />

                        <div>
                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    tracking-tight
                                    text-[#EEEEEE]
                                "
                            >
                                TeamFlow
                            </h2>

                            <span
                                className="
                                    text-xs
                                    text-[#777777]
                                "
                            >
                                Project Management
                            </span>
                        </div>

                    </div>
                </div>


                {/* =================================================
                    NAVIGATION
                ================================================== */}
                <nav
                    className="
                        flex-1
                        px-4
                        py-6
                        space-y-2

                        overflow-y-auto
                    "
                >

                    {/* Dashboard */}
                    <NavLink
                        to="/dashboard"
                        className={linkClass}
                        onClick={handleLinkClick}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <span
                                        className="
                                            absolute
                                            left-0
                                            top-1/2
                                            -translate-y-1/2

                                            w-[3px]
                                            h-6

                                            rounded-r-full

                                            bg-[#FF7A45]

                                            shadow-[0_0_10px_rgba(255,122,69,0.5)]

                                            animate-pulse
                                        "
                                    />
                                )}

                                Dashboard
                            </>
                        )}
                    </NavLink>


                    {/* Projects */}
                    <NavLink
                        to="/projects"
                        className={linkClass}
                        onClick={handleLinkClick}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <span
                                        className="
                                            absolute
                                            left-0
                                            top-1/2
                                            -translate-y-1/2

                                            w-[3px]
                                            h-6

                                            rounded-r-full

                                            bg-[#FF7A45]

                                            shadow-[0_0_10px_rgba(255,122,69,0.5)]

                                            animate-pulse
                                        "
                                    />
                                )}

                                Projects
                            </>
                        )}
                    </NavLink>


                    {/* Tasks */}
                    <NavLink
                        to="/tasks"
                        className={linkClass}
                        onClick={handleLinkClick}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <span
                                        className="
                                            absolute
                                            left-0
                                            top-1/2
                                            -translate-y-1/2

                                            w-[3px]
                                            h-6

                                            rounded-r-full

                                            bg-[#FF7A45]

                                            shadow-[0_0_10px_rgba(255,122,69,0.5)]

                                            animate-pulse
                                        "
                                    />
                                )}

                                Tasks
                            </>
                        )}
                    </NavLink>


                    {/* =================================================
                        ADMIN LINKS
                    ================================================== */}
                    {user?.role === "ADMIN" && (
                        <>

                            {/* Users */}
                            <NavLink
                                to="/users"
                                className={linkClass}
                                onClick={handleLinkClick}
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <span
                                                className="
                                                    absolute
                                                    left-0
                                                    top-1/2
                                                    -translate-y-1/2

                                                    w-[3px]
                                                    h-6

                                                    rounded-r-full

                                                    bg-[#FF7A45]

                                                    shadow-[0_0_10px_rgba(255,122,69,0.5)]

                                                    animate-pulse
                                                "
                                            />
                                        )}

                                        Users
                                    </>
                                )}
                            </NavLink>


                            {/* Audit Logs */}
                            <NavLink
                                to="/audit-logs"
                                className={linkClass}
                                onClick={handleLinkClick}
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <span
                                                className="
                                                    absolute
                                                    left-0
                                                    top-1/2
                                                    -translate-y-1/2

                                                    w-[3px]
                                                    h-6

                                                    rounded-r-full

                                                    bg-[#FF7A45]

                                                    shadow-[0_0_10px_rgba(255,122,69,0.5)]

                                                    animate-pulse
                                                "
                                            />
                                        )}

                                        Audit Logs
                                    </>
                                )}
                            </NavLink>

                        </>
                    )}

                </nav>


                {/* =================================================
                    USER ROLE CARD
                ================================================== */}
                <div
                    className="
                        mx-4
                        mb-5
                        p-4

                        rounded-xl

                        bg-[#111111]
                        border border-[#292929]

                        transition-all
                        duration-200

                        hover:border-[#3A3A3A]
                    "
                >

                    <p
                        className="
                            text-[10px]
                            uppercase
                            tracking-[0.15em]
                            text-[#666666]

                            mb-2
                        "
                    >
                        Signed in as
                    </p>

                    <div className="flex items-center gap-2">

                        <span
                            className="
                                w-2
                                h-2

                                rounded-full

                                bg-[#FF7A45]

                                shadow-[0_0_8px_rgba(255,122,69,0.7)]
                            "
                        />

                        <strong
                            className="
                                text-sm
                                font-semibold
                                text-[#EEEEEE]
                            "
                        >
                            {user?.role}
                        </strong>

                    </div>

                </div>

            </aside>
        </>
    );
};

export default Sidebar;