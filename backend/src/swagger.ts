import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import express from "express";

// Load Swagger document
const swaggerDoc = YAML.load(path.join(__dirname, "./swagger.yaml"));

export const setupSwagger = (app: express.Application): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDoc, {
      explorer: true,
      customCssUrl:
        "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-material.css",
    })
  );
};
