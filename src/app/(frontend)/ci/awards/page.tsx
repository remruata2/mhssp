import Image from "next/image";
import Section from "../components/Section";
import PageTitle from "@/components/ui/PageTitle";

export const dynamic = "error";
export const revalidate = false;

export default function AwardsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageTitle title="Awards" />

            {/* Featured award photo */}
            <Section className="pt-8 pb-4">
                <div className="flex justify-center">
                    <div className="relative rounded-2xl overflow-hidden bg-white shadow w-full max-w-3xl">
                        <div className="relative aspect-[3/1.6]">
                            <Image
                                src="/images/CI/ci_activities/Awards/Pic 5 (1).jpg"
                                alt="AHA Institutional Award ceremony"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Copy */}
            <Section className="pb-12">
                <div className="prose max-w-3xl mx-auto prose-slate">
                    <p className="text-gray-800 leading-7 text-[15px]">
                        <span className="font-semibold">AHA Institutional Award:</span> In 10th Safe & Sustainable Hospitals (SASH), conference held on 19th – 21st December, 2024 at New Delhi.
                    </p>
                    <p className="text-gray-800 leading-7 text-[15px] mt-4">
                        Mizoram Community Intervention Component received <span className="font-semibold italic">Excellence in Community Outreach Award</span> from the performance for innovative ways of reaching out to communities.
                    </p>
                </div>
            </Section>
        </div>
    );
}
