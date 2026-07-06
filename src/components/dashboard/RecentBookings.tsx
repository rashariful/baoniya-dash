import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Hotel, Calendar, User } from "lucide-react";

const recentBookings = [
  {
    id: "BK001",
    customer: "John Smith",
    email: "john.smith@email.com",
    type: "tour",
    title: "Bali Adventure Tour",
    date: "2024-01-15",
    amount: "$1,250",
    status: "confirmed",
    avatar: "/avatars/john.png"
  },
  {
    id: "BK002",
    customer: "Sarah Johnson",
    email: "sarah.j@email.com",
    type: "hotel",
    title: "Ocean View Resort",
    date: "2024-01-16",
    amount: "$890",
    status: "pending",
    avatar: "/avatars/sarah.png"
  },
  {
    id: "BK003",
    customer: "Mike Chen",
    email: "mike.chen@email.com",
    type: "tour",
    title: "Tokyo City Experience",
    date: "2024-01-17",
    amount: "$2,100",
    status: "confirmed",
    avatar: "/avatars/mike.png"
  },
  {
    id: "BK004",
    customer: "Emma Wilson",
    email: "emma.w@email.com",
    type: "hotel",
    title: "Mountain Lodge Retreat",
    date: "2024-01-18",
    amount: "$650",
    status: "cancelled",
    avatar: "/avatars/emma.png"
  }
];

export function RecentBookings() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success text-success-foreground">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "tour" ? (
      <MapPin className="w-4 h-4 text-primary" />
    ) : (
      <Hotel className="w-4 h-4 text-secondary-foreground" />
    );
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span>Recent Bookings</span>
        </CardTitle>
        <CardDescription>Latest booking activities and transactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentBookings.map((booking) => (
          <div key={booking.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={booking.avatar} alt={booking.customer} />
                <AvatarFallback className="bg-gradient-secondary">
                  {booking.customer.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-foreground">{booking.customer}</p>
                  {getTypeIcon(booking.type)}
                </div>
                <p className="text-sm text-muted-foreground">{booking.title}</p>
                <p className="text-xs text-muted-foreground">{booking.email}</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm font-bold text-foreground">{booking.amount}</p>
              <p className="text-xs text-muted-foreground">{booking.date}</p>
              {getStatusBadge(booking.status)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}