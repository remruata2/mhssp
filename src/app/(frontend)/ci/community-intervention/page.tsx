import Image from "next/image";
import Section from "../components/Section";
import PageTitle from "@/components/ui/PageTitle";
import CommunityIntroGallery from "../components/CommunityIntroGallery";

export const dynamic = "error";
export const revalidate = false;

export default function CommunityInterventionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle title="Community Intervention" />

      {/* Intro block with curated image layout and lightbox */}
      <Section className="py-10">
        <CommunityIntroGallery
          images={{
            leftTop: { src: "/images/CI/ci_activities/CI/4f583552-c0be-402b-9f46-336fc62ce4b1.jpg", alt: "Community meeting" },
            leftBottom: { src: "/images/CI/ci_activities/CI/WhatsApp Image 2024-04-04 at 3.31.31 PM.jpeg", alt: "Household interaction" },
            center: { src: "/images/CI/ci_activities/CI/IMG-20241213-WA0016.jpg", alt: "CI rally" },
            rightTop: { src: "/images/CI/ci_activities/CI/WhatsApp Image 2024-09-11 at 5.01.39 PM.jpg", alt: "Awareness session" },
            rightBottom: { src: "/images/CI/ci_activities/CI/WhatsApp Image 2025-04-02 at 3.17.45 PM (1).jpg", alt: "Community discussion" },
          }}
        />
        <div className="mt-6 text-gray-700 leading-7 text-[15px]">
          <p>
            The Mizoram Health Systems Strengthening Project (MHSSP), started in 2021 by the
            Health & Family Welfare Department, Government of Mizoram, with support from The World Bank.
            Community Intervention (CI) activities engage with communities in 510 villages within six
            districts. They focus on developing communication campaigns and capacity building to boost
            demand‑side interventions. The priority is increasing screening for Non‑Communicable Diseases
            (NCDs) – hypertension, diabetes, oral, breast, cervical cancers – and promoting healthy lifestyles.
          </p>
        </div>
      </Section>

      {/* Journey / Infographic */}
      <Section className="pb-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Community Intervention Journey</h2>
        <div className="relative w-full overflow-hidden rounded-xl border flex justify-center">
          <Image
            src="/images/CI/ci_activities/CI/figureforJourneyHeader.png"
            alt="Community Intervention Journey"
            width={950}
            height={500}
            className="w-[600px] h-auto object-contain"
            priority
          />
        </div>
      </Section>
    </div>
  );
}
