import conection from "./database/conection.js";
import express from "express";
import cors from "cors";
import { PORT } from './env.js';
import userRoutes from "./routes/userRoutes.js";
import publicationRoutes from "./routes/publicationRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import filterDeleted from "./middlewares/filterDeleted.js";


//Conexion a BBDD
conection();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(filterDeleted);

//Cargar conf rutas
app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes);
app.use("/api/follow", followRoutes);

//Poner servidor a escuchar peticiones HTTP
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});