import { useState } from "react";
import { CampaignList } from "./components/campaign-list";
import { CreateCampaign } from "./components/create-campaign";
import { Toaster, toast } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/protected-route";
import { Header } from "./components/header";
import "./App.css";
import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  const [view, setView] = useState<"list" | "create">("list");

  const handleSaveCampaign = () => {
    setView("list");
    // Show success toast notification
    toast.success("Campaign created successfully");
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="xeno-ui-theme">
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1">
            <div className="container mx-auto pt-10 pb-8 px-4 md:px-8 max-w-7xl">
              <ProtectedRoute>
                {view === "list" ? (
                  <CampaignList onCreateNew={() => setView("create")} />
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold tracking-tight">
                        Create Campaign
                      </h2>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
                      <CreateCampaign
                        onSave={handleSaveCampaign}
                        onCancel={() => setView("list")}
                      />
                    </div>
                  </div>
                )}
              </ProtectedRoute>
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
