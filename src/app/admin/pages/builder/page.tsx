"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const GrapesEditor = dynamic(() => import("./ui/GrapesEditor"), {
	ssr: false,
});

export default function BuilderPage() {
	const search = useSearchParams();
	const id = search.get("id");
	const [initialHtml, setInitialHtml] = useState<string>(
		'<section class="p-8 text-center"><h1>New Page</h1><p>Start building…</p></section>'
	);

	useEffect(() => {
		if (!id) return;
		// fetch existing page to prefill editor
		(async () => {
			const res = await fetch(`/api/pages/${id}`);
			if (!res.ok) return;
			const data = await res.json();
			if (data?.success && data?.data?.content) {
				setInitialHtml(data.data.content);
			}
		})();
	}, [id]);

	return (
		<div className="h-[calc(100vh-4rem)] -m-8">
			<GrapesEditor initialHtml={initialHtml} />
		</div>
	);
}
