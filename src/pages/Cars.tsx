import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Loader2, Users, Gauge, Fuel } from "lucide-react";

type Car = {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  image_url: string | null;
  status: string;
  seats: number;
  transmission: string;
  fuel_type: string;
};

const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = typeFilter === "all" 
    ? cars 
    : cars.filter(car => car.type === typeFilter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Available Cars</h1>
            <p className="text-muted-foreground">Choose from our premium selection</p>
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No cars available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <Card key={car.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {car.image_url && (
                      <img 
                        src={car.image_url} 
                        alt={car.name}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
                      ${car.price_per_day}/day
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="mb-2">{car.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">
                    {car.brand} {car.model} · {car.year}
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{car.seats} seats</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge className="h-4 w-4" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="h-4 w-4" />
                      <span>{car.fuel_type}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/cars/${car.id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
