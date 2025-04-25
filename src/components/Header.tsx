
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigation = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const section = document.getElementById(sectionId);
      section?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", url: "/" },
    { name: "How it Works", url: "how-it-works" },
    { name: "Pricing", url: "pricing" },
    { name: "Testimonials", url: "testimonials" },
    { name: "FAQ", url: "faq" }
  ];

  return (
    <header className="w-full py-4 px-4 md:px-6 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-[#9b87f5]">MediaBoost</Link>
        </div>
        
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button 
              key={link.name}
              onClick={() => link.url === "/" ? handleNavigation('') : handleNavigation(link.url)}
              className="text-gray-600 hover:text-[#9b87f5] font-medium transition-colors"
            >
              {link.name}
            </button>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/submissions">
                <Button variant="outline" className="hover:bg-[#9b87f5] hover:text-white">
                  My Submissions
                </Button>
              </Link>
              <Button 
                onClick={signOut}
                variant="ghost"
                className="text-gray-600 hover:text-[#9b87f5]"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="ghost" className="text-gray-600 hover:text-[#9b87f5]">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Button 
                onClick={() => handleNavigation('pricing')}
                className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
              >
                Start Here
              </Button>
            </>
          )}
        </div>
        
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-md md:hidden p-4 z-50">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => link.url === "/" ? handleNavigation('') : handleNavigation(link.url)}
                  className="text-gray-600 hover:text-[#9b87f5] font-medium transition-colors text-left"
                >
                  {link.name}
                </button>
              ))}
              {user ? (
                <>
                  <Link 
                    to="/submissions" 
                    className="text-gray-600 hover:text-[#9b87f5] font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Submissions
                  </Link>
                  <Button 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className="justify-start p-0 h-auto text-gray-600 hover:text-[#9b87f5] font-medium transition-colors"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    to="/signin"
                    className="text-gray-600 hover:text-[#9b87f5] font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Button 
                    onClick={() => {
                      handleNavigation('pricing');
                      setIsMenuOpen(false);
                    }}
                    className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white w-full"
                  >
                    Start Here
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
