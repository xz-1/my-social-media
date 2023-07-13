import mongoose from "mongoose";


const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        //https://youtu.be/K8YELRmUb5o?t=4958
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: {
            types: Array,
            //mean: set defualt as empty array
            default: []
        }
    },
    { timestamps: true }
);