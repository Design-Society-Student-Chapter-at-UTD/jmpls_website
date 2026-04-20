import React from "react";
import logoUrl from "../../assets/logo.jpeg";
import AuthForm from "@/components/signup-form-demo";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden shadow-lg border-2 border-white">
            <img src={logoUrl} alt="JMPLS Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">John Marshall Portal</h1>
          <p className="text-gray-500 mt-2">Manage your JMPLS membership and events</p>
        </div>

        <AuthForm initialMode="login" />
        
      </div>
    </div>
  );
}
