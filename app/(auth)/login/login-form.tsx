"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { loginAction } from "./actions";

export function LoginForm() {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setErrorMsg("");

    startTransition(async () => {
      const result = await loginAction(data);
      if (result?.error) {
        setErrorMsg(result.error);
      }
    });
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
          <LockKeyhole className="size-6" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {errorMsg && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="admin@softwarehouse.com"
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors disabled:opacity-50"
            disabled={isPending}
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
          </div>
          <input
            {...register("password")}
            id="password"
            type="password"
            placeholder="••••••••"
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors disabled:opacity-50"
            disabled={isPending}
          />
          {errors.password && (
            <p className="text-xs text-destructive mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full mt-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending ? "Memproses..." : "Sign In"}
        </button>
      </form>
    </>
  );
}
