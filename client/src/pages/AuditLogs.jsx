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
        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getActionStyle = (action) => {
        switch (action?.toLowerCase()) {
            case "create":
            case "created":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";

            case "update":
            case "updated":
                return "bg-blue-50 text-blue-700 border-blue-200";

            case "delete":
            case "deleted":
                return "bg-red-50 text-red-700 border-red-200";

            case "login":
            case "logged_in":
                return "bg-[#FFF3ED] text-[#E86632] border-[#FFD8C5]";

            case "logout":
            case "logged_out":
                return "bg-slate-100 text-slate-600 border-slate-200";

            default:
                return "bg-slate-100 text-slate-600 border-slate-200";
        }
    };

    return (
        <AppLayout>

            {/* =====================================================
                PAGE BACKGROUND
            ====================================================== */}
            <div
                className="
                    relative
                    min-h-full
                    -m-4 sm:-m-6
                    px-4 sm:px-6
                    py-5 sm:py-6
                    overflow-hidden
                    bg-[#F4F3F1]
                "
            >

                {/* =================================================
                    BACKGROUND GLOW
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -top-40
                        -right-32
                        w-[420px]
                        h-[420px]
                        rounded-full
                        bg-[#FF7A45]/[0.07]
                        blur-3xl
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-40
                        -left-32
                        w-[360px]
                        h-[360px]
                        rounded-full
                        bg-[#FF7A45]/[0.05]
                        blur-3xl
                    "
                />

                {/* =================================================
                    SUBTLE GRID
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        opacity-[0.35]
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

                {/* =================================================
                    CONTENT
                ================================================== */}

                <div className="relative z-10">

                    {/* =================================================
                        LOADING
                    ================================================== */}

                    {loading && (
                        <div
                            className="
                                bg-white/90
                                backdrop-blur-sm
                                border border-[#E5E2DE]
                                rounded-2xl
                                p-14
                                flex
                                flex-col
                                items-center
                                justify-center
                                shadow-[0_10px_35px_rgba(0,0,0,0.04)]
                            "
                        >

                            <div className="relative">

                                <div
                                    className="
                                        w-11
                                        h-11
                                        rounded-full
                                        border-2
                                        border-[#E7E3DF]
                                        border-t-[#FF7A45]
                                        animate-spin
                                    "
                                />

                                <div
                                    className="
                                        absolute
                                        inset-2
                                        rounded-full
                                        border
                                        border-[#FF7A45]/10
                                    "
                                />

                            </div>

                            <p
                                className="
                                    mt-5
                                    text-sm
                                    font-medium
                                    text-[#777777]
                                "
                            >
                                Loading activity...
                            </p>

                        </div>
                    )}


                    {/* =================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div
                            className="
                                bg-white/90
                                backdrop-blur-sm
                                border border-red-200
                                rounded-2xl
                                p-5
                                shadow-sm
                                flex
                                items-center
                                justify-between
                                gap-5
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-red-700
                                    "
                                >
                                    Unable to load audit logs
                                </p>

                                <p
                                    className="
                                        text-sm
                                        text-red-500
                                        mt-1
                                    "
                                >
                                    {error}
                                </p>

                            </div>

                            <button
                                onClick={fetchLogs}
                                className="
                                    flex-shrink-0
                                    px-4
                                    py-2
                                    rounded-lg
                                    bg-[#171717]
                                    text-white
                                    text-sm
                                    font-medium

                                    hover:bg-[#FF7A45]
                                    hover:-translate-y-0.5

                                    active:scale-95

                                    transition-all
                                    duration-200
                                "
                            >
                                Retry
                            </button>

                        </div>
                    )}


                    {/* =================================================
                        EMPTY STATE
                    ================================================== */}

                    {!loading && !error && logs.length === 0 && (
                        <div
                            className="
                                bg-white/90
                                backdrop-blur-sm
                                border border-[#E5E2DE]
                                rounded-2xl
                                p-14
                                text-center
                                shadow-[0_10px_35px_rgba(0,0,0,0.04)]
                            "
                        >

                            <div
                                className="
                                    mx-auto
                                    w-16
                                    h-16
                                    rounded-2xl
                                    bg-[#FFF3ED]
                                    border border-[#FFD8C5]
                                    flex
                                    items-center
                                    justify-center
                                    text-[#FF7A45]
                                    text-2xl
                                "
                            >
                                —
                            </div>

                            <h3
                                className="
                                    mt-5
                                    text-lg
                                    font-semibold
                                    text-[#171717]
                                "
                            >
                                No activity recorded
                            </h3>

                            <p
                                className="
                                    mt-2
                                    max-w-md
                                    mx-auto
                                    text-sm
                                    leading-6
                                    text-[#777777]
                                "
                            >
                                Audit activity will appear here when
                                users perform important actions.
                            </p>

                        </div>
                    )}


                    {/* =================================================
                        ACTIVITY TABLE
                    ================================================== */}

                    {!loading && !error && logs.length > 0 && (
                        <div
                            className="
                                bg-white
                                border border-[#E3E0DC]
                                rounded-2xl
                                overflow-hidden
                                shadow-[0_15px_45px_rgba(0,0,0,0.07)]
                            "
                        >

                            {/* =================================================
                                TABLE HEADER
                            ================================================== */}

                            <div
                                className="
                                    px-5
                                    sm:px-6
                                    py-5
                                    border-b border-[#ECE9E5]
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                {/* Left */}
                                <div>

                                    <div className="flex items-center gap-2">

                                        <span
                                            className="
                                                w-2
                                                h-2
                                                rounded-full
                                                bg-[#FF7A45]
                                                shadow-[0_0_8px_rgba(255,122,69,0.5)]
                                            "
                                        />

                                        <h2
                                            className="
                                                text-sm
                                                font-semibold
                                                text-[#171717]
                                            "
                                        >
                                            Activity History
                                        </h2>

                                    </div>

                                    <p
                                        className="
                                            text-xs
                                            text-[#999999]
                                            mt-1.5
                                        "
                                    >
                                        Recent actions performed by users
                                    </p>

                                </div>


                                {/* =================================================
                                    RIGHT SIDE
                                ================================================== */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    {/* Total Activity */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2.5
                                            px-3
                                            py-2
                                            rounded-lg
                                            bg-[#FFF3ED]
                                            border border-[#FFD8C5]
                                        "
                                    >

                                        <span
                                            className="
                                                text-sm
                                                font-bold
                                                text-[#E86632]
                                            "
                                        >
                                            {logs.length}
                                        </span>

                                        <span
                                            className="
                                                hidden
                                                sm:block
                                                text-xs
                                                font-medium
                                                text-[#999999]
                                            "
                                        >
                                            Total activity
                                        </span>

                                    </div>


                                    {/* Refresh */}

                                    <button
                                        onClick={fetchLogs}
                                        className="
                                            px-4
                                            py-2
                                            rounded-lg
                                            bg-[#F8F7F5]
                                            border border-[#E5E2DE]
                                            text-xs
                                            font-medium
                                            text-[#666666]

                                            hover:bg-[#FFF3ED]
                                            hover:border-[#FFD8C5]
                                            hover:text-[#E86632]

                                            active:scale-95

                                            transition-all
                                            duration-200
                                        "
                                    >
                                        Refresh
                                    </button>

                                </div>

                            </div>


                            {/* =================================================
                                ONLY SCROLLABLE AREA
                            ================================================== */}

                            <div
                                className="
                                    h-[500px]
                                    overflow-y-auto
                                    overflow-x-hidden

                                    scrollbar-thin
                                    scrollbar-thumb-[#C8C5C1]
                                    scrollbar-track-transparent
                                "
                            >

                                <table className="w-full">

                                    {/* =================================================
                                        TABLE HEAD
                                    ================================================== */}

                                    <thead className="sticky top-0 z-10">

                                        <tr className="bg-[#111111]">

                                            {[
                                                "Date",
                                                "User",
                                                "Role",
                                                "Action",
                                                "Entity",
                                                "Description",
                                            ].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-left
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.12em]
                                                        text-[#888888]
                                                        whitespace-nowrap
                                                    "
                                                >
                                                    {heading}
                                                </th>
                                            ))}

                                        </tr>

                                    </thead>


                                    {/* =================================================
                                        TABLE BODY
                                    ================================================== */}

                                    <tbody
                                        className="
                                            divide-y
                                            divide-[#EFEEEC]
                                        "
                                    >

                                        {logs.map((log) => (

                                            <tr
                                                key={log._id}
                                                className="
                                                    group
                                                    hover:bg-[#FFFBF8]
                                                    transition-colors
                                                    duration-150
                                                "
                                            >

                                                {/* Date */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-[#666666]
                                                        whitespace-nowrap
                                                    "
                                                >
                                                    {formatDate(log.createdAt)}
                                                </td>


                                                {/* User */}

                                                <td className="px-5 py-4">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                w-9
                                                                h-9
                                                                rounded-full
                                                                bg-[#FFF3ED]
                                                                border border-[#FFD8C5]
                                                                text-[#E86632]
                                                                flex
                                                                items-center
                                                                justify-center
                                                                text-xs
                                                                font-semibold
                                                                flex-shrink-0
                                                            "
                                                        >
                                                            {log.user?.name
                                                                ?.charAt(0)
                                                                ?.toUpperCase() || "?"}
                                                        </div>

                                                        <span
                                                            className="
                                                                text-sm
                                                                font-medium
                                                                text-[#333333]
                                                                whitespace-nowrap
                                                            "
                                                        >
                                                            {log.user?.name || "Unknown"}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* Role */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className="
                                                            inline-flex
                                                            px-2.5
                                                            py-1
                                                            rounded-full
                                                            bg-[#F5F5F5]
                                                            border border-[#E3E3E3]
                                                            text-[10px]
                                                            font-semibold
                                                            uppercase
                                                            tracking-wide
                                                            text-[#666666]
                                                        "
                                                    >
                                                        {log.user?.role || "UNKNOWN"}
                                                    </span>

                                                </td>


                                                {/* Action */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            px-2.5
                                                            py-1
                                                            rounded-full
                                                            border
                                                            text-[10px]
                                                            font-semibold
                                                            uppercase
                                                            tracking-wide
                                                            ${getActionStyle(log.action)}
                                                        `}
                                                    >
                                                        {log.action}
                                                    </span>

                                                </td>


                                                {/* Entity */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        font-medium
                                                        text-[#444444]
                                                        whitespace-nowrap
                                                    "
                                                >
                                                    {log.entity}
                                                </td>


                                                {/* Description */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-[#777777]
                                                        max-w-[350px]
                                                    "
                                                >
                                                    <p className="truncate">
                                                        {log.description}
                                                    </p>
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>
                    )}

                </div>

            </div>

        </AppLayout>
    );
};

export default AuditLogs;