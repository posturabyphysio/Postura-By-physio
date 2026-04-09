"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, MessageCircle, ArrowUpRight } from "lucide-react";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";
import { FadeIn } from "../ui/FadeIn";

type ContactBookingSectionProps = {
  className?: string;
};

const WHATSAPP_PHONE = "916354011290";

export function ContactBookingSection({ className }: ContactBookingSectionProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const whatsappHref = useMemo(() => {
    const lines = [
      "Hi! I’d like to book an appointment.",
      "",
      fullName ? `Name: ${fullName}` : null,
      phone ? `Phone: ${phone}` : null,
      email ? `Email: ${email}` : null,
      service ? `Service: ${service}` : null,
      address ? `Address: ${address}` : null,
      message ? `Message: ${message}` : null,
    ].filter(Boolean) as string[];

    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [address, email, fullName, message, phone, service]);

  return (
    <section className={`relative bg-white md:py-20 py-10 ${className ?? ""}`}>
      <div className="mx-auto md:w-[90vw] max-w-7xl">
        <div className="p-6 md:p-10">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            {/* Left: Form */}
            <FadeIn direction="up" duration={800} distance={30} delay={0}>
              <div className="rounded-tl-[48px] rounded-br-[48px] rounded-tr-[18px] rounded-bl-[18px] bg-[#FaFaFa] md:p-8 p-6">
                <FadeIn direction="up" duration={800} distance={22} delay={120}>
                  <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                    Book your assessment today.
                  </h2>
                </FadeIn>
                <FadeIn direction="up" duration={800} distance={22} delay={220}>
                  <p className="mt-2 text-sm text-gray-500">
                    Move better. Recover stronger. Stay pain-free.
                  </p>
                </FadeIn>

                <FadeIn direction="up" duration={800} distance={22} delay={320}>
                  <form
                    className="mt-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      window.open(whatsappHref, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-1">
                        <label className="text-xs font-semibold text-gray-600">Full Name</label>
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter full name"
                          className="mt-2 h-11 w-full rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-secondary"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-xs font-semibold text-gray-600">Phone no.</label>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          inputMode="tel"
                          placeholder="Enter phone no."
                          className="mt-2 h-11 w-full rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-secondary"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-xs font-semibold text-gray-600">Email</label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          inputMode="email"
                          placeholder="Enter email"
                          className="mt-2 h-11 w-full rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-secondary"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-xs font-semibold text-gray-600">Service</label>
                        <select
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          className="mt-2 h-11 w-full appearance-none rounded-full border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-800 outline-none transition focus:border-secondary"
                        >
                          <option value="">Select Service</option>
                          <option value="Physiotherapy">Physiotherapy</option>
                          <option value="Yoga">Yoga</option>
                          <option value="Pilates">Pilates</option>
                          <option value="Aerobics">Aerobics</option>
                          <option value="Online Consultation">Online Consultation</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-gray-600">Address</label>
                        <input
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Select pain area"
                          className="mt-2 h-11 w-full rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-secondary"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-gray-600">Message</label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Enter your message."
                          rows={4}
                          className="mt-2 w-full resize-none rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-secondary"
                        />
                      </div>
                    </div>

                    <div className=" flex justify-end">
                      <PrimaryCTAButton
                        href="https://wa.me/916354011290"
                        label="Book Appointment"
                        size="sm"
                        className="mt-10"
                      />
                    </div>
                  </form>
                </FadeIn>
              </div>
            </FadeIn>

            {/* Right: Info */}
            <FadeIn direction="up" duration={800} distance={30} delay={150}>
              <div className="md:pl-2 text-center md:text-left">
                <FadeIn direction="up" duration={800} distance={22} delay={260}>
                  <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
                    Pain shouldn’t be your routine.
                  </h3>
                </FadeIn>
                <FadeIn direction="up" duration={800} distance={22} delay={360}>
                  <p className="mt-2 text-sm text-gray-500">
                    At Postura by Physio, we deliver expert physiotherapy at your doorstep in
                    Vadodara — or guide you online, wherever you are.
                  </p>
                </FadeIn>

                <FadeIn direction="up" duration={800} distance={22} delay={460}>
                  <div className="mt-6 space-y-5">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Phone no.</p>
                      <a
                        className="mt-2 block text-base font-semibold text-gray-900 md:text-lg"
                        href="tel:+916354011290"
                      >
                        +91 6354011290
                      </a>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500">Email</p>
                      <a
                        className="mt-2 block text-base font-semibold text-gray-900 md:text-lg"
                        href="mailto:posturabyphysio@gmail.com"
                      >
                        posturabyphysio@gmail.com
                      </a>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500">Location</p>
                      <p className="mt-2 text-base font-semibold text-gray-900 md:text-lg">
                        Vadodara, Gujarat
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500">Website</p>
                      <Link
                        className="mt-2 inline-block text-base font-semibold text-primary underline-offset-2 hover:underline md:text-lg"
                        href="https://posturabyphysio.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        posturabyphysio.com
                      </Link>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn direction="up" duration={800} distance={22} delay={580}>
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <p className="text-xs font-medium text-gray-500">Social Media</p>
                    <div className="mt-4 flex items-center justify-center md:justify-start gap-3">
                      <a
                        href="https://www.instagram.com/postura_by_physio?igsh=MTk0NGNyZ3htY3U1Zg=="
                        className="grid h-10 w-10 place-items-center rounded-full border border-primary text-primary transition hover:border-primary hover:bg-primary hover:text-white"
                        aria-label="Instagram"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                      <a
                        href="#"
                        className="grid h-10 w-10 place-items-center rounded-full border border-primary text-primary transition hover:border-primary hover:bg-primary hover:text-white"
                        aria-label="Facebook"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/dr-priyanshi-pandya-pt-b91133217?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                        className="grid h-10 w-10 place-items-center rounded-full border border-primary text-primary transition hover:border-primary hover:bg-primary hover:text-white"
                        aria-label="LinkedIn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                      <a
                        href={`https://wa.me/${WHATSAPP_PHONE}`}
                        className="grid h-10 w-10 place-items-center rounded-full border border-primary text-primary transition hover:border-primary hover:bg-primary hover:text-white"
                        aria-label="WhatsApp"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

