import { useEffect, useState } from "react";
import { CommunicationLog } from "../types/communication";
import { communicationService } from "../lib/communication-service";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import React from "react";

interface CommunicationLogProps {
  campaignId: string;
}

export function CommunicationLogView({ campaignId }: CommunicationLogProps) {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Poll for updates every 2 seconds
    const fetchLogs = () => {
      const campaignLogs =
        communicationService.getCommunicationLogs(campaignId);
      setLogs(campaignLogs);
      setLoading(false);
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);

    return () => clearInterval(interval);
  }, [campaignId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "SENT":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">Loading communication logs...</div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md bg-gray-50">
        <h3 className="text-lg font-medium text-gray-600">
          No messages sent yet
        </h3>
        <p className="text-gray-500">
          Delivery information will appear here once messages are sent.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Communication Log</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer ID</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sent At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Failure Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.customerId}</TableCell>
              <TableCell className="max-w-xs truncate">{log.message}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(
                    log.status
                  )}`}
                >
                  {log.status}
                </span>
              </TableCell>
              <TableCell>{formatDate(log.sentAt)}</TableCell>
              <TableCell>{formatDate(log.updatedAt)}</TableCell>
              <TableCell>{log.failureReason || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
