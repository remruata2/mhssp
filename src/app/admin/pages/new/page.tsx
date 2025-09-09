"use client";

import { useRouter } from "next/navigation";
import PageForm from "../components/PageForm";

export default function NewPage() {
	const router = useRouter();

	const handleSubmit = async (data: any) => {
		const res = await fetch("/api/pages", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (res.ok) {
			router.push("/admin/pages");
		} else {
			const text = await res.text();
			alert(`Failed to create page: ${text}`);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-8">Create Page</h1>
			<PageForm onSubmit={handleSubmit} />
		</div>
	);
}
