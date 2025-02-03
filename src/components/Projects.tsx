"use client";

import ProjectHighlight from "./ui/ProjectHighlight";

const projects = [
  {
    title:
      "Clinical Vignettes for Clinical Knowledge & Skill Improvement (CSKI)",
    description:
      "This clinical skill development program is available for continuing education of healthcare professionals working in Mizoram. This program is offered through the MHSSP Clinical Skill Development App which is available to download on Android devices via Play Store.",
    image: "/images/cksi.jpg",
    link: "/projects/healthcare-infrastructure",
  },
  {
    title: "Community Health Programs",
    description:
      "Our community health initiatives focus on preventive healthcare, health education, and early intervention. We work closely with local communities to promote better health practices and ensure healthcare accessibility.",
    image: "/images/community-health.webp",
    link: "/projects/community-health",
  },
  {
    title: "Medical Education & Training",
    description:
      "We are committed to building a strong healthcare workforce through comprehensive training programs, skill development workshops, and continuous medical education initiatives for healthcare professionals.",
    image: "/images/digital-health.jpg",
    link: "/projects/medical-education",
  },
];

export default function Projects() {
  return (
    <section className="bg-white">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Our Projects</h2>
            <div className="mt-2 w-24 h-1 bg-red-600 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600">
              Initiatives that are transforming healthcare in Mizoram
            </p>
          </div>
        </div>

        {projects.map((project, index) => (
          <ProjectHighlight
            key={index}
            title={project.title}
            description={project.description}
            image={project.image}
            link={project.link}
            isReversed={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
