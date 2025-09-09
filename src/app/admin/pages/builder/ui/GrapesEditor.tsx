"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
	initialHtml?: string;
}

export default function GrapesEditor({ initialHtml = "" }: Props) {
	const editorRef = useRef<HTMLDivElement | null>(null);
	const [loading, setLoading] = useState(true);
	const [editor, setEditor] = useState<any>(null);

	useEffect(() => {
		let mounted = true;
		// Inject GrapesJS CSS via CDN to avoid bundler parsing issues
		const cssHref = "https://unpkg.com/grapesjs/dist/css/grapes.min.css";
		const existing = document.querySelector(`link[href='${cssHref}']`);
		let linkEl: HTMLLinkElement | null = null;
		if (!existing) {
			linkEl = document.createElement("link");
			linkEl.rel = "stylesheet";
			linkEl.href = cssHref;
			document.head.appendChild(linkEl);
		}
		(async () => {
			const grapesjs = (await import("grapesjs")).default;
			// @ts-ignore: types not bundled for preset
			const presetWebpage = (await import("grapesjs-preset-webpage")).default;

			const e = grapesjs.init({
				container: editorRef.current!,
				fromElement: false,
				height: "100%",
				storageManager: { type: null },
				plugins: [presetWebpage],
				canvas: {
					// Load Tailwind runtime so Tailwind classes render inside the editor canvas
					scripts: ["https://cdn.tailwindcss.com"],
				},
			});

			if (initialHtml) {
				e.setComponents(initialHtml);
			}

			// Add a few useful custom blocks tailored to our CI page
			const bm = e.BlockManager;
			bm.add("hero-section", {
				label: "Hero",
				category: "Sections",
				content:
					'<section class="relative bg-[url(https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2070&auto=format&fit=crop)] bg-cover bg-center">\
            <div class="bg-black/40">\
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white text-center">\
                <h1 class="text-4xl font-bold mb-3">Community Intervention</h1>\
                <p class="text-lg opacity-90">CI activities engage with communities in 510 villages in six districts.</p>\
                <a href="#" class="inline-block mt-6 px-6 py-3 rounded-full bg-sky-600 hover:bg-sky-700">Read more</a>\
              </div>\
            </div>\
          </section>',
			});

			bm.add("ci-card", {
				label: "CI Card",
				category: "Cards",
				content:
					'<div class="bg-white rounded-xl shadow overflow-hidden flex flex-col">\
            <div class="h-40 bg-gray-200"></div>\
            <div class="p-5 flex-1 flex flex-col">\
              <h3 class="text-lg font-semibold mb-2">Card title</h3>\
              <p class="text-sm text-gray-600 mb-4">Short description goes here…</p>\
              <div class="mt-auto">\
                <a href="#" class="inline-block bg-[#2B415A] text-white text-sm px-4 py-2 rounded-full">Read more</a>\
              </div>\
            </div>\
          </div>',
			});

			bm.add("ci-grid", {
				label: "CI Grid",
				category: "Sections",
				content:
					'<section class="py-10">\
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">\
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">\
                <div class="bg-white rounded-xl shadow overflow-hidden h-56"></div>\
                <div class="bg-white rounded-xl shadow overflow-hidden h-56"></div>\
                <div class="bg-white rounded-xl shadow overflow-hidden h-56"></div>\
              </div>\
            </div>\
          </section>',
			});

			if (mounted) {
				setEditor(e);
				setLoading(false);
			}
		})();
		return () => {
			mounted = false;
			if (editor) editor.destroy();
			if (linkEl) document.head.removeChild(linkEl);
		};
	}, []);

	const handleExport = () => {
		if (!editor) return;
		const html = editor.getHtml();
		const css = editor.getCss();
		const content = `${html}\n<style>${css}</style>`;
		navigator.clipboard.writeText(content);
		alert("Copied HTML+CSS to clipboard. Paste into the Page content field.");
	};

	const handleSaveToPage = async () => {
		const params = new URLSearchParams(window.location.search);
		const id = params.get("id");
		if (!id) {
			alert(
				"No page id provided. Open the builder from the Pages list to save."
			);
			return;
		}
		const html = editor.getHtml();
		const css = editor.getCss();
		const content = `${html}\n<style>${css}</style>`;
		const res = await fetch(`/api/pages/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ content }),
		});
		if (res.ok) {
			alert("Saved to page.");
		} else {
			const text = await res.text();
			alert(`Failed to save: ${text}`);
		}
	};

	return (
		<div className="h-full flex flex-col">
			<div className="p-2 bg-gray-100 border-b flex gap-2">
				<button
					onClick={handleExport}
					className="px-3 py-1 rounded bg-indigo-600 text-white text-sm"
				>
					Copy HTML+CSS
				</button>
				<button
					onClick={handleSaveToPage}
					className="px-3 py-1 rounded bg-emerald-600 text-white text-sm"
				>
					Save to Page
				</button>
			</div>
			<div ref={editorRef} className="flex-1 min-h-0" />
			{loading && <div className="p-4">Loading builder…</div>}
		</div>
	);
}
