import { Router } from "express";
import { userController } from "../controllers/userControllers/userControllers.js";
import { followControllers } from "../controllers/followControllers/followController.js";
import auth from "../middlewares/auth.js";
import multer from "multer";

const router = Router();

// Configuración de subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars");
    },
    filename: (req, file, cb) => {
        
        cb(null, file.originalname);
    },
});

const uploadsMiddleware = multer({ storage: storage });

// Definir las rutas
router.post("/register", userController.register);
router.get("/confirm/:token", userController.confirmRegistration);
router.post("/login", userController.login);

// Rutas de recuperación de contraseña
router.post("/forgot-password", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);

// Auth Routes
router.get("/profile/:id", auth, userController.profile);
router.get("/list/:page?", auth, userController.list);
router.put("/update", auth, userController.update);
router.post("/upload", [auth, uploadsMiddleware.single("file0")], userController.upload);
router.get("/avatar/:file", userController.avatar);
router.get("/counters/:id", auth, followControllers.counter);

export default router;
