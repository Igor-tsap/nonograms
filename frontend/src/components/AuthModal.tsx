"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { loginUser, registerUser } from "@/lib/api";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const data = await loginUser(username, password);
        login(data);
        onClose();
      } else {
        await registerUser(username, password, isCreator ? 1 : 0);
        const data = await loginUser(username, password);
        login(data);
        onClose();
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-black mb-6 tracking-tight">
          {mode === "login" ? "Sign in" : "Create account"}
        </h2>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "login" ? "bg-black text-white" : "text-gray-600 hover:text-black"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "register" ? "bg-black text-white" : "text-gray-600 hover:text-black"
            }`}
          >
            Register
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-gray-50 text-black rounded-lg px-4 py-3 outline-none border border-gray-300 focus:border-black transition-colors placeholder:text-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handle()}
            className="w-full bg-gray-50 text-black rounded-lg px-4 py-3 outline-none border border-gray-300 focus:border-black transition-colors placeholder:text-gray-500"
          />
          {mode === "register" && (
            <label className="flex items-center gap-3 text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isCreator}
                onChange={(e) => setIsCreator(e.target.checked)}
                className="w-4 h-4 accent-black"
              />
              Register as puzzle creator
            </label>
          )}
        </div>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        <button
          onClick={handle}
          disabled={loading}
          className="w-full mt-6 bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? "..." : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </div>
    </div>
  );
}
