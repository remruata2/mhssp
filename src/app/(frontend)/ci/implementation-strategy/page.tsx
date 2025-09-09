import Section from "../components/Section";
import PageTitle from "@/components/ui/PageTitle";
import ImageGallery from "../components/ImageGallery";

export const dynamic = "error";
export const revalidate = false;

export default function ImplementationStrategyPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle title="Implementation Strategy" />
			<Section className="py-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
					<div>
						<ImageGallery
							images={[
								"/images/CI/ci_activities/Implementation stratgy/WhatsApp Image 2024-10-31 at 11.52.28 AM.jpeg",
								"/images/CI/ci_activities/Implementation stratgy/WhatsApp Image 2025-02-06 at 6.17.04 AM (2).jpeg",
								"/images/CI/ci_activities/Implementation stratgy/WhatsApp Image 2025-04-02 at 3.14.23 PM.jpeg",
							]}
							gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-6"
							itemClassNames={[
								"sm:col-span-2 aspect-[3/2]", // large hero spanning two columns
								"aspect-[4/3]",
								"aspect-[4/3]",
							]}
						/>
					</div>
					<div className="text-gray-700 leading-7 text-[15px]">
						<p>
							To activate available resources and institutions at village level,
							existing village-level institutions such as Village Health
							Sanitation & Nutrition Committee (VHSNC), Self Help Group (SHG),
							Village Councils, Schools, Church, YMA & MHIP (local Mizoram Youth
							and Women’s associations), etc. were engaged. Together with the
							C.I. team, they embarked upon creating innovative pathways to
							reach maximum people using economical tools. The team covered all
							ethnic minority groups living in hard-to-reach areas, sometimes
							travelling by boats in the absence of any motorable roads.
						</p>
						<p className="mt-4">
							The team also developed simple leaflets, posters, story cards and
							miking scripts, but the primary focus was to ‘meaningfully engage’
							with the communities. Emphasis was placed on working together of
							the Health & Wellness Officer (HWO) and Community Level
							Functionary (CLF) members, designed to draw members out of their
							homes and initiate ‘collective planning exercises’ for betterment
							of their health. Engaging the students, youth associations,
							congregations in the Church, Village Council meetings, etc. were
							deliberately included to create inclusive efforts to talk, plan
							and actively participate. The frontline workers existing in the
							village were integral members in the mobilisation efforts.
						</p>
						<p className="mt-4">
							It is deemed important to initiate dialogues, discussions and
							debates on their individual health issues and promote
							health-seeking behaviour by making efforts to coalesce the health
							system staff and communities, living in the same village.
						</p>
					</div>
				</div>
			</Section>
		</div>
	);
}
