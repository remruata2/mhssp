import Image from "next/image";
import Section from "../components/Section";
import PageTitle from "@/components/ui/PageTitle";
import ImageGallery from "../components/ImageGallery";

export const dynamic = "error";
export const revalidate = false;

export default function SBCCStrategyPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle title="SBCC Strategy" />
			<Section className="py-10">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
					<div className="lg:col-span-2 text-gray-700 leading-7 text-[15px]">
						<p>
							The MHSSP Community Intervention developed an SBCC strategy to
							tackle high-risk behaviours linked to Non-Communicable Diseases
							(NCDs) and promote healthy lifestyles. The strategy included a
							detailed communication plan, capacity building for community
							functionaries, tailored communication strategies, and an M&E plan.
						</p>
						<h3 className="mt-6 text-[#1f4c6b] font-semibold text-lg">
							To inform the SBCC strategy
						</h3>
						<ul className="list-disc pl-6 mt-2 space-y-1">
							<li>
								A secondary literature review collected data on existing NCD
								strategies.
							</li>
							<li>
								A KAP study assessed current practices, awareness, challenges
								and communication channels regarding NCDs.
							</li>
							<li>
								A state-level Stakeholder Consultation Meeting gathered insights
								from relevant stakeholders.
							</li>
						</ul>
						<p className="mt-4">
							The communication strategy targets common NCDs like hypertension,
							diabetes, oral cancer, breast cancer, and cervical cancer to boost
							awareness, healthy habits, and screening services.
						</p>
						<h3 className="mt-6 text-[#1f4c6b] font-semibold text-lg">
							Community Intervention Model, Communication Tools, and Training
						</h3>
						<p className="mt-2">
							The model emphasises well-trained community change agents. The
							Capacity Building Strategy (CBS) features comprehensive training
							materials focused on NCD management, including a training manual
							and facilitators guide. It involves orientation for master
							trainers and a two-day Training of Trainers (ToT) for Health &
							Wellness Officers, who then train village-level functionaries with
							necessary SBCC skills and tools.
						</p>
						<p className="mt-4">
							A detailed Strategic Behaviour Change Communication (SBCC)
							document of Community Intervention of MHSSP can be downloaded
							here.
						</p>
					</div>
					<div className="space-y-6">
						<ImageGallery
							images={[
								"/images/CI/ci_activities/SBCC/WhatsApp Image 2025-04-02 at 3.14.26 PM (1).jpeg",
								"/images/CI/ci_activities/SBCC/WhatsApp Image 2025-01-08 at 3.41.28 PM copy.jpeg",
								"/images/CI/ci_activities/SBCC/WhatsApp Image 2025-04-02 at 3.17.43 PM.jpeg",
							]}
							gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-6"
							itemClassNames={[
								"aspect-[4/3]",
								"aspect-[4/3]",
								"sm:col-span-2 aspect-[3/2]",
							]}
						/>
					</div>
				</div>
			</Section>
		</div>
	);
}
