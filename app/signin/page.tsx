import LoginButton from "@/components/auth/AuthButton";

export default function SignInPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-semibold">Welcome back 👋</h2>
      <LoginButton />
    </div>
  );
}
