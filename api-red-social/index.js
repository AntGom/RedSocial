import conection from "./database/conection.js";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import publicationRoutes from "./routes/publicationRoutes.js";
import followRoutes from "./routes/followRoutes.js";

//Conexion a BBDD
conection();

//Crear Servidor Node
const app = express();
const port = 3900;

//Configurar cors
app.use(cors());

//Convertir los datos del body a JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cargar conf rutas
app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes);
app.use("/api/follow", followRoutes);

//Poner servidor a escuchar peticiones HTTP
app.listen(port, () => {console.log("Servidor corriendo en el puerto " + port);});
