"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { endpoints, type ApiSession, type ApiUser } from "@/lib/api-client";
import { clearToken, getToken, setToken } from "@/lib/auth";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState<string | null>(() => getToken());

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await endpoints.me();
      return response.user;
    },
    enabled: Boolean(token),
  });

  const loginMutation = useMutation({
    mutationFn: endpoints.login,
    onSuccess: ({ session }: { session: ApiSession }) => {
      setToken(session.token);
      setTokenState(session.token);
      queryClient.setQueryData(["me"], session.user);
    },
  });

  const logout = () => {
    clearToken();
    setTokenState(null);
    queryClient.clear();
    router.replace("/login");
  };

  return {
    isAuthenticated: Boolean(token),
    isRestoringToken: false,
    isLoadingUser: meQuery.isLoading,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    loginPending: loginMutation.isPending,
    logout,
    token,
    user: meQuery.data as ApiUser | undefined,
  };
}

export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.token === null && !auth.isRestoringToken) {
      router.replace("/login");
    }
  }, [auth.isRestoringToken, auth.token, router]);

  return auth;
}
