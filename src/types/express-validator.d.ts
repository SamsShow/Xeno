import "express-validator";

declare module "express-validator" {
  interface ValidationError {
    param: string;
    path: string;
  }
}
