
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

const mediaSites = [
  {
    name: "The LA Note",
    logo: "https://via.placeholder.com/100x50?text=LANote",
    description: "Entertainment media platform with high domain authority and extensive reach.",
    type: "Entertainment",
    rating: 39
  },
  {
    name: "Thought Leaders Ethos",
    logo: "https://via.placeholder.com/100x50?text=TLE",
    description: "Premier platform for entrepreneurial thought leadership and business insights.",
    type: "Entrepreneurial",
    rating: 18
  },
  {
    name: "MDBRAND",
    logo: "https://via.placeholder.com/100x50?text=MDBRAND",
    description: "Leading digital marketing publication focused on brand development strategies.",
    type: "Digital Marketing",
    rating: 17
  },
  {
    name: "Booked Impact",
    logo: "https://via.placeholder.com/100x50?text=BookedImpact",
    description: "Platform dedicated to entrepreneurial success stories and business growth.",
    type: "Entrepreneurial",
    rating: 12
  },
  {
    name: "Seismic Sports",
    logo: "https://via.placeholder.com/100x50?text=SeismicSports",
    description: "Comprehensive sports coverage and analysis platform.",
    type: "Sports",
    rating: 11
  },
  {
    name: "New York Post Daily",
    logo: "https://via.placeholder.com/100x50?text=NYPostDaily",
    description: "Entertainment and lifestyle news coverage with broad audience reach.",
    type: "Entertainment",
    rating: 10
  },
  {
    name: "Authentic Sacrifice",
    logo: "https://via.placeholder.com/100x50?text=AuthenticSacrifice",
    description: "Faith-based platform exploring religious and spiritual topics.",
    type: "Religious",
    rating: 9
  },
  {
    name: "Authority Maximizer",
    logo: "https://via.placeholder.com/100x50?text=AuthorityMax",
    description: "Resource for entrepreneurs looking to build authority in their niche.",
    type: "Entrepreneurial",
    rating: 9
  },
  {
    name: "Live Love Hobby",
    logo: "https://via.placeholder.com/100x50?text=LiveLoveHobby",
    description: "Platform celebrating hobbies and recreational pursuits.",
    type: "Hobby",
    rating: 9
  },
  {
    name: "MDB Consultancy",
    logo: "https://via.placeholder.com/100x50?text=MDBConsultancy",
    description: "Professional business consultancy insights and expertise.",
    type: "Business Consultancy",
    rating: 9
  },
  {
    name: "Trending Consumerism",
    logo: "https://via.placeholder.com/100x50?text=TrendingConsumer",
    description: "Latest trends and insights in consumer behavior and markets.",
    type: "Consumer",
    rating: 5
  },
  {
    name: "HKlub Fitness",
    logo: "https://via.placeholder.com/100x50?text=HKlubFitness",
    description: "Health and fitness focused content for wellness enthusiasts.",
    type: "Fitness",
    rating: 3
  }
];

const MediaSites = () => {
  return (
    <section id="media-sites" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Featured on These <span className="text-[#9b87f5]">12 Premium Media Sites</span></h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our network includes the most respected publications across various industries,
            giving your content maximum exposure to your target audience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaSites.map((site) => (
            <Card key={site.name} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="flex items-center justify-center pb-2">
                <img src={site.logo} alt={`${site.name} logo`} className="h-12 object-contain" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl mb-2 text-center">{site.name}</CardTitle>
                <CardDescription className="text-gray-600 text-center mb-4">{site.description}</CardDescription>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="outline" className="text-[#9b87f5]">
                    <Globe className="w-3 h-3 mr-1" />
                    {site.type}
                  </Badge>
                  <Badge variant="secondary">DR {site.rating}</Badge>
                </div>
              </CardContent>
              <CardFooter className="pt-0 justify-center">
                <span className="text-sm text-[#9b87f5] font-medium">Premium Placement</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaSites;
