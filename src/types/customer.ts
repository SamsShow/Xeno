export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: Address;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: Address;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface CustomerListResponse {
  status: string;
  data: {
    customers: Customer[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface CustomerResponse {
  status: string;
  data: Customer;
}

export interface CustomerCreateResponse {
  status: string;
  message: string;
  requestId: string;
}
