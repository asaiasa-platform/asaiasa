import { useEffect } from "react";
import { useNavigate } from "react-router";

export const HomeScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to the new home page
        navigate('/home');
    }, [navigate]);

    return (
        <div className="flex h-dvh flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
        </div>
    );
};
