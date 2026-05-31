import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return <>
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-fuchsia-500 to-cyan-500">
            <div className="w-full max-w-md rounded-2xl shadow-lg p-8">
                <Outlet />
            </div>
        </div>

    </>
}
