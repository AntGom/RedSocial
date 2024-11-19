import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CommentSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PublicationSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  file: {
    type: String,
  },
  comments: [CommentSchema], 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Agregar el plugin de paginación al esquema
PublicationSchema.plugin(mongoosePaginate);
const Publication = model("Publication", PublicationSchema, "publications");

export default Publication;
