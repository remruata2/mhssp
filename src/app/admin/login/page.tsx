"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const validateForm = () => {
		let isValid = true;
		setUsernameError("");
		setPasswordError("");
		setError("");

		// Username validation
		if (!username) {
			setUsernameError("Username is required");
			isValid = false;
		}

		// Password validation
		if (!password) {
			setPasswordError("Password is required");
			isValid = false;
		} else if (password.length < 6) {
			setPasswordError("Password must be at least 6 characters");
			isValid = false;
		}

		return isValid;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			const result = await signIn("credentials", {
				username,
				password,
				redirect: false,
			});

			if (result?.error) {
				setError(result.error);
				setIsLoading(false);
				return;
			}

			console.log("Result:", result);
			if (result?.ok) {
				console.log("Login successful");
				router.push("/admin/dashboard");
				router.refresh();
			}
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "An error occurred";
			setError(message);
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="username" className="sr-only">
								Username
							</label>
							<input
								id="username"
								name="username"
								required
								value={username}
								onChange={(e) => {
									setUsername(e.target.value);
									setUsernameError("");
								}}
								className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
									usernameError ? "border-red-500" : "border-gray-300"
								} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
								placeholder="Username"
							/>
							{usernameError && (
								<p className="mt-1 text-sm text-red-500">{usernameError}</p>
							)}
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									setPasswordError("");
								}}
								className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
									passwordError ? "border-red-500" : "border-gray-300"
								} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
								placeholder="Password"
							/>
							{passwordError && (
								<p className="mt-1 text-sm text-red-500">{passwordError}</p>
							)}
						</div>
					</div>

					{error && (
						<div className="text-red-500 text-sm text-center">{error}</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
					>
						{isLoading ? "Signing in..." : "Sign in"}
					</button>
				</form>
			</div>
		</div>
	);
}
