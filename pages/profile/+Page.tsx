import React, { useState, useEffect } from "react";
import { authClient } from "../../src/lib/auth-client";

export default function Page() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setSession(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    fetch("/api/admin/verify")
      .then((r) => r.json())
      .then((data) => setIsAdmin(data.admin))
      .catch(() => {});
  }, [session]);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin size-8 text-maroon" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            My Profile
          </h1>
          <p className="text-gray-500 mb-8">Please sign in to view your profile.</p>
          <a
            href="/login"
            className="inline-block px-8 py-3 bg-maroon text-white font-bold tracking-wider uppercase text-sm rounded-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 md:px-12 py-16">
        <div className="bg-white rounded-sm border border-gray-200 p-8">
          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8">
            <div className="size-16 rounded-full bg-maroon/10 flex items-center justify-center text-maroon text-2xl font-bold">
              {session.user?.name?.charAt(0) || "?"}
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                {session.user?.name || "User"}
              </h1>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4 mb-8">
            <div className="pb-4 border-b border-gray-100">
              <span className="text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                Member since
              </span>
              <span className="text-sm text-gray-700">
                {session.user?.createdAt
                  ? new Date(session.user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isAdmin && (
              <a
                href="/dashboard"
                className="px-6 py-3 bg-maroon text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-maroon/90 transition-all text-center"
              >
                Admin Dashboard
              </a>
            )}
            <button
              onClick={handleSignOut}
              className="px-6 py-3 border border-gray-300 text-gray-600 font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-gray-50 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
