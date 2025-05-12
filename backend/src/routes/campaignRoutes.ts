import { Router } from "express";
import * as campaignController from "../controllers/campaignController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Apply authentication to all campaign routes
router.use(authenticate);

// Campaign CRUD routes
router.get("/", campaignController.getCampaigns);
router.get("/:id", campaignController.getCampaign);
router.post("/", campaignController.createCampaign);
router.put("/:id", campaignController.updateCampaign);
router.delete("/:id", campaignController.deleteCampaign);

// Campaign status and metrics routes
router.put("/:id/status", campaignController.updateStatus);
router.put("/:id/metrics", campaignController.updateMetrics);

// Campaign audience route
router.get("/:id/audience", campaignController.getCampaignAudience);

// Campaign send route
router.post("/:id/send", campaignController.sendCampaign);

export default router;
