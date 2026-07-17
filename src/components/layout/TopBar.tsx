import { Bell, Search, User, Menu, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
// import logo from "@/logo.jpg"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTypedSelector } from "@/redux/hooks";

export function TopBar() {
  const { open } = useSidebar();
    const { user } = useTypedSelector((state) => state.auth);
  
  const logout = (redirect = "/login") => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    console.log("✅ Logged out successfully");
    if (redirect) window.location.href = redirect;
  } catch (error) {
    console.error("❌ Logout failed:", error);
  }
};

  return (
    <header className="h-16 bg-card border-b border-border shadow-card px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search student, admission, fees..."
            className="pl-10 bg-muted/50 border-0 focus:bg-background"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
            3
          </Badge>
        </Button>

        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="@admin" />
                <AvatarFallback className="bg-gradient-primary text-white">CFS</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                 {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=> logout()}>
                <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
              
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}