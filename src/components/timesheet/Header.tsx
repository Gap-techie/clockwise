import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, BarChart2, Users, User, LogOut, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/AuthContext";

interface HeaderProps {
  userName?: string;
  userRole?: "employee" | "admin";
  userAvatar?: string;
  onLogout?: () => void;
}

const Header = ({
  userName = "John Doe",
  userRole = "employee",
  userAvatar = "",
  onLogout,
}: HeaderProps) => {
  const isAdmin = userRole === "admin";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      navigate("/login");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <Clock className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold text-primary">ClockWise</h1>
        <span className="text-xs text-gray-500 hidden sm:inline">
          powered by Biteon
        </span>
      </div>

      <nav className="flex-1 flex justify-center">
        <ul className="flex space-x-4 md:space-x-8">
          <li>
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/reports"
              className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors"
            >
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </Link>
          </li>
          {isAdmin && (
            <>
              <li>
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/employees"
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Employees</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{userName}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {userRole}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
