import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="w-screen h-screen p-2 flex items-center justify-center bg-accent overflow-hidden">
      <div className="w-full max-w-sm bg-background rounded-2xl border border-border p-8 shadow-xs flex flex-col gap-6">
        <LoginForm />
      </div>
    </main>
  );
}
