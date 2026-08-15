import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";

const UserForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "MEMBER"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.post("/users", formData);

            navigate("/users");
        } catch (error) {
            const validationErrors =
                error.response?.data?.errors;

            if (validationErrors?.length) {
                setError(
                    validationErrors
                        .map((item) => item.msg)
                        .join(", ")
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    "Unable to create user"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>

            {/* =================================================
                CENTERED FORM AREA
            ================================================== */}

            <div
                className="
                    min-h-[calc(100vh-70px)]
                    flex
                    items-center
                    justify-center

                    px-4
                    py-8
                    sm:px-6
                    sm:py-10

                    bg-[#F4F3F1]
                "
            >

                {/* =================================================
                    FORM CARD
                ================================================== */}

                <div
                    className="
                        w-full
                        max-w-2xl

                        rounded-2xl

                        border
                        border-[#E2DEDA]

                        bg-white

                        shadow-[0_12px_40px_rgba(0,0,0,0.06)]

                        overflow-hidden
                    "
                >

                    {/* =================================================
                        CARD HEADER
                    ================================================== */}

                    <div
                        className="
                            flex
                            items-center
                            gap-4

                            border-b
                            border-[#ECE9E5]

                            px-6
                            py-5

                            sm:px-8
                        "
                    >

                        {/* Icon */}

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center

                                rounded-xl

                                bg-[#FFF3ED]

                                border
                                border-[#FFD8C5]

                                text-[#E86632]
                            "
                        >

                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M15 19a4 4 0 0 0-8 0"
                                />

                                <circle
                                    cx="11"
                                    cy="8"
                                    r="3.5"
                                    strokeWidth="1.8"
                                />

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M19 8v6m3-3h-6"
                                />
                            </svg>

                        </div>


                        <div>

                            <h1
                                className="
                                    text-lg
                                    font-semibold
                                    text-[#222222]
                                "
                            >
                                Create User
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-[#999999]
                                "
                            >
                                Add a new member to your TeamFlow workspace.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        FORM
                    ================================================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="
                            px-6
                            py-6

                            sm:px-8
                            sm:py-8
                        "
                    >

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5

                                sm:grid-cols-2
                            "
                        >

                            {/* =================================================
                                FULL NAME
                            ================================================== */}

                            <div className="sm:col-span-2">

                                <label
                                    htmlFor="name"
                                    className="
                                        mb-2
                                        block

                                        text-sm
                                        font-semibold
                                        text-[#44403C]
                                    "
                                >
                                    Full Name
                                </label>


                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required

                                    className="
                                        w-full

                                        rounded-xl

                                        border
                                        border-[#DDD9D5]

                                        bg-[#FCFBFA]

                                        px-4
                                        py-3

                                        text-sm
                                        text-[#333333]

                                        outline-none

                                        transition-all
                                        duration-200

                                        placeholder:text-[#AAA5A0]

                                        hover:border-[#CFC9C4]

                                        focus:border-[#FFAD86]
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-[#FF7A45]/[0.08]
                                    "
                                />

                            </div>


                            {/* =================================================
                                EMAIL
                            ================================================== */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="
                                        mb-2
                                        block

                                        text-sm
                                        font-semibold
                                        text-[#44403C]
                                    "
                                >
                                    Email Address
                                </label>


                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                    required

                                    className="
                                        w-full

                                        rounded-xl

                                        border
                                        border-[#DDD9D5]

                                        bg-[#FCFBFA]

                                        px-4
                                        py-3

                                        text-sm
                                        text-[#333333]

                                        outline-none

                                        transition-all
                                        duration-200

                                        placeholder:text-[#AAA5A0]

                                        hover:border-[#CFC9C4]

                                        focus:border-[#FFAD86]
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-[#FF7A45]/[0.08]
                                    "
                                />

                            </div>


                            {/* =================================================
                                PASSWORD
                            ================================================== */}

                            <div>

                                <label
                                    htmlFor="password"
                                    className="
                                        mb-2
                                        block

                                        text-sm
                                        font-semibold
                                        text-[#44403C]
                                    "
                                >
                                    Temporary Password
                                </label>


                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 8 characters"
                                    minLength="8"
                                    required

                                    className="
                                        w-full

                                        rounded-xl

                                        border
                                        border-[#DDD9D5]

                                        bg-[#FCFBFA]

                                        px-4
                                        py-3

                                        text-sm
                                        text-[#333333]

                                        outline-none

                                        transition-all
                                        duration-200

                                        placeholder:text-[#AAA5A0]

                                        hover:border-[#CFC9C4]

                                        focus:border-[#FFAD86]
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-[#FF7A45]/[0.08]
                                    "
                                />

                                <p
                                    className="
                                        mt-1.5
                                        text-xs
                                        text-[#999999]
                                    "
                                >
                                    Minimum 8 characters.
                                </p>

                            </div>


                            {/* =================================================
                                ROLE
                            ================================================== */}

                            <div className="sm:col-span-2">

                                <label
                                    htmlFor="role"
                                    className="
                                        mb-2
                                        block

                                        text-sm
                                        font-semibold
                                        text-[#44403C]
                                    "
                                >
                                    Role
                                </label>


                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}

                                    className="
                                        w-full

                                        rounded-xl

                                        border
                                        border-[#DDD9D5]

                                        bg-[#FCFBFA]

                                        px-4
                                        py-3

                                        text-sm
                                        font-medium
                                        text-[#44403C]

                                        outline-none

                                        transition-all
                                        duration-200

                                        hover:border-[#CFC9C4]

                                        focus:border-[#FFAD86]
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-[#FF7A45]/[0.08]
                                    "
                                >

                                    <option value="MEMBER">
                                        Member
                                    </option>

                                    <option value="MANAGER">
                                        Manager
                                    </option>

                                    <option value="ADMIN">
                                        Admin
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================== */}

                        {error && (
                            <div
                                className="
                                    mt-5

                                    rounded-xl

                                    border
                                    border-red-200

                                    bg-red-50

                                    px-4
                                    py-3

                                    text-sm
                                    leading-5
                                    text-red-700
                                "
                            >
                                {error}
                            </div>
                        )}


                        {/* =================================================
                            ACTIONS
                        ================================================== */}

                        <div
                            className="
                                mt-7

                                flex
                                flex-col-reverse
                                gap-3

                                border-t
                                border-[#ECE9E5]

                                pt-6

                                sm:flex-row
                                sm:justify-end
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/users")
                                }
                                className="
                                    rounded-xl

                                    border
                                    border-[#D9D5D1]

                                    bg-white

                                    px-5
                                    py-3

                                    text-sm
                                    font-semibold
                                    text-[#66615D]

                                    transition-all
                                    duration-200

                                    hover:border-[#BEB8B2]
                                    hover:bg-[#F8F7F5]
                                    hover:text-[#333333]

                                    active:scale-95
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    rounded-xl

                                    bg-[#FF7A45]

                                    px-6
                                    py-3

                                    text-sm
                                    font-semibold
                                    text-white

                                    shadow-[0_5px_16px_rgba(255,122,69,0.18)]

                                    transition-all
                                    duration-200

                                    hover:bg-[#FF8B5C]
                                    hover:-translate-y-0.5
                                    hover:shadow-[0_8px_20px_rgba(255,122,69,0.25)]

                                    active:scale-95

                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    disabled:hover:translate-y-0
                                "
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create User"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </AppLayout>
    );
};

export default UserForm;