import { body } from "express-validator";

export const customerValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage("Invalid phone number format"),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format, use YYYY-MM-DD")
    .toDate(),

  body("address")
    .optional()
    .isObject()
    .withMessage("Address must be an object"),

  body("address.street")
    .optional()
    .isString()
    .withMessage("Street must be a string"),

  body("address.city")
    .optional()
    .isString()
    .withMessage("City must be a string"),

  body("address.state")
    .optional()
    .isString()
    .withMessage("State must be a string"),

  body("address.zipCode")
    .optional()
    .isString()
    .withMessage("Zip code must be a string"),

  body("address.country")
    .optional()
    .isString()
    .withMessage("Country must be a string"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((value) => {
      if (!Array.isArray(value)) return true;
      return value.every((item) => typeof item === "string");
    })
    .withMessage("Each tag must be a string"),

  body("metadata")
    .optional()
    .isObject()
    .withMessage("Metadata must be an object"),
];
