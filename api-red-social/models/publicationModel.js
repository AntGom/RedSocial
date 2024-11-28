import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PublicationSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000,
  },
  file: {
    type: String,
  },
  likes: [
    {
      type: Schema.ObjectId,
      ref: "User",
    },
  ],
  likesCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware actualizar contador de likes antes de guardar
PublicationSchema.pre("save", function (next) {
  this.likesCount = this.likes.length; // Actualiza contador en base array de likes
  next();
});

// Agregar el plugin de paginación al esquema
PublicationSchema.plugin(mongoosePaginate);

const Publication = model("Publication", PublicationSchema, "publications");

export default Publication;
