"use client";

import { LoginForm } from "../../../components/login-form";

export default function LoginPage() {
  // Always show the login form
  // Users can access this page even if already logged in
  // They can log out first if they want to switch accounts
  return <LoginForm />;
}
