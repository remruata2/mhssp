"use client";

import HeroBanner from "@/components/HeroBanner";
import Projects from "@/components/Projects";
import AnimatedStats from "@/components/AnimatedStats";

export default function HomePage() {
	return (
		<div className="min-h-screen">
			<HeroBanner />
			<AnimatedStats />
			<Projects />
		</div>
	);
}
