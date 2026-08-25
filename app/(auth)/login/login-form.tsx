"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-sm"
    >
      {errorMsg && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded border border-red-200">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="admin@softwarehouse.com"
          className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none transition disabled:opacity-50"
          disabled={isPending}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none transition disabled:opacity-50"
          disabled={isPending}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white font-medium p-2 rounded hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
      >
        {isPending ? "Memproses..." : "Login"}
      </button>
    </form>
  );
}
