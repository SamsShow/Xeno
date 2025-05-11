import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Mock function to simulate audience size calculation
export function calculateAudienceSize(rules: any): number {
  // In a real application, this would make an API call to calculate the audience size
  // For demo purposes, we'll return a random number between 100 and 10000
  return Math.floor(Math.random() * 9900) + 100;
}

// Mock function to get sample field options
export function getFieldOptions() {
  return [
    { value: "spend", label: "Spend" },
    { value: "visits", label: "Visits" },
    { value: "lastActive", label: "Last Active" },
    { value: "location", label: "Location" },
    { value: "device", label: "Device" },
  ];
}

// Mock function to get operator options based on field
export function getOperatorOptions(field: string) {
  const commonOperators = [
    { value: "equals", label: "Equals" },
    { value: "notEquals", label: "Not Equals" },
  ];

  const numericOperators = [
    ...commonOperators,
    { value: "greaterThan", label: "Greater Than" },
    { value: "lessThan", label: "Less Than" },
  ];

  const textOperators = [
    ...commonOperators,
    { value: "contains", label: "Contains" },
    { value: "notContains", label: "Not Contains" },
  ];

  const dateOperators = [{ value: "inactiveFor", label: "Inactive For" }];

  switch (field) {
    case "spend":
    case "visits":
      return numericOperators;
    case "location":
    case "device":
      return textOperators;
    case "lastActive":
      return dateOperators;
    default:
      return commonOperators;
  }
}
