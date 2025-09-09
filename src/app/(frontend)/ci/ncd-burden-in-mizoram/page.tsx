import Image from "next/image";
import Link from "next/link";
import Section from "../components/Section";
import StatCircle from "../components/StatCircle";
import PageTitle from "@/components/ui/PageTitle";
import ImageGallery from "../components/ImageGallery";

export const dynamic = "error";
export const revalidate = false;

export default function NcdBurdenPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle title="NCD Burden in Mizoram" />

			<Section className="py-8">
				<ImageGallery
					images={[
						"/images/CI/ci_activities/NCD Burden/IMG-20250112-WA0002.jpg",
						"/images/CI/ci_activities/NCD Burden/IMG-20240924-WA0034.jpg",
						"/images/CI/ci_activities/NCD Burden/HWO (3).jpeg",
					]}
					gridClassName="grid grid-cols-1 sm:grid-cols-3 gap-6"
				/>
			</Section>

			<Section>
				<p className="text-gray-700 leading-7 text-[15px]">
					The state of Mizoram is deemed as best performer among smaller states
					for excelling in immunisation and institutional births', however,
					there are other health related challenges facing its community.
				</p>
			</Section>

			<Section className="py-10">
				<div className="flex justify-center">
					<div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border bg-white shadow">
						<div className="relative w-full">
							<Image
								src="/images/CI/ci_activities/NCD Burden/ncdfigure.png"
								alt="NCD burden in Mizoram"
								width={1600}
								height={900}
								className="w-full h-auto object-contain"
								priority
							/>
						</div>
					</div>
				</div>
			</Section>

			<Section className="pb-12">
				<p className="text-gray-700 leading-7 text-[15px]">
					It is reported that 13% percent of women and 23% of men in the age
					groups of 15–49 have hypertension. In the same age groups 5% women and
					7% men reported to have diabetes. Additionally, high tobacco use
					contributes to the disease burden with 55.5% attributed to NCDs. The
					National Family Health Survey, round 5 (NFHS 5) data shows low cancer
					screening rates among women and men. In Mizoram, only 4% of women aged
					15–49 have ever undergone a screening test for cervix cancer, 2% for
					breast cancer, and only 0.8% of women and 1% of men have ever
					undergone a screening test for oral cavity cancer. This underscores
					the need for prioritised interventions through community platforms.
					These challenges are accentuated due to the geographical layout of the
					state and its community-based social landscape.
				</p>
				<div className="mt-8">
					<Link
						href="/ci"
						className="inline-block text-sm text-white bg-[#2B415A] hover:bg-[#223449] px-4 py-2 rounded-full"
					>
						Back to CI
					</Link>
				</div>
			</Section>
		</div>
	);
}
