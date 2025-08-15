import { Router } from "express";
import {
  getFacturas,
  getFacturaById,
  getDetallesByFacturaId,
  createFactura,
  updateFactura,
  deleteFactura
} from "../controllers/facturaController.js";

const router = Router();

router.get("/", getFacturas);
router.get("/:id", getFacturaById);
router.get("/:id/detalles", getDetallesByFacturaId);
router.post("/", createFactura);
router.put("/:id", updateFactura);
router.delete("/:id", deleteFactura);

export default router;
