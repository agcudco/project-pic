import { Router } from "express";
const router = Router();

import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  filterProductos,
} from "../controllers/productoController.js";

router.get("/productos", getAllProductos); // Obtener todos los productos activos
router.get("/productos/filtrar", filterProductos); // Filtrar productos con paginación y nombre/precio
router.get("/productos/:id", getProductoById); // Obtener producto por ID
router.post("/productos", createProducto); // Crear producto
router.put("/productos/:id", updateProducto); // Actualizar producto
router.delete("/productos/:id", deleteProducto); // Eliminar (baja lógica) producto

export default router;
