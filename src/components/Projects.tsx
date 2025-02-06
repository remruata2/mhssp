"use client";

import ProjectHighlight from "./ui/ProjectHighlight";
import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
	{
		title:
			"Clinical Vignettes for Clinical Knowledge & Skill Improvement (CSKI)",
		description:
			"This clinical skill development program is available for continuing education of healthcare professionals working in Mizoram. This program is offered through the MHSSP Clinical Skill Development App which is available to download on Android devices via Play Store.",
		image: "/images/cksi2.webp",
		link: "/cksi",
	},
	{
		title: "VAHUI - Grievance Redressal Portal",
		description:
			"The Health & Family Welfare Department, Govt. of Mizoram in collaboration with MHSSP provides an online platform “Vahui” for Grievance Redressal under Health & Family Welfare Department. Vahui acts as a medium of communication between the department and the public who avails the services of health units.",
		image: "/images/vahui.jpeg",
		link: "https://www.vahui.in",
	},
	{
		title: "Infrastructure",
		description:
			"Enhancing the quality of public health services at the state of Mizoram is one of the main objectives of the project. The project has successfully constructed 3 (three) Chief Medical Officer (CMO) Offices at Hnahthial, Saitual and Khawzawl Districts and Renovation of Mizoram State Healthcare Society (MSHCS) Office at Dinthar, Aizawl. Infrastructure revamping is undertaken at Lunglei Civil Hospital, Lawngtlai District Hospital, Siaha District Hospital and Champhai District Hospital to achieve NQAS certification. The project has initiated the Strengthening & Upgradation of Mizoram College of Nursing (MCON) to accommodate first batch of Post Basic B.Sc Nursing and M.Sc Nursing.",
		image: "/images/infrastructure-saitual.jpeg",
		link: "/infrastructure",
	},
];

export default function Projects() {
	return (
		<section className="relative min-h-screen overflow-hidden">
			{/* Ripple Background */}
			<div className="gradient-bg ripple-background">
				<div className="ripple-circle ripple-xxlarge ripple-shade1" />
				<div className="ripple-circle ripple-xlarge ripple-shade2" />
				<div className="ripple-circle ripple-large ripple-shade3" />
				<div className="ripple-circle ripple-medium ripple-shade4" />
				<div className="ripple-circle ripple-small ripple-shade5" />
			</div>

			{/* Animated Background */}
			{/* <div className="animated-bg-circles">
				<ul className="circles">
					{[...Array(10)].map((_, i) => (
						<li
							key={i}
							className="animated-circle"
							style={{
								width: `${[80, 20, 20, 60, 20, 110, 150, 25, 15, 150][i]}px`,
								height: `${[80, 20, 20, 60, 20, 110, 150, 25, 15, 150][i]}px`,
								left: `${[25, 10, 70, 40, 65, 75, 35, 50, 20, 85][i]}%`,
								animationDelay: `${[0, 2, 4, 0, 0, 3, 7, 15, 2, 0][i]}s`,
								animationDuration: `${
									[25, 12, 25, 18, 25, 25, 25, 45, 35, 11][i]
								}s`,
							}}
						/>
					))}
				</ul>
			</div> */}

			{/* Background Image with Gradient Overlay */}
			<div className="absolute inset-0 -z-10">
				<Image
					src="/images/healthcare-pattern.jpg"
					alt="Healthcare pattern background"
					fill
					className="object-cover opacity-20"
					quality={80}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-white/80" />
			</div>

			{/* Content */}
			<div className="relative z-10 py-12 lg:py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="text-center"
					>
						<h2 className="text-4xl font-bold text-gray-700 mb-4">
							Our Initiatives
						</h2>
						<div className="mt-2 w-24 h-1 bg-red-600 mx-auto" />
						<p className="mt-6 text-xl text-gray-700 max-w-2xl mx-auto">
							Transforming healthcare through innovation and collaboration
						</p>
					</motion.div>
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{projects.map((project, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-100px" }}
							transition={{
								duration: 0.6,
								delay: index * 0.1,
								ease: [0.16, 1, 0.3, 1],
							}}
						>
							<ProjectHighlight
								title={project.title}
								description={project.description}
								image={project.image}
								link={project.link}
								isReversed={index % 2 === 1}
							/>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
