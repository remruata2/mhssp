// src/app/(frontend)/cksi/page.tsx
"use client";

export default function CksiPage() {
	return (
		<div style={{ height: "100vh", width: "100vw" }}>
			<iframe
				src="/cksi/index.html"
				style={{
					border: "none",
					width: "100%",
					height: "100%",
					overflow: "hidden",
				}}
				title="CKSI Page"
			/>
		</div>
	);
}
