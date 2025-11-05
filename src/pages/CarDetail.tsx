import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Users, Gauge, Fuel, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Car = {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  image_url: string | null;
  seats: number;
  transmission: string;
  fuel_type: string;
  description: string | null;
  features: string[] | null;
};

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (id) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setCar(data);
    } catch (error) {
      console.error("Error fetching car:", error);
      toast.error("Failed to load car details");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!startDate || !endDate || !car) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * car.price_per_day;
  };

  const handleBooking = async () => {
    if (!session) {
      toast.error("Please sign in to book a car");
      navigate("/auth");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (startDate >= endDate) {
      toast.error("End date must be after start date");
      return;
    }

    setBooking(true);

    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: session.user.id,
        car_id: id,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        total_price: calculateTotal(),
        status: "pending",
      });

      if (error) throw error;

      toast.success("Booking created successfully!");
      navigate("/bookings");
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error(error.message || "Failed to create booking");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Car not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
              {car.image_url && (
                <img 
                  src={car.image_url} 
                  alt={car.name}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-2">{car.name}</h1>
            <p className="text-xl text-muted-foreground mb-6">
              {car.brand} {car.model} · {car.year}
            </p>

            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <span>{car.seats} seats</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-accent" />
                <span>{car.transmission}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-accent" />
                <span>{car.fuel_type}</span>
              </div>
            </div>

            {car.description && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-3">Description</h2>
                <p className="text-muted-foreground">{car.description}</p>
              </div>
            )}

            {car.features && car.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-3">Features</h2>
                <ul className="grid grid-cols-2 gap-2">
                  {car.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <p className="text-3xl font-bold mb-1">
                    ${car.price_per_day}
                    <span className="text-base font-normal text-muted-foreground">/day</span>
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => !startDate || date <= startDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {startDate && endDate && (
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>
                        ${car.price_per_day} × {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                      <span>${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-accent">${calculateTotal()}</span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBooking} 
                  disabled={booking || !startDate || !endDate}
                  className="w-full"
                  size="lg"
                >
                  {booking ? "Booking..." : "Book Now"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
