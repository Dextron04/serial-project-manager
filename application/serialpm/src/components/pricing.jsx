import React, { useState } from "react";
import { CheckCircle, Star } from "lucide-react";
import { useTranslation } from 'react-i18next';

const PricingSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const { t } = useTranslation();

  const pricingPlans = [
    {
      id: "starter",
      name: t('pricingStarterName'),
      description: t('pricingStarterDescription'),
      price: 0,
      features: [
        t('pricingStarterFeature1'),
        t('pricingStarterFeature2'),
        t('pricingStarterFeature3'),
        t('pricingStarterFeature4'),
      ],
    },
    {
      id: "professional",
      name: t('pricingProfessionalName'),
      description: t('pricingProfessionalDescription'),
      price: 19,
      popular: true,
      features: [
        t('pricingProfessionalFeature1'),
        t('pricingProfessionalFeature2'),
        t('pricingProfessionalFeature3'),
        t('pricingProfessionalFeature4'),
      ],
    },
    {
      id: "enterprise",
      name: t('pricingEnterpriseName'),
      description: t('pricingEnterpriseDescription'),
      price: 99,
      features: [
        t('pricingEnterpriseFeature1'),
        t('pricingEnterpriseFeature2'),
        t('pricingEnterpriseFeature3'),
        t('pricingEnterpriseFeature4'),
      ],
    },
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-5xl font-bold">{t('pricingSectionTitle')}</h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-300">
          {t('pricingSectionDesc')}
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        {pricingPlans.map((plan, index) => (
          <div
            key={plan.id}
            className={`relative ${plan.popular
              ? "z-10 scale-105 transform bg-gradient-to-b from-blue-900/50 to-purple-900/50"
              : "bg-gray-800/30 hover:scale-105 hover:transform"
              } rounded-lg border p-6 backdrop-blur-md ${plan.popular
                ? "border-blue-500 shadow-lg shadow-blue-500/20"
                : hoveredCard === index
                  ? "border-blue-500 transition-all duration-300"
                  : "border-gray-700 transition-all duration-300"
              }`}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {plan.popular && (
              <div className="mb-4 inline-flex items-center rounded-full bg-blue-500 px-3 py-1 text-sm font-bold text-white">
                <Star className="mr-1 h-3 w-3" /> {t('pricingMostPopular')}
              </div>
            )}
            <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
            <p className="mb-4 text-gray-300">{plan.description}</p>
            <div className="mb-6 text-4xl font-bold">
              ${plan.price}
              <span className="text-xl text-gray-400">/{t('pricingPerMonth')}</span>
            </div>
            <ul className="mb-8 space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle
                    className={`h-5 w-5 ${hoveredCard === index || plan.popular
                      ? "text-blue-400"
                      : "text-blue-400"
                      } mr-2 transition-colors duration-300`}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {plan.id === "professional" ? (
              <button
                className={`w-full rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 font-medium text-white transition-all duration-300 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-95`}
              >
                {t('getStarted')}
              </button>
            ) : plan.id === "enterprise" ? (
              <button className="w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-95">
                <span className="flex items-center justify-center">
                  {t('contactSales')}
                  <svg
                    className="ml-2 h-5 w-5 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </button>
            ) : (
              <button
                className={`w-full ${hoveredCard === index
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-blue-600"
                  } rounded-md px-4 py-3 font-medium text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-95`}
              >
                {t('getStarted')}
              </button>
            )}

            {/* Subtle animation effect on hover */}
            {hoveredCard === index && !plan.popular && (
              <div className="absolute -inset-px animate-pulse rounded-lg bg-blue-500 opacity-5"></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-400">
          {t('pricingTrialNote')}
        </p>
        <div className="mt-4 flex items-center justify-center">
          <div className="mr-6 flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-blue-400" />
            <span className="text-sm">{t('pricingCancelAnytime')}</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-blue-400" />
            <span className="text-sm">{t('pricing247Support')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
