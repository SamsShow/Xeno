import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/header";
import "./App.css";
import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  const navigate = useNavigate();

  const handleSaveCampaign = () => {
    navigate("/campaigns");
    toast.success("Campaign created successfully");
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="xeno-ui-theme">
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1">
            <div className="container mx-auto pt-10 pb-8 px-4 md:px-8 max-w-7xl">
              <Outlet />
            </div>
          </main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Xeno CRM. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground">
                Built with Next.js, TypeScript, and Tailwind CSS
              </p>
            </div>
          </footer>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
