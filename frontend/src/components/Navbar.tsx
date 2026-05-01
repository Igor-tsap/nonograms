"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const { user, logout, isCreator } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-black font-bold text-lg tracking-tight">
            nonogram
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/puzzles" className="text-gray-700 hover:text-black text-sm transition-colors">
              Browse
            </Link>
            {isCreator && (
              <>
                <Link href="/my-puzzles" className="text-gray-700 hover:text-black text-sm transition-colors">
                  My Puzzles
                </Link>
                <Link href="/create-puzzle" className="text-gray-700 hover:text-black text-sm transition-colors">
                  Create
                </Link>
              </>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">{user.name}</span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-700 hover:text-black transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-sm bg-white text-black px-4 py-1.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
