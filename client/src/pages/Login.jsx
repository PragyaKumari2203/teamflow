import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { user, login } = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
        await login(
            formData.email,
            formData.password
        );

        navigate("/dashboard");
    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Unable to login"
        );

        // Clear email and password
        setFormData({
            email: "",
            password: "",
        });

        // Hide error after 2 seconds
        setTimeout(() => {
            setError("");
        }, 2000);
    } finally {
        setSubmitting(false);
    }
};

    return (
        <div
            className="
                min-h-screen
                bg-[#F4F3F1]
                flex
                items-center
                justify-center
                p-4
                relative
                overflow-hidden
            "
        >

            {/* =====================================================
                BACKGROUND DECORATION
            ====================================================== */}

            {/* Orange glow - top left */}
            <div
                className="
                    absolute
                    -top-40
                    -left-40
                    w-[450px]
                    h-[450px]
                    rounded-full
                    bg-[#FF7A45]/[0.09]
                    blur-3xl
                    pointer-events-none
                "
            />

            {/* Orange glow - bottom right */}
            <div
                className="
                    absolute
                    -bottom-48
                    -right-40
                    w-[500px]
                    h-[500px]
                    rounded-full
                    bg-[#FF7A45]/[0.07]
                    blur-3xl
                    pointer-events-none
                "
            />

            {/* Subtle grid */}
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    opacity-[0.3]
                "
                style={{
                    backgroundImage: `
                        linear-gradient(
                            rgba(0,0,0,0.035) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(0,0,0,0.035) 1px,
                            transparent 1px
                        )
                    `,
                    backgroundSize: "32px 32px",
                }}
            />


            {/* =====================================================
                LOGIN CONTAINER
            ====================================================== */}
            <div
                className="
                    relative
                    z-10

                    w-full
                    max-w-[900px]

                    min-h-[560px]

                    bg-white

                    rounded-[28px]

                    border border-[#E3E0DC]

                    shadow-[0_25px_70px_rgba(0,0,0,0.10)]

                    overflow-hidden

                    grid
                    md:grid-cols-2
                "
            >

                {/* =================================================
                    LEFT BRAND SECTION
                ================================================== */}
                <div
                    className="
                        hidden
                        md:flex
                        relative

                        bg-[#0A0A0A]

                        p-10

                        flex-col
                        justify-between

                        overflow-hidden
                    "
                >

                    {/* Decorative orange glow */}
                    <div
                        className="
                            absolute
                            -top-32
                            -right-32

                            w-[350px]
                            h-[350px]

                            rounded-full

                            bg-[#FF7A45]/[0.14]

                            blur-3xl

                            pointer-events-none
                        "
                    />

                    {/* Small orange circle */}
                    <div
                        className="
                            absolute
                            bottom-[-80px]
                            left-[-80px]

                            w-[220px]
                            h-[220px]

                            rounded-full

                            border
                            border-[#FF7A45]/10

                            pointer-events-none
                        "
                    />


                    {/* Brand */}
                    <div className="relative z-10">

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    w-1.5
                                    h-10
                                    rounded-full

                                    bg-[#FF7A45]

                                    shadow-[0_0_16px_rgba(255,122,69,0.45)]
                                "
                            />

                            <div>
                                <h1
                                    className="
                                        text-xl
                                        font-semibold
                                        text-[#EEEEEE]
                                        tracking-tight
                                    "
                                >
                                    TeamFlow
                                </h1>

                                <p
                                    className="
                                        text-xs
                                        text-[#777777]
                                        mt-0.5
                                    "
                                >
                                    Project Management
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Main message */}
                    <div className="relative z-10">

                        <p
                            className="
                                text-xs
                                uppercase
                                tracking-[0.2em]
                                text-[#FF7A45]
                                font-semibold
                                mb-4
                            "
                        >
                            Welcome back
                        </p>

                        <h2
                            className="
                                text-4xl
                                font-semibold
                                leading-tight
                                text-white
                                max-w-[320px]
                            "
                        >
                            Manage your
                            <span className="text-[#FF7A45]">
                                {" "}team
                            </span>
                            {" "}with confidence.
                        </h2>

                        <p
                            className="
                                mt-5
                                text-sm
                                leading-6
                                text-[#777777]
                                max-w-[330px]
                            "
                        >
                            Keep projects organized, track tasks,
                            collaborate with your team, and stay
                            on top of every important activity.
                        </p>

                    </div>


                    {/* Bottom */}
                    <div
                        className="
                            relative
                            z-10

                            flex
                            items-center
                            gap-2

                            text-xs
                            text-[#666666]
                        "
                    >
                        <span
                            className="
                                w-1.5
                                h-1.5
                                rounded-full
                                bg-[#FF7A45]
                                shadow-[0_0_7px_rgba(255,122,69,0.6)]
                            "
                        />

                        Secure workspace
                    </div>

                </div>


                {/* =================================================
                    RIGHT LOGIN SECTION
                ================================================== */}
                <div
                    className="
                        relative

                        flex
                        items-center
                        justify-center

                        px-7
                        sm:px-12
                        py-10

                        bg-[#FCFCFB]
                    "
                >

                    {/* Small top reflection */}
                    <div
                        className="
                            absolute
                            top-0
                            left-1/2
                            -translate-x-1/2

                            w-[180px]
                            h-[1px]

                            bg-gradient-to-r
                            from-transparent
                            via-[#FF7A45]/40
                            to-transparent

                            pointer-events-none
                        "
                    />


                    <div className="w-full max-w-[350px]">

                        {/* Mobile brand */}
                        <div
                            className="
                                md:hidden
                                flex
                                items-center
                                gap-3
                                mb-10
                            "
                        >

                            <div
                                className="
                                    w-1.5
                                    h-9
                                    rounded-full
                                    bg-[#FF7A45]
                                "
                            />

                            <div>
                                <h1
                                    className="
                                        text-lg
                                        font-semibold
                                        text-[#171717]
                                    "
                                >
                                    TeamFlow
                                </h1>

                                <p
                                    className="
                                        text-xs
                                        text-[#999999]
                                    "
                                >
                                    Project Management
                                </p>
                            </div>

                        </div>


                        {/* Heading */}
                        <div className="mb-8">

                            <h2
                                className="
                                    text-2xl
                                    sm:text-3xl
                                    font-semibold
                                    tracking-tight
                                    text-[#171717]
                                "
                            >
                                Sign in
                            </h2>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-[#888888]
                                "
                            >
                                Sign in to manage your projects
                                and tasks.
                            </p>

                        </div>


                        {/* =================================================
                            FORM
                        ================================================== */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Email */}
                            <div>

                                <label
                                    htmlFor="email"
                                    className="
                                        block
                                        mb-2
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-[#555555]
                                    "
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                    className="
                                        w-full
                                        px-4
                                        py-3

                                        rounded-xl

                                        bg-white

                                        border
                                        border-[#E0DEDA]

                                        text-sm
                                        text-[#171717]

                                        placeholder:text-[#AAAAAA]

                                        outline-none

                                        transition-all
                                        duration-200

                                        focus:border-[#FF7A45]
                                        focus:ring-4
                                        focus:ring-[#FF7A45]/10
                                    "
                                />

                            </div>


                            {/* Password */}
                            <div>

                                <label
                                    htmlFor="password"
                                    className="
                                        block
                                        mb-2
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-[#555555]
                                    "
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    className="
                                        w-full
                                        px-4
                                        py-3

                                        rounded-xl

                                        bg-white

                                        border
                                        border-[#E0DEDA]

                                        text-sm
                                        text-[#171717]

                                        placeholder:text-[#AAAAAA]

                                        outline-none

                                        transition-all
                                        duration-200

                                        focus:border-[#FF7A45]
                                        focus:ring-4
                                        focus:ring-[#FF7A45]/10
                                    "
                                />

                            </div>


                            {/* Error */}
                            {error && (
                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3

                                        p-3.5

                                        rounded-xl

                                        bg-red-50
                                        border border-red-200

                                        text-sm
                                        text-red-600
                                    "
                                >

                                    <span
                                        className="
                                            w-5
                                            h-5
                                            flex-shrink-0
                                            rounded-full
                                            bg-red-100
                                            flex
                                            items-center
                                            justify-center
                                            text-xs
                                            font-bold
                                        "
                                    >
                                        !
                                    </span>

                                    <p>
                                        {error}
                                    </p>

                                </div>
                            )}


                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="
                                    relative
                                    w-full

                                    mt-2

                                    px-5
                                    py-3.5

                                    rounded-xl

                                    bg-[#FF7A45]

                                    text-white
                                    text-sm
                                    font-semibold

                                    shadow-[0_8px_22px_rgba(255,122,69,0.20)]

                                    overflow-hidden

                                    hover:bg-[#FF8B5C]
                                    hover:-translate-y-0.5
                                    hover:shadow-[0_12px_28px_rgba(255,122,69,0.28)]

                                    active:translate-y-0
                                    active:scale-[0.99]

                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                    disabled:hover:translate-y-0

                                    transition-all
                                    duration-200
                                "
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">

                                        <span
                                            className="
                                                w-4
                                                h-4
                                                rounded-full
                                                border-2
                                                border-white/30
                                                border-t-white
                                                animate-spin
                                            "
                                        />

                                        Signing in...

                                    </span>
                                ) : (
                                    "Sign in"
                                )}
                            </button>

                        </form>


                        {/* Footer */}
                        <div
                            className="
                                mt-8
                                pt-5
                                border-t
                                border-[#EAE8E4]

                                flex
                                items-center
                                justify-center
                                gap-2
                            "
                        >

                            <span
                                className="
                                    w-1.5
                                    h-1.5
                                    rounded-full
                                    bg-[#FF7A45]
                                "
                            />

                            <p
                                className="
                                    text-xs
                                    text-[#999999]
                                "
                            >
                                Secure team workspace
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;