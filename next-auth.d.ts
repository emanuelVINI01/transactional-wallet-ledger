import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      taxId: string;
      balance: number;
      createdAt?: string;
    } & DefaultSession["user"];
  }

  interface User {
    taxId: string;
    balance: number;
    createdAt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    taxId: string;
    balance: number;
    createdAt?: string;
  }
}
