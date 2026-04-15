import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config";

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(ROUTES.LOGIN);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 shadow-lg text-center max-w-md w-full">
        
        {/* ICON */}
        <div className="text-5xl mb-6">✔</div>

        {/* TITLE */}
        <h1 className="text-2xl font-semibold mb-2">
          Email Verified
        </h1>

        {/* DESC */}
        <p className="text-neutral-400 mb-6">
          Your account has been successfully verified. You can now log in.
        </p>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-neutral-200 transition"
        >
          Go to Login
        </button>

        {/* AUTO REDIRECT TEXT */}
        <p className="text-xs text-neutral-500 mt-4">
          Redirecting to login in 3 seconds...
        </p>
      </div>
    </div>
  );
}