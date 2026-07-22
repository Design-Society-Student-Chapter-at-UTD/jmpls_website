/**
 * AUTH SERVICE
 * Uses Better Auth client to communicate with the server.
 */

import { authClient } from "./auth-client";

const { signUp: baSignUp, signIn: baSignIn, signOut: baSignOut } = authClient;

export async function registerUser(userData: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}) {
  const { data, error } = await baSignUp.email({
    name: `${userData.firstname} ${userData.lastname}`,
    email: userData.email,
    password: userData.password,
  });

  if (error) throw new Error(error.message || "Registration failed");

  return {
    success: true,
    user: { email: data?.user.email, firstname: userData.firstname },
  };
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await baSignIn.email({
    email,
    password,
  });

  if (error) throw new Error(error.message || "Login failed");

  return {
    success: true,
    user: {
      email: data?.user.email,
      firstname: data?.user.name?.split(" ")[0] || "Member",
    },
  };
}

export function getCurrentUser() {
  // Session is managed by Better Auth's cookies - use useSession() hook instead
  return null;
}

export async function logout() {
  await baSignOut();
  window.location.href = "/";
}
