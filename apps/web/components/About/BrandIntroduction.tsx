import Image from "next/image";
import { FadeIn } from "../ui/FadeIn";

export function BrandIntroduction() {
    return (
        <section id="brand-introduction" className="bg-white">
            <div className="mx-auto max-w-[90vw] md:px-4 py-16 md:py-20">
                <div className="grid md:gap-10 gap-5 md:grid-cols-[1fr,1.15fr] md:items-end text-center md:text-left">
                    <FadeIn direction="up" distance={32} duration={800} delay={0}>
                        <div className="text-center md:text-left">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 justify-center md:justify-start">
                                <Image src="/sparkle.svg" alt="" width={16} height={16} className="h-4 w-4" />
                                <span className="text-primary">Brand Introduction</span>
                            </div>
                            <h2 className="mt-3 md:text-5xl text-3xl font-bold tracking-tight text-gray-900">
                                Professional Care for Stronger Movement
                            </h2>
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={120} className="md:justify-self-end">
                        <p className="max-w-2xl text-sm leading-6 text-gray-500 md:mt-2">
                            Under the direction of <span className="font-bold text-black">Dr. Priyanshi Pandya (PT)</span>, Postura by Physio provides professional physiotherapy and fitness care with an emphasis on posture correction, movement improvement, and long-term wellness.
                        </p>
                    </FadeIn>
                </div>

                <div className="md:mt-16 mt-10 grid gap-8 md:grid-cols-3 md:items-end text-center md:text-left">
                    <FadeIn direction="up" delay={160}>
                        <div className="flex h-full flex-col justify-between gap-10 md:pr-6">
                            <p className="max-w-md text-sm leading-6 text-gray-500">
                                We offer personalized care for orthopedic, neurological, geriatric, women&apos;s health,
                                and lifestyle-related conditions. Our treatment approach combines evidence-based
                                physiotherapy with guided fitness programs to ensure safe recovery and sustainable
                                health improvement.
                            </p>

                            <p className="max-w-md text-lg font-semibold leading-7 text-primary">
                                At Postura, our goal is simple &mdash; help you move better, feel stronger, and live a
                                healthier life.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={220} className="md:col-span-1">
                        <div className="relative overflow-hidden rounded-tl-[60px] rounded-br-[60px] rounded-bl-xl rounded-tr-xl ring-1 ring-black/5">
                            <div className="aspect-[16/10] w-full md:aspect-[15/10]">
                                <Image
                                    src="/bi-1.jpg"
                                    alt="Physiotherapy session"
                                    fill
                                    priority={false}
                                    sizes="(min-width: 768px) 33vw, 90vw"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={280} className="md:justify-self-end">
                        <div className="relative overflow-hidden rounded-tl-[60px] rounded-br-[60px] rounded-bl-xl rounded-tr-xl ring-1 ring-black/5">
                            <div className="aspect-[4/5] w-full md:w-[360px] lg:w-[400px]">
                                <Image
                                    src="/bi-2.jpg"
                                    alt="Posture correction session"
                                    fill
                                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 30vw, 90vw"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
