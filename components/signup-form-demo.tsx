"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { registerUser, loginUser } from "@/lib/auth-service";
import { authClient } from "@/src/lib/auth-client";

export default function AuthForm({ initialMode = "signup" }: { initialMode?: "login" | "signup" }) {
  const [mode, setMode] = React.useState<"login" | "signup">(initialMode);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      if (mode === "signup") {
        await registerUser(data);
        toast.success("Account created successfully!", {
          description: "Redirecting to sign in...",
        });
        setTimeout(() => setMode("login"), 2000);
      } else {
        const result = await loginUser(data.email as string, data.password as string);
        toast.success(`Welcome back, ${result.user.firstname}!`);
        window.location.href = "/";
      }
    } catch (err: any) {
      toast.error("Authentication failed", {
        description: err.message || "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shadow-sm mx-auto w-full max-w-md bg-white p-6 md:p-10 dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-sm">
      <h2 className="text-2xl font-sans font-bold text-neutral-800 dark:text-neutral-200">
        {mode === "signup" ? "Join JMPLS" : "Sign In"}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        {mode === "signup" 
          ? "Create your member account to access exclusive resources." 
          : "Access your member portal to track events and dues."}
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input name="firstname" id="firstname" placeholder="John" type="text" required />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input name="lastname" id="lastname" placeholder="Marshall" type="text" required />
            </LabelInputContainer>
          </div>
        )}
        
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input name="email" id="email" placeholder="abc123456@utdallas.edu" type="email" required />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input name="password" id="password" placeholder="••••••••" type="password" required />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full bg-maroon font-bold text-white shadow-md transition-all hover:bg-maroon-dark active:scale-[0.98] uppercase tracking-widest text-[0.65rem] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : (mode === "signup" ? "Create Account" : "Sign In")}
        </button>

        <div className="mt-8 text-center pt-4 border-t border-neutral-50">
          <button 
            type="button"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            className="text-sm text-gray-500 hover:text-maroon transition-colors"
          >
            {mode === "signup" 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Sign up for free"}
          </button>
        </div>
      </form>
    </div>
  );
}


const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
