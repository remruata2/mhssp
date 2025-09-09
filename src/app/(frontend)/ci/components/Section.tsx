import { ReactNode } from "react";

interface SectionProps {
	children: ReactNode;
	className?: string;
	containerClassName?: string;
}

export default function Section({
	children,
	className,
	containerClassName,
}: SectionProps) {
	return (
		<section className={className}>
			<div
				className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${
					containerClassName ?? ""
				}`}
			>
				{children}
			</div>
		</section>
	);
}
