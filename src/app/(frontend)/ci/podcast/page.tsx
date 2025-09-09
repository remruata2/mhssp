"use client";
import { useState } from "react";
import Image from "next/image";
import Section from "../components/Section";
import PageTitle from "@/components/ui/PageTitle";

const episodes = [
    {
        id: "e1",
        yt: "EBDVNP6aX10",
        title: "Damna Kawl Eng Titi - Episode 1 - Damdawi ei chunchang",
    },
    {
        id: "e2",
        yt: "ISNFoflttTY",
        title: "Damna Kawl Eng Titi - Episode 1 - Ei leh In chungchang",
    },
    {
        id: "e3",
        yt: "hfQNlHbfNHY",
        title: "Damna Kawl Eng Titi - Episode 1 - Zunthlum thisen sang chungchang",
    },
	{
        id: "e4",
        yt: "cALq3nh-b70",
        title: "Damna Kawl Eng Titi - Episode 1 - Chhul hmawr Cancer chungchang",
    },
	{
        id: "e5",
        yt: "sYL99-LHVBA",
        title: "Damna Kawl Eng Titi - Episode 1 - Taksa insawizawi chungchung",
    },
	{
        id: "e6",
        yt: "sYL99-LHVBA",
        title: "Damna Kawl Eng Titi - Episode 1 - Taksa insawizawi chungchung",
    },
	{
        id: "e7",
        yt: "LqzoCtr9Z_Q",
        title: "Damna Kawl Eng Titi - Episode 2 - Zuk leh Hmuam chungchung",
    },
    {
        id: "coming",
        yt: null as unknown as string,
        title: "Coming Soon – New Episode",
    },
];

export default function PodcastPage() {
    const [selected, setSelected] = useState(episodes[0]);
    return (
        <div className="min-h-screen bg-gray-50">
            <PageTitle title="Podcasts" />

            {/* Featured video */}
            <Section className="pt-6 pb-4">
                <div className="rounded-xl overflow-hidden shadow bg-black">
                    <div className="aspect-video w-full">
                        <iframe
                            className="h-full w-full"
                            src={`https://www.youtube.com/embed/${selected.yt}`}
                            title={selected.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                </div>
            </Section>

            <Section className="py-6">
                <div className="flex items-center gap-4 mb-4">
                    <Image
                        src="/images/CI/ci_activities/podcast/damnalogo.png"
                        alt="Damna Kawl Eng Titi"
                        width={150}
                        height={150}
                        className="rounded-md object-cover"
                    />
                    <h2 className="text-xl font-bold text-gray-900">Damna Kawl Eng Titi</h2>
                </div>
                <p className="mt-4 text-gray-700 leading-7 text-[15px]">
				Damna Kawl Eng Titi is an extension of the community intervention's array of communication products. The term Titi in Mizo denotes "Conversations". The endeavour of Community Intervention is to engage the community in meaningful conversations on NCDs, Eating Right, Healthy Living and making their health the priority.
                </p>
				<p className="mt-4 text-gray-700 leading-7 text-[15px]">
				Often times, the complexities of the diseases and the complex terminologies used need to be broken down for easy understanding for community members. The Damna Kawl Eng Titi Podcasts are innovatively designed to explain complex health issues, share research findings, and provide practical advice on disease prevention and management, making the nature of spreading messages in easy every day conversational style.
				</p>
            </Section>

            {/* Episodes */}
            <Section className="pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {episodes.map((ep) => {
                        const isSelected = selected?.id === ep.id;
                        const isComing = !ep.yt;
                        return (
                            <button
                                key={ep.id}
                                type="button"
                                onClick={() => !isComing && setSelected(ep)}
                                disabled={isComing}
                                aria-pressed={isSelected}
                                className={`group text-left rounded-lg border bg-white shadow-sm overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#2B415A] ${
                                    isSelected ? "ring-2 ring-[#2B415A]" : ""
                                } ${isComing ? "opacity-60 cursor-not-allowed" : "hover:shadow-md"}`}
                            >
                                <div className="relative aspect-video bg-gray-100">
                                    {ep.yt ? (
                                        <Image
                                            src={`https://img.youtube.com/vi/${ep.yt}/hqdefault.jpg`}
                                            alt={ep.title}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover transition-transform group-hover:scale-[1.02]"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 grid place-items-center text-gray-500 text-sm">
                                            Coming Soon
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <p className="text-[15px] font-semibold text-gray-900 line-clamp-2">{ep.title}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}
