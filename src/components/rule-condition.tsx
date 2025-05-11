import { useState, useEffect } from "react";
import { Condition } from "../types/campaign";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getFieldOptions, getOperatorOptions } from "../lib/utils";
import { Trash2 } from "lucide-react";
import React from "react";

interface RuleConditionProps {
  condition: Condition;
  onUpdate: (updated: Condition) => void;
  onDelete: () => void;
}

export function RuleCondition({
  condition,
  onUpdate,
  onDelete,
}: RuleConditionProps) {
  const [fieldOptions] = useState(getFieldOptions());
  const [operatorOptions, setOperatorOptions] = useState(
    getOperatorOptions(condition.field)
  );

  useEffect(() => {
    setOperatorOptions(getOperatorOptions(condition.field));
  }, [condition.field]);

  const handleFieldChange = (value: string) => {
    onUpdate({
      ...condition,
      field: value,
      // Reset operator and value when field changes
      operator: getOperatorOptions(value)[0].value as any,
      value: "",
    });
  };

  const handleOperatorChange = (value: string) => {
    onUpdate({
      ...condition,
      operator: value as any,
    });
  };

  const handleValueChange = (value: string) => {
    onUpdate({
      ...condition,
      value:
        condition.field === "spend" || condition.field === "visits"
          ? Number(value)
          : value,
    });
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded-md bg-white shadow-sm relative group mb-2 hover:border-blue-300 transition-colors">
      <div className="flex items-center flex-wrap gap-2 w-full">
        <Select value={condition.field} onValueChange={handleFieldChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {fieldOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={condition.operator} onValueChange={handleOperatorChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            {operatorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type={
            condition.field === "spend" || condition.field === "visits"
              ? "number"
              : "text"
          }
          value={condition.value.toString()}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder="Enter value"
          className="flex-1 min-w-[120px]"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
