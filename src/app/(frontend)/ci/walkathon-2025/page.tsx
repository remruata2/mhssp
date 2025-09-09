import Image from "next/image";
import Section from "../components/Section";
import PageTitle from "@/components/ui/PageTitle";
import ImageGallery from "../components/ImageGallery";

export const dynamic = "error";
export const revalidate = false;

const galleryImages = [
    "/images/CI/ci_activities/Walkathon/20250321_065802.jpg",
    "/images/CI/ci_activities/Walkathon/RNZ_5926.JPG",
    "/images/CI/ci_activities/Walkathon/RNZ_6010.JPG",
    "/images/CI/ci_activities/Walkathon/WAKATHONE (10).JPG",
    "/images/CI/ci_activities/Walkathon/WAKATHONE (115).JPG",
    "/images/CI/ci_activities/Walkathon/WAKATHONE (137).JPG",
    "/images/CI/ci_activities/Walkathon/WAKATHONE (286).JPG",
    "/images/CI/ci_activities/Walkathon/WhatsApp Image 2025-03-22 at 12.35.31 PM.jpeg",
];

export default function Walkathon2025Page() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageTitle title="Walkathon" subtitle="Walk for Health - 2025" />

            {/* Gallery */}
            <Section className="py-8">
                <ImageGallery images={galleryImages} />
            </Section>

           

            {/* Write-up */}
            <Section className="py-10">
                <h2 className="text-2xl font-semibold text-blue-900">Walk for health – Walkathon 2025</h2>
				<p className="mt-4 text-gray-700 leading-7 text-[15px]">
						An initiative has been introduced to combat inactivity and encourage healthier
                    lifestyles to reduce Non-Communicable Diseases (NCDs).
                </p>
                <div className="relative w-full overflow-hidden rounded-lg shadow-sm py-6 flex justify-center">
                    <Image
                        src="/images/CI/ci_activities/Walkathon/Layer_1.png"
                        alt="Walkathon 2025 infographic"
                        width={300}
                        height={100}
                        className="mx-auto h-auto object-contain"
                        priority
                    />
                </div>
				<p className="mt-4 text-gray-700 leading-7 text-[15px]">
                    After two years of
                    community interventions, the CI team organised Walkathon 2025. The goal was to
                    cover the month of March 2025 at various village, district and state levels with
                    record participation across diverse demographics. By the end of Walkathon 2025,
                    over 78,000 people collectively covered nearly 2.75 lakh kilometers.
                </p>
                <p className="mt-4 text-gray-700 leading-7 text-[15px]">
                    All 510 villages actively participated in this health-focused community event.
                    The final event was held in Aizawl, where the Hon’ble Health Minister of
                    Mizoram and senior officials joined. It was broadcast live on YouTube and local
                    TV channels and extensively covered by local newspapers and photo-news reviews.
                </p>
                <p className="mt-4 text-gray-700 leading-7 text-[15px]">
                    The initiative promotes a grassroots approach rather than a top-down directive.
                    Walkathon 2025 was planned as a month-long event with live updates on local TV
                    news, task forces, road placards, and articles in local newspapers—designed as
                    a festival of the people—organised by them and for them.
                </p>
            </Section>

            {/* Video */}
            <Section className="py-6">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                    <iframe
                        className="h-full w-full"
                        src="https://www.youtube.com/embed/iER9oEr85VI?si=6bGad7wvdKjhtOFR"
                        title="Walkathon 2025 story"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </div>
                <p className="mt-2 text-center text-sm text-[#2B415A] font-medium">
                    Watch the Walkathon 2025 story
                </p>
            </Section>
        </div>
    );
}
