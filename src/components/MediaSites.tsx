
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const mediaSites = [
  {
    name: "TechCrunch",
    logo: "https://via.placeholder.com/100x50?text=TechCrunch",
    description: "Leading technology media property dedicated to obsessively profiling startups, reviewing new products, and breaking tech news."
  },
  {
    name: "Forbes",
    logo: "https://via.placeholder.com/100x50?text=Forbes",
    description: "Global media company focusing on business, investing, technology, entrepreneurship, leadership, and lifestyle."
  },
  {
    name: "Entrepreneur",
    logo: "https://via.placeholder.com/100x50?text=Entrepreneur",
    description: "Premier source for entrepreneurs seeking information about business opportunities and entrepreneurial lifestyle."
  },
  {
    name: "Inc.",
    logo: "https://via.placeholder.com/100x50?text=Inc",
    description: "Publication focused on growing companies, entrepreneurship, and business strategies for small business owners."
  },
  {
    name: "Business Insider",
    logo: "https://via.placeholder.com/100x50?text=BusinessInsider",
    description: "Fast-growing business site with deep financial, media, tech, and other industry verticals."
  },
  {
    name: "Mashable",
    logo: "https://via.placeholder.com/100x50?text=Mashable",
    description: "Global, multi-platform media and entertainment company focused on technology, digital culture and entertainment."
  },
  {
    name: "Fast Company",
    logo: "https://via.placeholder.com/100x50?text=FastCompany",
    description: "Leading progressive business media brand with a unique editorial focus on innovation, leadership, and design."
  },
  {
    name: "Venture Beat",
    logo: "https://via.placeholder.com/100x50?text=VentureBeat",
    description: "Leading source for news, events, groundbreaking research, and perspective on technology innovation."
  },
  {
    name: "Wired",
    logo: "https://via.placeholder.com/100x50?text=Wired",
    description: "Monthly American magazine that reports on how emerging technologies affect culture, economy, and politics."
  },
  {
    name: "Bloomberg",
    logo: "https://via.placeholder.com/100x50?text=Bloomberg",
    description: "Financial, software, data, and media company that delivers business and markets news, data, analysis."
  },
  {
    name: "Wall Street Journal",
    logo: "https://via.placeholder.com/100x50?text=WSJ",
    description: "Business-focused, international daily newspaper based in New York City with global influence and coverage."
  },
  {
    name: "HuffPost",
    logo: "https://via.placeholder.com/100x50?text=HuffPost",
    description: "American news aggregator and blog, with localized and international editions offering news, satire, blogs, and original content."
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
                <CardDescription className="text-gray-600 text-center">{site.description}</CardDescription>
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
