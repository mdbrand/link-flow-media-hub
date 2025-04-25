
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const EliteContributorSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-400">
            Want to Be Recognized as a bonafide Thought Leader?
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Start publishing under your own byline on a premium media network.
          </p>
        </div>

        <div className="mb-12 text-lg text-slate-300 max-w-4xl mx-auto">
          <p className="mb-8">
            Becoming a published contributor is one of the fastest ways to elevate your brand authority, 
            earn trust, and create real influence in your industry. And with our Media Boost Elite Contributor 
            program, you can do it at scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              title: "Unlimited Publishing for a Full Year",
              description: "For just $3,997/year, you'll unlock unlimited article submissions on any website in our growing network, with your name and byline front and center."
            },
            {
              title: "100% Contributor Control",
              description: "Write about your brand. Promote your clients. Position yourself (or your agency) as the go-to expert in your space, all with content that stays live and searchable."
            },
            {
              title: "Lifetime Value, Long-Term Authority",
              description: "Your articles won't just reach your audience once, they'll show up in Google, on professional profiles, and in pitch decks for months or years to come."
            },
            {
              title: "Includes Future Sites We Launch",
              description: "Your membership automatically includes access to any new websites we add to the network. No extra cost. Just more exposure."
            },
            {
              title: "Add Bylines for Your Clients or Team",
              description: "Want to publish under multiple names? As an Elite Contributor, you can add extra bylines for just $497 each, perfect for agencies, ghostwriters, or PR teams who manage multiple voices."
            },
            {
              title: "Rapidly Increase Your Rankings",
              description: "Boost your domain authority and search engine visibility through strategic, high-quality content placements across our premium media network. Get noticed by top-tier publications and watch your online influence soar."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Check className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-amber-200">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => window.open('https://cal.com/rpene/30min', '_blank', 'noopener,noreferrer')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all"
          >
            Book A Call With Rob
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EliteContributorSection;
