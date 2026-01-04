import { DefaultSession, DefaultUser } from "next-auth";
import { UserRole } from "@blog/db";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "ADMIN" | "USER";
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        role: "ADMIN" | "USER";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: "ADMIN" | "USER";
    }
}
