import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Send } from "lucide-react";
import apiClient from "../lib/api-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CustomerSelect } from "./customer-select";

export const SendMessage: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [messageType, setMessageType] = useState("email");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSending(true);
    try {
      await apiClient.post("/api/communications/send", {
        customerId,
        type: messageType,
        subject,
        content,
      });

      toast.success("Message sent successfully");
      // Reset form
      setCustomerId("");
      setSubject("");
      setContent("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const validate = () => {
    if (!customerId) {
      toast.error("Please select a customer");
      return false;
    }
    if (!content) {
      toast.error("Message content is required");
      return false;
    }
    if (messageType === "email" && !subject) {
      toast.error("Subject is required for email messages");
      return false;
    }
    return true;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Send Individual Message</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="customer">Customer</Label>
          <CustomerSelect 
            onSelect={(id) => setCustomerId(id)} 
            placeholder="Select a customer..."
          />
        </div>

        <div>
          <Label htmlFor="messageType">Message Type</Label>
          <Select value={messageType} onValueChange={setMessageType}>
            <SelectTrigger id="messageType">
              <SelectValue placeholder="Select message type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="push">Push Notification</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {messageType === "email" && (
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject"
              required
            />
          </div>
        )}

        <div>
          <Label htmlFor="content">Message</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your message"
            rows={4}
            required
          />
        </div>

        <Button type="submit" disabled={isSending} className="w-full">
          <Send className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
};
