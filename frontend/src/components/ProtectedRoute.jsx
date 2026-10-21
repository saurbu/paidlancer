
import { Navigate } from "react-router-dom";
import { useGetMeQuery } from "../services/api";

export default function ProtectedRoute({ children, role }) {
    const { data, isLoading, isError } = useGetMeQuery();

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center text-slate-400">
                Checking your session...
            </div>
        );
    }

    const user =
        data?.user ||
        data?.data?.user ||
        data?.currentUser ||
        null;

    if (isError || !user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}
