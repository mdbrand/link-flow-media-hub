
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

const mediaSites = [
  {
    name: "The LA Note",
    cover: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=800&auto=format&fit=crop&q=60",
    description: "Entertainment media platform with high domain authority and extensive reach.",
    type: "Entertainment"
  },
  {
    name: "Thought Leaders Ethos",
    cover: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=60",
    description: "Premier platform for entrepreneurial thought leadership and business insights.",
    type: "Entrepreneurial"
  },
  {
    name: "MDBRAND",
    cover: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&auto=format&fit=crop&q=60",
    description: "Leading digital marketing publication focused on brand development strategies.",
    type: "Digital Marketing"
  },
  {
    name: "Booked Impact",
    cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=60",
    description: "Platform dedicated to entrepreneurial success stories and business growth.",
    type: "Entrepreneurial"
  },
  {
    name: "Seismic Sports",
    cover: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60",
    description: "Comprehensive sports coverage and analysis platform.",
    type: "Sports"
  },
  {
    name: "New York Post Daily",
    cover: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=60",
    description: "Entertainment and lifestyle news coverage with broad audience reach.",
    type: "Entertainment"
  },
  {
    name: "Authentic Sacrifice",
    cover: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&auto=format&fit=crop&q=60",
    description: "Faith-based platform exploring religious and spiritual topics.",
    type: "Religious"
  },
  {
    name: "Authority Maximizer",
    cover: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=60",
    description: "Resource for entrepreneurs looking to build authority in their niche.",
    type: "Entrepreneurial"
  },
  {
    name: "Live Love Hobby",
    cover: "/lovable-uploads/1ccec23d-4f05-4a22-a4c5-fd34f7fef2a7.png",
    description: "Platform celebrating hobbies, crafting, and DIY pursuits with creative inspiration.",
    type: "Hobby"
  },
  {
    name: "MDB Consultancy",
    cover: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&auto=format&fit=crop&q=60",
    description: "Professional business consultancy insights and expertise.",
    type: "Business Consultancy"
  },
  {
    name: "Trending Consumerism",
    cover: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=60",
    description: "Latest trends and insights in consumer behavior and markets.",
    type: "Consumer"
  },
  {
    name: "HKlub Fitness",
    cover: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60",
    description: "Health and fitness focused content for wellness enthusiasts.",
    type: "Fitness"
  }
];

const MediaSites = () => {
  return (
    <section id="media-sites" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stop Getting Ignored by Publications and Build Instant Credibility</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Command your media strategy with precision-timed placements across premium publications, no expensive agency retainers, no endless email chains, just strategic visibility exactly when your business needs it most.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaSites.map((site) => (
            <Card key={site.name} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-full h-40 relative rounded-t-lg overflow-hidden">
                  <img 
                    src={site.cover} 
                    alt={`${site.name} cover`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl mb-2 text-center">{site.name}</CardTitle>
                <CardDescription className="text-gray-600 text-center mb-4">{site.description}</CardDescription>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="outline" className="text-[#9b87f5]">
                    <Globe className="w-3 h-3 mr-1" />
                    {site.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our network is constantly growing! Get in early to secure priority placement on new premium media sites as they're added to our network.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MediaSites;
