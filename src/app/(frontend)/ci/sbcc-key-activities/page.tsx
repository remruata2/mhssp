import Image from "next/image";
import Section from "../components/Section";
import PageTitle from "@/components/ui/PageTitle";

export const dynamic = "error";
export const revalidate = false;

export default function SBCCKeyActivitiesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageTitle title="SBCC Key Activities" />

            {/* Official figure from design */}
            <Section className="pt-10 pb-2">
                <div className="rounded-xl overflow-hidden bg-white shadow">
                    <div className="relative w-full">
                        <Image
                            src="/images/CI/ci_activities/SBCC%20Key%20Activities/sbccfigure.png"
                            alt="SBCC Key Activities figure"
                            width={1920}
                            height={900}
                            className="w-full h-auto object-contain"
                            priority
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="rounded-xl p-6">
                            <h3 className="text-center text-lg font-semibold text-gray-900">IPC Activities</h3>
                            <ul className="mt-4 list-decimal pl-5 text-sm text-gray-700 space-y-1">
                                <li>House-to-house visit/campaign</li>
                                <li>Group Meeting</li>
                            </ul>
                        </div>
                        <div className="rounded-xl p-6">
                            <h3 className="text-center text-lg font-semibold text-gray-900">Mid-media Activities</h3>
                            <ul className="mt-4 list-decimal pl-5 text-sm text-gray-700 space-y-1">
                                <li>Poster display</li>
                                <li>Flex display</li>
                                <li>Miking</li>
                                <li>School/Youth Competition</li>
                            </ul>
                        </div>
                        <div className="rounded-xl p-6">
                            <h3 className="text-center text-lg font-semibold text-gray-900">Mass-media Activities</h3>
                            <ul className="mt-4 list-decimal pl-5 text-sm text-gray-700 space-y-1">
                                <li>Rally</li>
                                <li>Local Newspaper ads</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <p className="mt-8 text-gray-700 leading-7 text-[15px]">
                    Social and Behaviour Change Communication is a process of interactivity communicating with
                    individuals, institutions, communities and societies as part of an overall programme of
                    information dissemination, motivation, problem solving and planning.
                </p>
            </Section>

            {/* SBCC table-like grid */}
            <Section className="pb-16">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Behavioral Change Communication (SBCC)</h2>
                <div className="overflow-hidden rounded-xl border bg-white shadow">
                    {/* Header */}
                    <div className="grid grid-cols-1 md:grid-cols-3 text-white">
                        <div className="bg-[#1f4c6b] p-4 font-semibold text-center">Communication</div>
                        <div className="bg-[#1f4c6b] p-4 font-semibold text-center">Activities</div>
                        <div className="bg-[#1f4c6b] p-4 font-semibold text-center">SBCC tools and techniques</div>
                    </div>

                    {/* IPC row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 bg-sky-800/90 ">
                        <div className="text-white p-4 text-sm font-medium">
                            Inter-personal communication (IPC)
                        </div>
                        <div className="p-4 text-sm text-white">
                            <ul className="list-disc pl-5 space-y-1">
                                <li>One-to-one communication with individuals and households</li>
                                <li>Group level communication sessions (VHSNCs, Health Days, important days e.g., Cancer Day)</li>
                            </ul>
                        </div>
                        <div className="p-4 text-sm text-white">
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Leaflets, Flipcard etc.</li>
                                <li>Flipbook, Leaflets, Games, etc.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Mid-media row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 bg-amber-600/90 ">
                        <div className="text-white p-4 text-sm font-medium">
                            Mid-media communication
                        </div>
                        <div className="p-4 text-sm text-white">
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Display of Posters at relevant places (HWC, Community Hall etc)</li>
                                <li>Flex display</li>
                                <li>Miking</li>
                            </ul>
                        </div>
                        <div className="p-4 text-sm text-white">
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Poster, Flex display, to be placed where visible and readable</li>
                            </ul>
                        </div>
                    </div>

                    {/* Mass media row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 bg-rose-400/90">
                        <div className="text-white p-4 text-sm font-medium">Mass media communication</div>
                        <div className="p-4 text-sm text-white">
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Rallies, school/youth competition, etc.</li>
                                <li>Advertisement/article in local YMA or MHIP newsletters/newspapers</li>
                            </ul>
                        </div>
                        <div className="p-4 text-sm text-white">
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Use locally available mass media channels and resources</li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-4 text-sm text-gray-700 border-t">Fund allocated: INR 5,000 per village per quarter</div>
                </div>
            </Section>
        </div>
    );
}
