import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { RuleGroup } from "./rule-group";
import { AudiencePreview } from "./audience-preview";
import { RuleGroup as RuleGroupType, LogicalOperator } from "../types/campaign";
import { generateId } from "../lib/utils";
import { campaignService } from "../services/campaignService";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { MessageSuggestions } from "./message-suggestions";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState<RuleGroupType>({
    id: generateId(),
    operator: "AND" as LogicalOperator,
    conditions: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [audienceSize, setAudienceSize] = useState(100);
  const [messageText, setMessageText] = useState("");
  const [objective, setObjective] = useState("");
  const [audienceDetails, setAudienceDetails] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [channel, setChannel] = useState("email");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Campaign name is required";
    if (rules.conditions.length === 0)
      newErrors.rules = "At least one condition is required";
    if (!messageText.trim()) newErrors.messageText = "Message text is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const newCampaign = await campaignService.createCampaign(
        name,
        description,
        rules,
        channel,
        messageText
      );
      await campaignService.deliverCampaign(newCampaign.id);
      toast.success("Campaign created and delivery initiated");
      setIsSubmitting(false);
      navigate("/campaigns");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
      setIsSubmitting(false);
    }
  };

  const handleSelectMessage = (message: string) => {
    setMessageText(message);
  };

  const handleToggleAiSuggestions = () => {
    if (!objective && !showAiSuggestions) {
      toast.error("Please select a campaign objective to get AI suggestions");
      return;
    }
    setShowAiSuggestions(!showAiSuggestions);
  };

  return (
    <div className="max-w-3xl mx-auto relative h-[calc(100vh-4rem)] flex flex-col">
      <div className="sticky top-0 left-0 w-full z-30 bg-background/95 backdrop-blur border-b shadow">
        <div className="mx-auto max-w-3xl flex items-center gap-2 p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/campaigns")}
            className="text-gray-500"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Create New Campaign</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-b-lg shadow-lg p-6 space-y-10"
        >
          {/* Campaign Details */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Campaign Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter campaign name"
                  className={errors.name ? "border-red-500" : ""}
                  aria-invalid={!!errors.name}
                  aria-describedby="name-error"
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="objective">Campaign Objective</Label>
                <Select value={objective} onValueChange={setObjective}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Re-engage inactive users">
                      Re-engage inactive users
                    </SelectItem>
                    <SelectItem value="Promote new product">
                      Promote new product
                    </SelectItem>
                    <SelectItem value="Drive sales">Drive sales</SelectItem>
                    <SelectItem value="Announce event">
                      Announce event
                    </SelectItem>
                    <SelectItem value="Collect feedback">
                      Collect feedback
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe the purpose of this campaign"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="channel">Channel</Label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger id="channel">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
          <hr />
          {/* Audience Targeting */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Audience Targeting</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Define who should receive this campaign by creating rules with
              conditions.
            </p>
            <div className="bg-muted rounded-lg p-4 mb-4">
              <RuleGroup group={rules} onUpdate={setRules} isRoot />
              {errors.rules && (
                <p className="text-red-500 text-sm mt-1">{errors.rules}</p>
              )}
            </div>
            <AudiencePreview rules={rules} />
          </section>
          <hr />
          {/* Message Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Message</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="audienceDetails">
                    Target Audience Description
                  </Label>
                  <Textarea
                    id="audienceDetails"
                    value={audienceDetails}
                    onChange={(e) => setAudienceDetails(e.target.value)}
                    placeholder="e.g., Young professionals aged 25-35 in urban areas"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Helps AI generate targeted message suggestions
                  </p>
                </div>
                <div>
                  <Label htmlFor="productDetails">
                    Product/Service Details
                  </Label>
                  <Textarea
                    id="productDetails"
                    value={productDetails}
                    onChange={(e) => setProductDetails(e.target.value)}
                    placeholder="e.g., Premium fitness app with personalized workouts"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Helps AI generate relevant content for your messages
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="messageText">Message Text</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant={showAiSuggestions ? "secondary" : "outline"}
                      onClick={handleToggleAiSuggestions}
                      className="flex items-center gap-1"
                      aria-pressed={showAiSuggestions}
                    >
                      <Sparkles className="h-4 w-4 mr-1 text-blue-500" />
                      {showAiSuggestions
                        ? "Hide AI Suggestions"
                        : "Get AI Suggestions"}
                    </Button>
                  </div>
                  <Textarea
                    id="messageText"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Enter your message template, or get AI suggestions..."
                    rows={4}
                    className={errors.messageText ? "border-red-500" : ""}
                    aria-invalid={!!errors.messageText}
                    aria-describedby="messageText-error"
                  />
                  {errors.messageText && (
                    <p
                      id="messageText-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.messageText}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    Characters: {messageText.length}/160
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {showAiSuggestions && objective ? (
                  <div className="bg-muted rounded-lg p-4">
                    <MessageSuggestions
                      objective={objective}
                      audienceDetails={audienceDetails}
                      productDetails={productDetails}
                      onSelectMessage={handleSelectMessage}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </section>
          {/* Actions */}
          <div className="flex flex-col md:flex-row justify-end gap-2 pt-6 border-t sticky bottom-0 bg-card z-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/campaigns")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Creating and Sending...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create & Send Campaign
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
