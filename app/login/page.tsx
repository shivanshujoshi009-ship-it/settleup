"use client";

import { loginWithGoogle } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { setDbUser } = useAuth();

  async function handleLogin() {
    try {
      const result = await loginWithGoogle();

      setDbUser(result.dbUser);

      router.push("/dashboard");
    } catch (error: any) {
      if (error.code === "auth/cancelled-popup-request") {
        return;
      }

      console.error(error);
      alert(error.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030712]">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
        <h1 className="mb-4 text-center text-4xl font-bold text-white">
          Welcome Back
        </h1>

        <p className="mb-8 text-center text-slate-400">
          Sign in to continue to SettleUp
        </p>

        <button
          onClick={handleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-4 font-semibold text-black transition hover:scale-[1.02]"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-6 w-6"
          />

          Continue with Google
        </button>
      </div>
    </main>
  );
}