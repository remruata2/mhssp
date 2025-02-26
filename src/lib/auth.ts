// src/lib/auth.ts
import NextAuth from "next-auth";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/lib/db";
import { IUser } from "@/types/user";

// Extend next-auth types
declare module "next-auth" {
	interface Session {
		user: {
			role?: string;
			username?: string;
		} & DefaultSession["user"];
	}
	interface User {
		role?: string;
		username?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role?: string;
		username?: string;
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				console.log("Login attempt with credentials:", credentials);
				if (!credentials?.username || !credentials?.password) {
					throw new Error("Missing username or password");
				}

				try {
					await connectDB();

					const user = await User.findOne<IUser>({
						username: credentials.username,
					});

					if (!user) {
						console.log("User not found:", credentials.username);
						throw new Error("Invalid username or password");
					}

					const isValid = await bcrypt.compare(
						credentials.password,
						user.password
					);

					if (!isValid) {
						console.log(
							"Invalid username or password for user:",
							user.username
						);
						throw new Error("Invalid username or password");
					}

					return {
						id: user._id.toHexString(),
						name: user.username,
						role: user.role,
					};
				} catch (error) {
					console.error("Auth error:", error);
					throw error;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
				token.username = user.username;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.role = token.role;
				session.user.username = token.username;
			}
			return session;
		},
	},
	pages: {
		signIn: "/admin/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export const { auth, signIn, signOut } = NextAuth(authOptions);
