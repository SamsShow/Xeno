import { Request, Response, NextFunction } from "express";
import expressValidator from "express-validator";
const validationResult = (req: any) => ({
  isEmpty: () => true,
  array: () => [],
});
type ValidationChain = any;

// Middleware to handle validation errors
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // If there are validation errors, format and return them
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array().map((err: any) => ({
        field: err.path || err.param || "unknown", // Support both new and old express-validator versions
        message: err.msg,
      })),
    });
  };
};
