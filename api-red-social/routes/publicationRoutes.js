import { Router } from "express";
import { publicationController } from "../controllers/publicationControllers/publicationController.js";
import multer from "multer";
import auth from "../middlewares/auth.js";

const router = Router();

//Configuracion de subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/publications");
    },
    filename: (req, file, cb) => {
      cb(null, "pub-" + Date.now() + "-" + file.originalname);
    },
  });
  
  const uploadsMiddleware = multer({ storage: storage });

//Definir las rutas
router.post("/save", auth, publicationController.save);
router.get("/detail/:id", auth, publicationController.detail);
router.delete("/remove/:id", auth, publicationController.remove);
router.get("/user/:id/:page?", auth, publicationController.user);
router.post("/upload/:id", [auth, uploadsMiddleware.single("file0")], publicationController.upload);
router.get("/media/:file",  publicationController.media);
router.get("/feed/:page?", auth, publicationController.feed);
router.put('/edit/:id', auth, publicationController.editPublication);
router.post("/comment/:publication_id", auth, publicationController.addComment);
router.get("/comments/:publication_id", auth, publicationController.getComments);
router.delete("/:publication_id/comments/:comment_id", auth, publicationController.deleteComment);

export default router;