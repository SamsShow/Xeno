import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Plus, MoreVertical, Search } from "lucide-react";
import { Campaign } from "../types/campaign";
import { campaignService } from "../services/campaignService";
import { CommunicationLogView } from "../components/communication-log";
import { CampaignInsightsPanel } from "./campaign-insights";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface CampaignListProps {
  onCreateNew: () => void;
}

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "sent" },
  { label: "Draft", value: "draft" },
];

function getStatusColorClass(status: Campaign["status"]) {
  switch (status) {
    case "sent":
      return "bg-green-100 text-green-800";
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "draft":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export const CampaignList: React.FC<CampaignListProps> = ({ onCreateNew }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [insights, setInsights] = useState<any | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const fetchedCampaigns = await campaignService.getCampaigns();
        setCampaigns(fetchedCampaigns);
      } catch (err) {
        setError("Failed to load campaigns");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleCampaignClick = async (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    if (campaign.status === "sent") {
      setLoadingInsights(true);
      try {
        const campaignInsights = await campaignService.getInsights(campaign.id);
        setInsights(campaignInsights);
      } catch (error) {
        console.error("Error loading insights:", error);
      } finally {
        setLoadingInsights(false);
      }
    } else {
      setInsights(null);
    }
  };

  const handleBackClick = () => {
    setSelectedCampaign(null);
    setInsights(null);
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" ? true : c.status === status;
    return matchesSearch && matchesStatus;
  });

  // --- UI States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }
  if (selectedCampaign) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackClick}
            className="mr-2 p-2 rounded-full hover:bg-muted focus:outline-none focus:ring"
            aria-label="Back to campaigns"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">{selectedCampaign.name}</h1>
          <span
            className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColorClass(
              selectedCampaign.status
            )}`}
          >
            {selectedCampaign.status}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {selectedCampaign.description && (
              <div className="bg-card p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </h3>
                <p>{selectedCampaign.description}</p>
              </div>
            )}
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Stats
              </h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedCampaign.stats?.sent || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Sent</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedCampaign.stats?.delivered || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {selectedCampaign.stats?.failed || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {selectedCampaign.stats?.pending || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
            <div>
              <CommunicationLogView campaignId={selectedCampaign.id} />
            </div>
          </div>
          <div className="space-y-6">
            {selectedCampaign.status === "sent" && (
              <div>
                {loadingInsights ? (
                  <div className="bg-card p-6 rounded-lg shadow flex justify-center items-center h-64">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
                      <p className="text-muted-foreground">
                        Generating AI insights...
                      </p>
                    </div>
                  </div>
                ) : insights ? (
                  <CampaignInsightsPanel
                    campaignName={selectedCampaign.name}
                    objective={
                      selectedCampaign.objective || "Marketing campaign"
                    }
                    audienceSize={selectedCampaign.audienceSize}
                    messagesSent={selectedCampaign.stats?.sent || 0}
                    messagesDelivered={selectedCampaign.stats?.delivered || 0}
                    audienceSegments={{
                      "High-value customers": {
                        count: Math.floor(
                          (selectedCampaign.stats?.sent || 0) * 0.25
                        ),
                        delivered: Math.floor(
                          (selectedCampaign.stats?.delivered || 0) * 0.3
                        ),
                      },
                      "New customers": {
                        count: Math.floor(
                          (selectedCampaign.stats?.sent || 0) * 0.4
                        ),
                        delivered: Math.floor(
                          (selectedCampaign.stats?.delivered || 0) * 0.35
                        ),
                      },
                      "Inactive users": {
                        count: Math.floor(
                          (selectedCampaign.stats?.sent || 0) * 0.35
                        ),
                        delivered: Math.floor(
                          (selectedCampaign.stats?.delivered || 0) * 0.35
                        ),
                      },
                    }}
                  />
                ) : (
                  <div className="bg-card p-6 rounded-lg shadow flex justify-center items-center h-64">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-3">
                        No insights available yet.
                      </p>
                      <Button
                        onClick={() => handleCampaignClick(selectedCampaign)}
                        variant="outline"
                      >
                        Generate Insights
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
        <Button onClick={() => navigate("/campaigns/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-stretch md:items-center w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="absolute left-3 top-2.5 text-muted-foreground">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 w-full rounded-md border bg-background text-foreground focus:outline-none focus:ring focus:border-blue-400 text-sm"
              aria-label="Search campaigns"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
            aria-label="Filter by status"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {filteredCampaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-card rounded-lg shadow">
          <img
            src="/empty-state.svg"
            alt="No campaigns"
            className="w-32 h-32 mb-4 opacity-80"
          />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No campaigns found
          </h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filters, or create a new campaign.
          </p>
          <Button onClick={onCreateNew} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-card rounded-lg shadow hover:shadow-lg transition-shadow p-5 cursor-pointer group border border-border relative focus-within:ring"
              tabIndex={0}
              onClick={() => handleCampaignClick(campaign)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCampaignClick(campaign);
              }}
              aria-label={`View details for ${campaign.name}`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-foreground truncate">
                    {campaign.name}
                  </h3>
                  {campaign.description && (
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColorClass(
                    campaign.status
                  )}`}
                >
                  {campaign.status}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 ml-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                      aria-label="Campaign actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation(); /* TODO: Implement edit */
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation(); /* TODO: Implement duplicate */
                      }}
                    >
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation(); /* TODO: Implement delete */
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center mt-4 text-sm text-muted-foreground gap-6">
                <div className="flex items-center">
                  <span className="font-medium mr-1">
                    {campaign.audienceSize}
                  </span>
                  recipients
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-1">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
