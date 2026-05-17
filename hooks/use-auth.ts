"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ApiError, parseJsonResponse, type ApiUser } from "@/lib/api-types";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetch("/api/users/me", { credentials: "same-origin" });
      const data = await parseJsonResponse<{ user: ApiUser }>(response, "Could not load authenticated user.");
      return data.user;
    },
    enabled: isAuthenticated,
  });

  const loginMutation = useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const result = await signIn("credentials", {
        email: input.email,
        password: input.password,
        redirect: false,
      });

      if (!result || result.error) {
        throw new ApiError("Invalid email or password.", 401);
      }

      const response = await fetch("/api/users/me", { credentials: "same-origin" });
      const data = await parseJsonResponse<{ user: ApiUser }>(response, "Could not load authenticated user.");
      return data.user;
    },
    onSuccess: (user: ApiUser) => {
      queryClient.setQueryData(["me"], user);
    },
  });

  const logout = async () => {
    await signOut({ redirect: false });
    queryClient.clear();
    router.replace("/login");
  };

  return {
    isAuthenticated,
    isRestoringToken: session.status === "loading",
    isLoadingUser: session.status === "loading" || meQuery.isLoading,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    loginPending: loginMutation.isPending,
    logout,
    token: isAuthenticated ? "authjs-jwt-session" : null,
    user: (meQuery.data ?? session.data?.user) as ApiUser | undefined,
  };
}

export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isRestoringToken) {
      router.replace("/login");
    }
  }, [auth.isAuthenticated, auth.isRestoringToken, router]);

  return auth;
}
