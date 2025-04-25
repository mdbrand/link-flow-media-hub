
import React from 'react';

const testimonials = [
  {
    quote: "I was skeptical at first - really skeptical. But then I saw our company featured on sites we had been trying to get into for months. Our credibility skyrocketed, and business inquiries jumped 40% in just two weeks.",
    author: "Sarah J.",
    role: "Marketing Director"
  },
  {
    quote: "Their AI technology is unlike anything I've encountered. Our article was transformed perfectly for each publication, making it feel native to each site while maintaining our core message. My expectations weren't just met - they were shattered.",
    author: "David C.",
    role: "CEO"
  },
  {
    quote: "This investment delivered real results. The credibility boost from being featured across respected publications was exactly what our business needed to stand out.",
    author: "Maria R.",
    role: "Small Business Owner"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">The Proof Is In The Placements</h2>
      <div className="space-y-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
            <p className="font-bold">{testimonial.author}</p>
            <p className="text-sm text-gray-600">{testimonial.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
