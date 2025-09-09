import Section from "../components/Section";
import PageTitle from "@/components/ui/PageTitle";
import Image from "next/image";
import ImageGallery from "../components/ImageGallery";

export const dynamic = "error";
export const revalidate = false;

export default function VHSNCAsFulcrumPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle title="VHSNC as Fulcrum agency for CI" />

      {/* Hero content row: left image, right copy */}
      <Section className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left: feature image */}
          <div className="order-1 md:order-none">
            <div className="relative w-full overflow-hidden rounded-xl shadow bg-white">
              <Image
                src="/images/CI/ci_activities/VHSNC/Rally2.jpeg"
                alt="VHSNC community engagement"
                width={1500}
                height={1000}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>

          {/* Right: text */}
          <div className="md:col-span-2 text-gray-700 leading-7 text-[15px]">
            <p>
              The Village Health Sanitation and Nutrition Committee (VHSNC) is
              responsible for implementing initiatives outlined in the Village Health
              Plan. MHSSP designated VHSNC as the primary organisation for executing CI
              activities in the target districts.
            </p>
            <p className="mt-4">
              Financial support is provided to the CLFs (SHG and MHIP) through VHSNC,
              ensuring they have the necessary resources to perform their tasks. A key
              aspect of the program is its emphasis on engaging community members and
              local stakeholders. By involving these individuals directly in the
              program, they are more likely to contribute to its success over time.
            </p>
            <p className="mt-4">
              The CI team collaborates with <strong>239 Health &amp; Wellness Centres</strong> in 
              <strong> 510 villages</strong> across six districts, working with district health
              officials to implement community interventions. From April to October 2024,
              they trained Health &amp; Wellness Officers, Health Workers, and Medical
              Officers through five sessions of Training of Trainers. In total, <strong>6,468
              CLF members</strong> were trained in <strong>349 sessions</strong>, over <strong>19 months</strong>.
            </p>
            <p className="mt-4">
              Communication materials for community outreach were produced in English,
              Mizo, and Chakma, covering topics like hypertension, diabetes, cervical
              cancer, breast cancer, oral cancer, and later lung, stomach, and
              Oesophagus cancers. Activities included miking, leaflets, posters, and
              community flex.
            </p>
          </div>
        </div>
      </Section>

      {/* Thumbnails row */}
      <Section className="pb-14">
        <ImageGallery
          images={[
            "/images/CI/ci_activities/VHSNC/8a5a1ff7-036e-49f5-a1e2-2ce4ee9dadb0.jpg",
            "/images/CI/ci_activities/VHSNC/Rally2.jpeg",
            "/images/CI/ci_activities/VHSNC/WhatsApp Image 2025-04-02 at 3.17.43 PM (1).jpeg",
          ]}
          gridClassName="grid grid-cols-1 sm:grid-cols-3 gap-6"
		  itemClassNames={[
			"aspect-[3/2]", // large hero spanning two columns
			"aspect-[3/2]",
			"aspect-[3/2]",
		]}
        />
      </Section>
    </div>
  );
}
