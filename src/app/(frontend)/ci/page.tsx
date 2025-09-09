import Image from "next/image";
import Link from "next/link";
import { ciPages, type CIPageMeta } from "@/app/(frontend)/ci/data";

export default function CIPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero section */}
			<section className="relative h-[640px] w-full">
				<Image
					src="/images/CI/ci_activities/CommunityIntervention.jpg"
					alt="Community Intervention"
					fill
					priority
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
				<div className="absolute inset-0 flex items-end pb-16">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<h1 className="text-white text-4xl sm:text-5xl font-bold drop-shadow">
							Community Intervention
						</h1>
						<p className="mt-4 max-w-2xl text-white/90 text-base sm:text-lg">
							Community Intervention (CI) activities engage with communities in
							510 villages in six districts.
						</p>
						<div className="mt-6">
							<Link
								href="/ci/community-intervention"
								className="inline-block bg-[#2B415A] text-white text-sm px-5 py-2.5 rounded-full hover:bg-[#223449]"
							>
								Read more
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Cards grid */}
			<section
				id="ci-grid"
				className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{ciPages.map((item: CIPageMeta) => (
						<div
							key={item.slug}
							className="bg-white rounded-xl shadow overflow-hidden flex flex-col"
						>
							<div className="relative h-48 w-full bg-gray-100">
								<Image
									src={item.thumbnailUrl}
									alt={item.title}
									fill
									className="object-cover"
								/>
							</div>
							<div className="p-5 flex-1 flex flex-col">
								<h3 className="text-lg font-semibold mb-2">{item.title}</h3>
								<p
									className="text-sm text-gray-600 mb-4"
									style={{
										display: "-webkit-box",
										WebkitLineClamp: 3,
										WebkitBoxOrient: "vertical",
										overflow: "hidden",
									}}
								>
									{item.excerpt}
								</p>
								<div className="mt-auto">
									<Link
										href={`/ci/${item.slug}`}
										className="inline-block bg-[#2B415A] text-white text-sm px-4 py-2 rounded-full hover:bg-[#223449]"
									>
										Read more
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
