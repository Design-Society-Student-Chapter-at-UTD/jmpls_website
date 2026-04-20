/**
 * MOCK AUTH SERVICE
 * Using LocalStorage to simulate a local file database.
 * Passwords are hashed using PBKDF2 (SHA-256).
 */

const DB_KEY = "jmpls_member_db";

export async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function registerUser(userData: any) {
  const db = JSON.parse(localStorage.getItem(DB_KEY) || "[]");
  
  if (db.find((u: any) => u.email === userData.email)) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(userData.password);
  
  const newUser = {
    ...userData,
    password: hashedPassword,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };

  db.push(newUser);
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  
  // Auto-login after signup
  sessionStorage.setItem("jmpls_session", JSON.stringify({ email: newUser.email, firstname: newUser.firstname }));
  
  return { success: true, user: { email: newUser.email, firstname: newUser.firstname } };
}

export async function loginUser(email: string, password: string) {
  const db = JSON.parse(localStorage.getItem(DB_KEY) || "[]");
  const user = db.find((u: any) => u.email === email);
  
  if (!user) throw new Error("Invalid credentials");
  
  const hashedPassword = await hashPassword(password);
  if (user.password !== hashedPassword) {
    throw new Error("Invalid credentials");
  }

  const sessionUser = { email: user.email, firstname: user.firstname };
  sessionStorage.setItem("jmpls_session", JSON.stringify(sessionUser));
  
  return { success: true, user: sessionUser };
}

export function getCurrentUser() {
  const session = sessionStorage.getItem("jmpls_session");
  return session ? JSON.parse(session) : null;
}

export function logout() {
  sessionStorage.removeItem("jmpls_session");
  window.location.href = "/";
}
