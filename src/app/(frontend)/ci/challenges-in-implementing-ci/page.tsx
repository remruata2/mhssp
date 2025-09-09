import Section from "../components/Section";
import PageTitle from "@/components/ui/PageTitle";
import ImageGallery from "../components/ImageGallery";

export const dynamic = "error";
export const revalidate = false;

export default function ChallengesInCISPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle title="Challenges in implementing CI" />

			{/* Challenges card */}
			<Section className="py-10">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white shadow rounded-2xl p-6">
					<div className="lg:col-span-2">
						<div className="rounded-2xl p-6">
							<h3 className="text-[#1f4c6b] font-semibold">ACCESSIBILITY ISSUES:</h3>
							<ul className="mt-2 text-[15px] text-gray-700 list-disc pl-6 space-y-1">
								<li>In 3 districts of Lawngtlai, Lunglei and Mamit – considerable numbers of villages are difficult to access in monsoon months – posing serious challenge in outreach and service delivery</li>
								<li>The harsh monsoons, landslides and roads get washed away</li>
								<li>More than 70+ villages are to be accessed by boats during these months</li>
								<li>Limited internet connectivity including power supply poses challenges in timely communication and delay in report submission</li>
							</ul>

							<h3 className="mt-6 text-[#1f4c6b] font-semibold">SYSTEMIC ISSUES OF SUPPLY CHAIN MANAGEMENT</h3>
							<ul className="mt-2 text-[15px] text-gray-700 list-disc pl-6 space-y-1">
								<li>State considering the challenges of supply and distribution of NCD drugs, equipments and testing kits</li>
								<li>Supply shortages adversely affect the demand created by Community Interventions</li>
								<li>HWOs conduct home visits of severely affected patients and offer drugs and conduct tests</li>
								<li>Boats and bikes strategy initiated in Lunglei to cover 33 hard-to-reach areas in coordination with district authorities.</li>
							</ul>

							<h3 className="mt-6 text-[#1f4c6b] font-semibold">HUMAN RESOURCES ISSUES</h3>
							<ul className="mt-2 text-[15px] text-gray-700 list-disc pl-6 space-y-1">
								<li>The CI is managed single-handedly by District Community Mobiliser (DCM)</li>
								<li>The project continues to make concerted efforts to increase ownership of several health department officials (NP-NCD, NCD Coordinator, ASHA Coordinator and other NHM officials) at state and district level.</li>
							</ul>
						</div>
					</div>
					{/* Right images (lightbox) */}
					<div>
						<ImageGallery
							className="max-w-[280px] w-full"
							images={[
								"/images/CI/ci_activities/Challenges in implementing/Picture 21.jpg",
								"/images/CI/ci_activities/Challenges in implementing/IMG-20241213-WA0022.jpg",
							]}
							gridClassName="grid grid-cols-1 gap-6"
							itemClassNames={["aspect-[1/1]", "aspect-[1/1]"]}
						/>
					</div>
				</div>
			</Section>

			{/* CI Coverage */}
			<Section className="pb-16">
				<h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">CI Coverage</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
					<div>
						<ImageGallery
							images={[
								"/images/CI/ci_activities/Challenges in implementing/WhatsApp Image 2024-04-04 at 3.31.31 PM copy.jpeg",
								"/images/CI/ci_activities/Challenges in implementing/Picture 1.jpg",
							]}
							gridClassName="grid grid-cols-1 gap-6"
							itemClassNames={["aspect-[16/9]", "aspect-[16/9]"]}
						/>
					</div>
					<div>
						<ImageGallery
							images={["/images/CI/ci_activities/Challenges in implementing/CI Coverage figure.png"]}
							gridClassName="grid grid-cols-1"
							itemClassNames={["aspect-[3/2]"]}
						/>
					</div>
				</div>
			</Section>
		</div>
	);
}
