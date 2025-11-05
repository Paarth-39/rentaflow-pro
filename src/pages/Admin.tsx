import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cars, setCars] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!data) {
      toast.error("Access denied: Admin only");
      navigate("/");
      return;
    }

    setIsAdmin(true);
    fetchCars();
    fetchBookings();
    setLoading(false);
  };

  const fetchCars = async () => {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch cars");
      return;
    }
    setCars(data || []);
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        cars(name, brand, model),
        profiles(full_name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch bookings");
      return;
    }
    setBookings(data || []);
  };

  const handleAddCar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from("cars").insert({
      name: formData.get("name") as string,
      type: formData.get("type") as any,
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      year: parseInt(formData.get("year") as string),
      price_per_day: parseFloat(formData.get("price_per_day") as string),
      image_url: formData.get("image_url") as string,
      seats: parseInt(formData.get("seats") as string),
      transmission: formData.get("transmission") as string,
      fuel_type: formData.get("fuel_type") as string,
      description: formData.get("description") as string,
      status: "available" as const,
    });

    if (error) {
      toast.error("Failed to add car");
      return;
    }

    toast.success("Car added successfully");
    e.currentTarget.reset();
    fetchCars();
  };

  const handleDeleteCar = async (id: string) => {
    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete car");
      return;
    }

    toast.success("Car deleted successfully");
    fetchCars();
  };

  const updateBookingStatus = async (id: string, status: "pending" | "confirmed" | "active" | "completed" | "cancelled") => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update booking");
      return;
    }

    toast.success("Booking updated successfully");
    fetchBookings();
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

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="cars">
          <TabsList>
            <TabsTrigger value="cars">Manage Cars</TabsTrigger>
            <TabsTrigger value="bookings">Manage Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="cars" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Car</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCar} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" name="brand" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" name="model" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" name="year" type="number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_per_day">Price per Day</Label>
                    <Input id="price_per_day" name="price_per_day" type="number" step="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seats">Seats</Label>
                    <Input id="seats" name="seats" type="number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Input id="transmission" name="transmission" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuel_type">Fuel Type</Label>
                    <Input id="fuel_type" name="fuel_type" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input id="image_url" name="image_url" type="url" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit">Add Car</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Cars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cars.map((car) => (
                    <div key={car.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{car.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {car.brand} {car.model} · {car.year} · ${car.price_per_day}/day
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteCar(car.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{booking.cars?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Customer: {booking.profiles?.full_name || "N/A"}
                          </p>
                        </div>
                        <Badge>{booking.status}</Badge>
                      </div>
                      <div className="grid md:grid-cols-4 gap-2 text-sm mb-2">
                        <div>
                          <span className="text-muted-foreground">Start:</span>{" "}
                          {format(new Date(booking.start_date), "MMM dd, yyyy")}
                        </div>
                        <div>
                          <span className="text-muted-foreground">End:</span>{" "}
                          {format(new Date(booking.end_date), "MMM dd, yyyy")}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total:</span> ${booking.total_price}
                        </div>
                      </div>
                      <Select
                        value={booking.status || undefined}
                        onValueChange={(value) => updateBookingStatus(booking.id, value as "pending" | "confirmed" | "active" | "completed" | "cancelled")}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
