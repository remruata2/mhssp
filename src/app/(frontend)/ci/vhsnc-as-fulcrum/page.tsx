import Section from "../components/Section";
import PageTitle from "@/components/ui/PageTitle";
import ImageGallery from "../components/ImageGallery";

export const dynamic = "error";
export const revalidate = false;

export default function VHSNCAsFulcrumPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle title="VHSNC as Fulcrum" />
			<Section className="py-10">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
					<div className="lg:col-span-2 text-gray-700 leading-7 text-[15px]">
						<p>
							MHSSP designated VHSNC as the primary organisation for executing
							CI activities in the target districts. VHSNCs anchor the
							mobilisation, participate in planning, and ensure last-mile
							engagement with households through village institutions and
							groups.
						</p>
						<p className="mt-4">
							This page highlights how VHSNCs function as the fulcrum to
							coordinate stakeholders and deliver CI activities effectively
							across villages and districts.
						</p>
					</div>
					<div>
						<ImageGallery
							images={["/images/CI/ci_activities/VHSNC/Rally2.jpeg"]}
							gridClassName="grid grid-cols-1"
						/>
					</div>
				</div>
			</Section>
		</div>
	);
}
