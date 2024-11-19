import mongoose from "mongoose";

const conection = async () => {

    try {
        await mongoose.connect("mongodb://localhost:27017/mi_redsocial");
        console.log("Conectado a la BBDD mi_redsocial");

    } catch (error) {
        console.log(error);
        throw new Error("Error al conectar con la BBDD");
    }
}

export default conection;

