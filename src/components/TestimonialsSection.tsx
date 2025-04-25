
import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah J.",
    role: "Marketing Director",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    text: "MediaBoost helped us get featured on sites we never thought possible. Our company's credibility soared, and we saw a 40% increase in business inquiries within just two weeks of publication."
  },
  {
    name: "David C.",
    role: "CEO",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    text: "The AI technology they use is truly remarkable. One article we submitted was adapted perfectly for each publication, making it feel native to each site. The results exceeded our expectations."
  },
  {
    name: "Maria R.",
    role: "Founder",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    text: "As a small business owner, I was skeptical about the investment, but MediaBoost delivered real results. Being featured across multiple respected publications gave us the credibility boost we needed."
  },
  {
    name: "James W.",
    role: "Sales Director",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    text: "The process was seamless from start to finish. Their team kept us updated at every stage, and the quality of the adapted content was outstanding. We'll definitely be using their services again."
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our <span className="text-[#9b87f5]">Customers</span> Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from businesses who have transformed their online presence with our media placement service
          </p>
        </div>
        
        <div className="mt-12">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="italic mb-6 text-gray-700">{testimonial.text}</p>
                      <div className="flex items-center">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="h-12 w-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h4 className="font-bold">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
