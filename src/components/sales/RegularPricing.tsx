
import React from 'react';

const pricingPlans = [
  {name: "Starter", price: "$297", sites: "3"},
  {name: "Growth", price: "$497", sites: "6"},
  {name: "Enterprise", price: "$997", sites: "ALL"}
];

const RegularPricing = () => {
  return (
    <section className="mb-12 bg-gray-50 p-8 rounded-xl">
      <h2 className="text-3xl font-bold mb-6">Regular Pricing Options</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {pricingPlans.map((plan, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold text-gray-700 mb-2">{plan.price}</p>
            <p className="text-gray-600">{plan.sites} media sites</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RegularPricing;
