import { Express } from "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      role?: string;
      picture?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
