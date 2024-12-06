import { Router } from "express";
import { userController } from "../controllers/userControllers/userControllers.js";
import { followControllers } from "../controllers/followControllers/followController.js";
import auth from "../middlewares/auth.js";
import multer from "multer";

const router = Router();

//Configuración de subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars");
    },
    filename: (req, file, cb) => {
        
        cb(null, file.originalname);
    },
});

const uploadsMiddleware = multer({ storage: storage });

//Definir las rutas
router.post("/register", userController.register);
router.get("/confirm/:token", userController.confirmRegistration);
router.post("/login", userController.login);
router.get("/avatar/:file", userController.avatar);

//Rutas de recuperación de contraseña
router.post("/forgot-password", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);

//Rutas de recuperación de cuenta
router.post("/request-recovery", userController.requestAccountRecovery);
router.post("/recover-account", userController.recoverAccount);  

//Auth Routes
router.get("/profile/:id", auth, userController.profile);
router.get("/list/:page?", auth, userController.list);
router.put("/update", auth, userController.update);
router.post("/upload", [auth, uploadsMiddleware.single("file0")], userController.upload);
router.get("/counters/:id", auth, followControllers.counter);
router.delete("/delete/:id", auth, userController.deleteUser);
//Sólo Admins
router.put("/ban/:id", auth, userController.banUser);
router.put("/unban/:id", auth, userController.unbanUser);
router.get('/check', auth, userController.checkIfBanned);

export default router;
