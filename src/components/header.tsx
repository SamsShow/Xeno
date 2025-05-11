import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ThemeToggle } from "./ui/theme-toggle";
import { User as UserIcon } from "lucide-react";

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        <div className="flex items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text mr-8">
            Xeno CRM
          </h1>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a
              href="#"
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              Campaigns
            </a>
            <a
              href="#"
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              Customers
            </a>
            <a
              href="#"
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              Analytics
            </a>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 border border-border shadow-sm focus:ring-2 focus:ring-blue-400"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || "Profile"}
                    className="h-9 w-9 rounded-full object-cover border border-border shadow-sm"
                  />
                ) : user.name ? (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white border border-border shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border shadow-sm">
                    <UserIcon className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center">
                <span>{user.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {user.email}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
