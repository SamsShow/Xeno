import { useState } from "react";
import {
  Condition,
  LogicalOperator,
  RuleGroup as RuleGroupType,
} from "../types/campaign";
import { Button } from "./ui/button";
import { generateId } from "../lib/utils";
import { RuleCondition } from "./rule-condition";
import { DraggableRuleCondition } from "./draggable-rule-condition";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

interface RuleGroupProps {
  group: RuleGroupType;
  onUpdate: (updated: RuleGroupType) => void;
  onDelete?: () => void;
  isRoot?: boolean;
}

export function RuleGroup({
  group,
  onUpdate,
  onDelete,
  isRoot = false,
}: RuleGroupProps) {
  const toggleOperator = () => {
    onUpdate({
      ...group,
      operator: group.operator === "AND" ? "OR" : "AND",
    });
  };

  const addCondition = () => {
    const newCondition: Condition = {
      id: generateId(),
      field: "spend",
      operator: "greaterThan",
      value: "",
    };

    onUpdate({
      ...group,
      conditions: [...group.conditions, newCondition],
    });
  };

  const addGroup = () => {
    const newGroup: RuleGroupType = {
      id: generateId(),
      operator: "AND",
      conditions: [],
    };

    onUpdate({
      ...group,
      conditions: [...group.conditions, newGroup],
    });
  };

  const updateCondition = (
    index: number,
    updated: Condition | RuleGroupType
  ) => {
    const newConditions = [...group.conditions];
    newConditions[index] = updated;

    onUpdate({
      ...group,
      conditions: newConditions,
    });
  };

  const deleteCondition = (index: number) => {
    onUpdate({
      ...group,
      conditions: group.conditions.filter((_, i) => i !== index),
    });
  };

  const moveCondition = (fromIndex: number, toIndex: number) => {
    const newConditions = [...group.conditions];
    const [movedItem] = newConditions.splice(fromIndex, 1);
    newConditions.splice(toIndex, 0, movedItem);

    onUpdate({
      ...group,
      conditions: newConditions,
    });
  };

  return (
    <div
      className={`border rounded-lg p-3 ${
        isRoot ? "bg-gray-50" : "bg-white"
      } mb-3 relative group`}
    >
      {!isRoot && (
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-center mb-3 gap-2">
        <Button
          variant={group.operator === "AND" ? "default" : "outline"}
          className={`${
            group.operator === "AND" ? "bg-blue-600" : ""
          } rounded-r-none`}
          onClick={() => group.operator !== "AND" && toggleOperator()}
        >
          AND
        </Button>
        <Button
          variant={group.operator === "OR" ? "default" : "outline"}
          className={`${
            group.operator === "OR" ? "bg-blue-600" : ""
          } rounded-l-none`}
          onClick={() => group.operator !== "OR" && toggleOperator()}
        >
          OR
        </Button>
        <span className="text-sm text-gray-500 ml-2">
          {group.operator === "AND"
            ? "All conditions must match"
            : "Any condition can match"}
        </span>
      </div>

      <div className="space-y-2">
        {group.conditions.map((condition, index) => (
          <div key={condition.id}>
            {"field" in condition ? (
              <DraggableRuleCondition
                condition={condition}
                index={index}
                onUpdate={(updated) => updateCondition(index, updated)}
                onDelete={() => deleteCondition(index)}
                onMove={moveCondition}
              />
            ) : (
              <RuleGroup
                group={condition}
                onUpdate={(updated) => updateCondition(index, updated)}
                onDelete={() => deleteCondition(index)}
              />
            )}
          </div>
        ))}

        {group.conditions.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm italic">
            No conditions added yet. Add a condition or group below.
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={addCondition}
          className="flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          Add Condition
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={addGroup}
          className="flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          Add Group
        </Button>
      </div>
    </div>
  );
}
