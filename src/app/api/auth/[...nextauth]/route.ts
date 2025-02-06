import { type NextAuthOptions } from 'next-auth';

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) {
					return null;
				}

				try {
					await dbConnect();
					const user = await User.findOne({ username: credentials.username });
					if (!user) return null;

					const isValid = await bcrypt.compare(
						credentials.password,
						user.password
					);
					if (!isValid) return null;

					return {
						id: user._id.toString(),
						username: user.username,
						role: user.role,
					};
				} catch (error) {
					console.error("Authentication error:", error);
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/admin/login",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
				token.username = user.username;
			}
			return token;
		},
		async session({ session, token }) {
			if (!session || !session.user) {
				throw new Error("Unauthorized");
			}
			if (token) {
				session.user.role = token.role as string;
				session.user.username = token.username as string;
			}
			return session;
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
