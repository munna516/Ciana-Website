import React from "react";

const partners = [
  {
    name: "Veterans Affairs Coalition",
    type: "Government Agency",
    description:
      "A federal partnership that helps us connect veterans to stable, dignified housing solutions across the country.",
    icon: "🏛️",
  },
  {
    name: "Community First Foundation",
    type: "Non-Profit Organization",
    description:
      "Working together to fund affordable housing projects and wrap-around support services for vulnerable populations.",
    icon: "🤝",
  },
  {
    name: "SeniorCare Alliance",
    type: "Healthcare Partner",
    description:
      "Providing on-site wellness programs and health resources to our senior residents, ensuring holistic care.",
    icon: "❤️",
  },
  {
    name: "HousingFirst Network",
    type: "Advocacy Organization",
    description:
      "Aligned in our belief that stable housing is the foundation of personal well-being and community health.",
    icon: "🏡",
  },
  {
    name: "BuildBetter Corp",
    type: "Construction & Facilities",
    description:
      "Helping us develop and maintain safe, high-quality living environments through sustainable construction.",
    icon: "🏗️",
  },
  {
    name: "Unity Social Services",
    type: "Social Services",
    description:
      "Connecting residents with employment, counseling, and community resources to support long-term stability.",
    icon: "🌐",
  },
];

export default function OurPartners() {
  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero Section — mirrors About Us */}
      <section className="relative w-full h-[260px] sm:h-[320px] md:h-[500px] lg:h-[640px] overflow-hidden">
        <img
          src="/assets/images/partner_border.jpeg"
          alt="Partnership"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
            Our Partners
          </h1>
          <p className="max-w-3xl text-xs sm:text-sm md:text-base lg:text-lg text-gray-100 leading-relaxed">
            At Starlight Path, we believe meaningful change happens through
            collaboration. Our partners share our commitment to compassion,
            community, and creating lasting housing solutions for those who need
            them most.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        {/* Partnership Philosophy */}
        <section>
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="w-full lg:w-1/2 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex-shrink-0">
              <img
                src="/assets/images/partnership.jpeg"
                alt="Partnership values diagram"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                Why Partnership Matters
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                No single organization can address housing insecurity alone.
                That's why Starlight Path actively cultivates partnerships
                creating a network of support that goes far beyond four walls.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Our partnerships are grounded in shared values: trust,
                performance, teamwork, and a commitment to win-win outcomes.
                Together, we design plans that serve residents with dignity and
                build communities where everyone truly belongs.
              </p>
            </div>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="mt-14 sm:mt-16 md:mt-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
            Meet Our Partners
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-3xl">
            We are proud to work alongside these dedicated organizations who
            help us fulfill our mission every single day.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 sm:p-8 flex flex-col"
              >
                <div className="text-4xl mb-4">{partner.icon}</div>
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-full px-3 py-1 mb-3 self-start">
                  {partner.type}
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {partner.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
