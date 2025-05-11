export type ConditionOperator =
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "lessThan"
  | "contains"
  | "notContains"
  | "inactiveFor";

export type LogicalOperator = "AND" | "OR";

export interface Condition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: string | number;
}

export interface RuleGroup {
  id: string;
  operator: LogicalOperator;
  conditions: (Condition | RuleGroup)[];
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  rules: RuleGroup;
  objective?: string;
  messageTemplate?: string;
  audienceSize: number;
  status: "draft" | "sent" | "scheduled";
  createdAt: string;
  updatedAt: string;
  stats?: {
    sent: number;
    delivered: number;
    failed: number;
    pending: number;
  };
}
