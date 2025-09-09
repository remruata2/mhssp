import Section from "../components/Section";
import PageTitle from "@/components/ui/PageTitle";
import ImageGallery from "../components/ImageGallery";

export const dynamic = "error";
export const revalidate = false;

export default function CapacityBuildingStrategyPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle title="Capacity Building Strategy" />
			<Section className="py-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
					<div className="lg:col-span-1">
						<ImageGallery
							images={[
								"/images/CI/ci_activities/CBS/Copy of TOTs training.JPG",
								"/images/CI/ci_activities/CBS/20240820_124232.jpg",
								"/images/CI/ci_activities/CBS/IMG_20230609_110058.jpg",
							]}
							gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-6"
							itemClassNames={[
								"sm:col-span-2 aspect-[3/2]",
								"aspect-[4/3]",
								"aspect-[4/3]",
							]}
						/>
					</div>
					<div className="lg:col-span-1 text-gray-700 leading-7 text-[15px]">
						<p>
							The primary objective of the training is to enhance community
							members' understanding of common non-communicable diseases (NCDs)
							and the importance of maintaining a healthy lifestyle. The
							emphasis is on integrating these priorities into their daily
							routines. The NCD services will primarily focus on hypertension,
							diabetes, oral cancer, breast cancer, and cervical cancer.
						</p>
						<p className="mt-4">
							The training program is designed for key personnel at the
							district, sub-district, and village levels. The content of the
							training is tailored to the roles of these personnel within
							community interventions, with an emphasis on improving their
							knowledge and skills related to healthy lifestyles and
							primary-level NCDs, as well as soft skills necessary for
							delivering training and engaging with community members.
						</p>
						<p className="mt-4">
							The development of the training package underwent a rigorous
							evidence-based and consultative process that involved formative
							research and stakeholder consultation meetings. The draft package
							was pre-tested, and amendments were made based on the pre-test
							findings. Consequently, the training material developed was well
							received by participants, who found it relevant, balanced, and
							easy to comprehend.
						</p>
						<p className="mt-4">
							The Capacity Building Strategy document includes a Training
							Manual, Facilitator Guide, and Training Aids, all of which have
							been translated from English to the Mizo and Chakma languages.
						</p>
					</div>
				</div>
			</Section>
		</div>
	);
}
