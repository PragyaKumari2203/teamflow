import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const reflectionRef = useRef(null);
    const animationFrameRef = useRef(null);
    const targetXRef = useRef(50);

    const handlePointerMove = (e) => {
        const navbar = e.currentTarget;
        const rect = navbar.getBoundingClientRect();

        const x = ((e.clientX - rect.left) / rect.width) * 100;

        targetXRef.current = x;

        // Prevent creating multiple animation frames
        if (animationFrameRef.current) return;

        animationFrameRef.current = requestAnimationFrame(() => {
            if (reflectionRef.current) {
                reflectionRef.current.style.left = `${targetXRef.current}%`;
                reflectionRef.current.style.opacity = "1";
            }

            animationFrameRef.current = null;
        });
    };

    const handlePointerLeave = () => {
        if (reflectionRef.current) {
            reflectionRef.current.style.opacity = "0";
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <header
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="
                relative
                h-[70px]
                overflow-hidden
                bg-[#1a1919]
                border-b border-[#292929]
                text-white
                flex items-center justify-between
                px-5 sm:px-7
                select-none
            "
        >

            {/* =====================================================
                TOP SHINY REFLECTION
            ====================================================== */}
            <div
                ref={reflectionRef}
                className="
                    pointer-events-none
                    absolute
                    top-0
                    left-[50%]
                    -translate-x-1/2
                    w-[220px]
                    h-[1px]
                    opacity-0
                    z-20
                "
                style={{
                    background: `
                        linear-gradient(
                            90deg,
                            transparent 0%,
                            rgba(255,255,255,0.05) 20%,
                            rgba(255,255,255,0.15) 30%,
                            rgba(255,255,255,0.95) 50%,
                            rgba(255,255,255,0.15) 70%,
                            rgba(255,255,255,0.05) 80%,
                            transparent 100%
                        )
                    `,
                    boxShadow: `
                        0 0 4px rgba(255,255,255,0.8),
                        0 0 10px rgba(255,255,255,0.25)
                    `,
                }}
            />

            {/* =====================================================
                BOTTOM SHINY REFLECTION
            ====================================================== */}
            <div
                className="
                    pointer-events-none
                    absolute
                    bottom-0
                    left-1/2
                    -translate-x-1/2
                    w-[220px]
                    h-[1px]
                    opacity-0
                    z-20
                "
                style={{
                    background: `
                        linear-gradient(
                            90deg,
                            transparent 0%,
                            rgba(255,255,255,0.04) 20%,
                            rgba(255,255,255,0.10) 30%,
                            rgba(255,255,255,0.80) 50%,
                            rgba(255,255,255,0.10) 70%,
                            rgba(255,255,255,0.04) 80%,
                            transparent 100%
                        )
                    `,
                    boxShadow: `
                        0 0 4px rgba(255,255,255,0.7),
                        0 0 9px rgba(255,255,255,0.2)
                    `,
                }}
                ref={(element) => {
                    if (element) {
                        element.dataset.reflection = "bottom";
                    }
                }}
            />

            {/* =====================================================
                CONTENT
            ====================================================== */}
            <div className="relative z-10 w-full flex items-center justify-between">

                {/* Mobile Menu */}
                <button
                    onClick={onMenuClick}
                    aria-label="Open menu"
                    className="
                        md:hidden
                        w-11 h-11
                        rounded-xl
                        flex items-center justify-center
                        bg-[#171717]
                        border border-[#292929]
                        text-gray-300
                        hover:bg-[#222222]
                        hover:text-white
                        hover:border-[#3A3A3A]
                        hover:scale-105
                        active:scale-95
                        transition-all duration-200
                    "
                >
                    <span className="text-xl">☰</span>
                </button>

                {/* Left Side */}
                <div className="hidden md:flex items-center gap-3">

                    <div
                        className="
                            w-1.5 h-9
                            rounded-full
                            bg-[#FF7A45]
                            shadow-[0_0_12px_rgba(255,122,69,0.35)]
                        "
                    />

                    <div>
                        <p className="text-sm font-semibold text-[#EEEEEE]">
                            TeamFlow
                        </p>

                        <p className="text-xs text-[#777777] mt-0.5">
                            Project Management
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="ml-auto flex items-center gap-5">

                    {/* User */}
                    <div className="flex items-center gap-3">

                        {/* Avatar */}
                        <div
                            className="
                                w-10 h-10
                                rounded-full
                                bg-[#FF7A45]
                                flex items-center justify-center
                                text-white font-semibold
                                shadow-[0_0_15px_rgba(255,122,69,0.18)]
                                hover:scale-105
                                transition-transform duration-200
                            "
                        >
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>

                        {/* User Info */}
                        <div className="hidden sm:block">

                            <p className="text-sm font-semibold text-[#EEEEEE]">
                                {user?.name}
                            </p>

                            <div className="flex items-center gap-2 mt-1">

                                <span
                                    className="
                                        w-1.5 h-1.5
                                        rounded-full
                                        bg-[#FF7A45]
                                        shadow-[0_0_7px_rgba(255,122,69,0.7)]
                                    "
                                />

                                <span className="text-xs text-[#999999]">
                                    {user?.role}
                                </span>

                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden sm:block h-8 w-px bg-[#292929]" />

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="
                            px-5 py-2.5
                            rounded-full
                            bg-[#FF7A45]
                            text-white
                            font-medium text-sm
                            shadow-[0_4px_15px_rgba(255,122,69,0.18)]

                            hover:bg-[#FF8B5C]
                            hover:-translate-y-0.5
                            hover:shadow-[0_7px_20px_rgba(255,122,69,0.28)]

                            active:translate-y-0
                            active:scale-95

                            transition-all duration-200
                        "
                    >
                        Logout
                    </button>

                </div>
            </div>
        </header>
    );
};

export default Navbar;