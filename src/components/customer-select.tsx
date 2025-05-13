import React, { useState, useEffect } from "react";
import apiClient from "../lib/api-client";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
}

interface CustomerSelectProps {
  onSelect: (customerId: string) => void;
  placeholder?: string;
}

export function CustomerSelect({
  onSelect,
  placeholder = "Select customer...",
}: CustomerSelectProps) {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/customers");
        console.log("API Response:", response.data);

        // Handle different API response formats
        let customerList = [];
        if (response.data.customers) {
          customerList = response.data.customers;
        } else if (Array.isArray(response.data)) {
          customerList = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          customerList = response.data.data;
        }

        // If no customers were returned, use mock data for demonstration
        if (customerList.length === 0) {
          console.log("No customers found, using mock data");
          customerList = [
            {
              id: "mock-1",
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com",
              company: "Acme Inc",
            },
            {
              id: "mock-2",
              firstName: "Jane",
              lastName: "Smith",
              email: "jane.smith@example.com",
              company: "Tech Solutions",
            },
            {
              id: "mock-3",
              firstName: "Robert",
              lastName: "Johnson",
              email: "robert.johnson@example.com",
              company: "Data Corp",
            },
          ];
        }

        console.log("Processed customer list:", customerList);
        setCustomers(customerList);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = searchTerm
    ? customers.filter(
        (customer) =>
          `${customer.firstName} ${customer.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (customer.company &&
            customer.company.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : customers;

  // Direct click handler for each customer item
  const selectCustomer = (customer: Customer) => {
    console.log("Customer selected:", customer);
    setSelectedCustomer(customer);
    onSelect(customer.id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCustomer ? (
            <span>{`${selectedCustomer.firstName} ${selectedCustomer.lastName} (${selectedCustomer.email})`}</span>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search by name, email, or company..."
            onValueChange={(value) => setSearchTerm(value)}
          />
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <CommandEmpty>No customers found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => selectCustomer(customer)}
                    className="px-2 py-1.5 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm flex items-center"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCustomer?.id === customer.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{`${customer.firstName} ${customer.lastName}`}</span>
                      <span className="text-sm text-muted-foreground">
                        {customer.email}
                      </span>
                      {customer.company && (
                        <span className="text-xs text-muted-foreground">
                          {customer.company}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
