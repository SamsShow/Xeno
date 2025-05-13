import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Mail, Users, MessageSquare } from "lucide-react";

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        to="/campaigns"
        className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
          isActive("/campaigns") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Mail className="mr-2 h-4 w-4" />
        Campaigns
      </Link>
      <Link
        to="/messages"
        className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
          isActive("/messages") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Messages
      </Link>
      <Link
        to="/customers"
        className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
          isActive("/customers") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Users className="mr-2 h-4 w-4" />
        Customers
      </Link>
      <Link
        to="/analytics"
        className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
          isActive("/analytics") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <BarChart3 className="mr-2 h-4 w-4" />
        Analytics
      </Link>
    </nav>
  );
}
