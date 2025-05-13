import React, { useState, useEffect } from "react";
import { SendMessage } from "../components/send-message";
import apiClient from "../lib/api-client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";
import { Loader2, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

interface Communication {
  id: string;
  type: string;
  status: string;
  content: string;
  subject?: string;
  sentAt: string;
  deliveredAt?: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
}

export const MessagesPage: React.FC = () => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchCommunications = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/communications");
        setCommunications(response.data.data);
        setError("");
      } catch (err) {
        console.error("Error fetching communications:", err);
        setError("Failed to load communications");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunications();

    // Set up polling every 5 seconds to refresh the data
    const intervalId = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [refreshKey]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "opened":
        return "bg-purple-100 text-purple-800";
      case "clicked":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredCommunications = communications.filter((communication) => {
    const searchLower = search.toLowerCase();
    return (
      communication.customer?.name?.toLowerCase().includes(searchLower) ||
      communication.customer?.email?.toLowerCase().includes(searchLower) ||
      communication.content.toLowerCase().includes(searchLower) ||
      communication.subject?.toLowerCase().includes(searchLower) ||
      communication.status.toLowerCase().includes(searchLower)
    );
  });

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Message Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <SendMessage />
        </div>
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Delivery Status</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>

            <div className="flex items-center mb-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search messages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
                {error}
              </div>
            )}

            {loading && !communications.length ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : filteredCommunications.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent At</TableHead>
                      <TableHead>Delivered At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCommunications.map((comm) => (
                      <TableRow key={comm.id}>
                        <TableCell>
                          <div className="font-medium">
                            {comm.customer?.name || "Unknown"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {comm.customer?.email || "No email"}
                          </div>
                        </TableCell>
                        <TableCell className="uppercase text-xs">
                          {comm.type}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(
                              comm.status
                            )}`}
                          >
                            {comm.status}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(comm.sentAt)}</TableCell>
                        <TableCell>
                          {formatDate(comm.deliveredAt || "")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No messages found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
