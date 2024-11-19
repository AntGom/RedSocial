import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const FollowSchema = Schema({

    user: { //->Usuario que sigue a...
        type: Schema.ObjectId,
        ref: "User",
    },
    followed: { //Usuario que está siendo seguido
        type: Schema.ObjectId,
        ref: "User",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
}, { versionKey: false });

FollowSchema.plugin(mongoosePaginate);

const Follow = model("Follow", FollowSchema, "follows");

export default Follow;
