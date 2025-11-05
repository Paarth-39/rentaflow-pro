import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, Shield, Clock, DollarSign } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import heroCarImage from "@/assets/hero-car.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroCarImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Drive Your Dreams Today
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Premium car rental service with the best vehicles at unbeatable prices
          </p>
          <Link to="/cars">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300"
            >
              Browse Our Fleet
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose DriveHub?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
              <p className="text-muted-foreground">
                Choose from luxury sedans, SUVs, sports cars, and electric vehicles
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="text-muted-foreground">
                Competitive rates with no hidden fees or surprises
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Round-the-clock customer service for your peace of mind
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fully Insured</h3>
              <p className="text-muted-foreground">
                All vehicles come with comprehensive insurance coverage
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Hit the Road?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book your perfect car today and experience premium service
          </p>
          <Link to="/cars">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
