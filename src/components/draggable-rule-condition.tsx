import { useState, useRef } from "react";
import { Condition } from "../types/campaign";
import { RuleCondition } from "./rule-condition";
import { Move } from "lucide-react";

interface DraggableRuleConditionProps {
  condition: Condition;
  index: number;
  onUpdate: (updated: Condition) => void;
  onDelete: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

export function DraggableRuleCondition({
  condition,
  index,
  onUpdate,
  onDelete,
  onMove,
}: DraggableRuleConditionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";

    // For better drag preview
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      e.dataTransfer.setDragImage(
        elementRef.current,
        e.clientX - rect.left,
        e.clientY - rect.top
      );
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);

    if (fromIndex !== index) {
      onMove(fromIndex, index);
    }
  };

  return (
    <div
      ref={elementRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative ${
        isDragging ? "opacity-50" : "opacity-100"
      } transition-opacity`}
    >
      <div className="absolute left-1 top-1/2 -translate-y-1/2 cursor-move p-1 rounded-md hover:bg-gray-100">
        <Move className="h-4 w-4 text-gray-400" />
      </div>
      <div className="pl-8">
        <RuleCondition
          condition={condition}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
