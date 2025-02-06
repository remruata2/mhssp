// components/AnimatedStats.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaHospital } from "react-icons/fa";
import { PiCertificateLight } from "react-icons/pi";

interface AnimatedStatProps {
	label: string;
	value: number | string;
	animateNumber?: boolean;
	icon?: React.ReactNode;
}

function AnimatedStat({
	label,
	value,
	animateNumber = true,
	icon,
}: AnimatedStatProps) {
	const [count, setCount] = useState(typeof value === "number" ? 0 : value);

	useEffect(() => {
		if (typeof value === "number" && animateNumber) {
			const duration = 1500; // Animation duration in ms
			const startTime = Date.now();

			const updateCount = () => {
				const progress = Date.now() - startTime;
				const percentage = Math.min(progress / duration, 1);
				const currentValue = Math.floor(value * percentage);

				setCount(currentValue);

				if (percentage < 1) {
					requestAnimationFrame(updateCount);
				}
			};

			requestAnimationFrame(updateCount);
		}
	}, [value, animateNumber]);

	return (
		<motion.div
			className="text-center"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex justify-center text-4xl mb-4 text-blue-600">
				{icon}
			</div>
			<span className="text-4xl font-bold text-black drop-shadow-lg">
				{count}
			</span>
			<p className="mt-2 text-lg font-medium text-black/70">{label}</p>
		</motion.div>
	);
}

export default function AnimatedStats() {
	return (
		<motion.div
			className="grid grid-cols-3 gap-8 py-12 bg-white"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
		>
			<AnimatedStat
				label="IPA Units"
				value="82"
				animateNumber={false}
				icon={<FaHospital />}
			/>
			<AnimatedStat
				label="National NQAS Certified Hospitals"
				value={14}
				animateNumber={true}
				icon={<PiCertificateLight className="text-green-600" />}
			/>
			<AnimatedStat
				label="State NQAS Certified Hospitals"
				value={31}
				animateNumber={true}
				icon={<PiCertificateLight className="text-red-600" />}
			/>
		</motion.div>
	);
}
