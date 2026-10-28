import { model, Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Documento embebido 1:1 (estilo inline)
    profile: {
      _id: false,
      firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true,
      },
      birthDate: {
        type: Date,
        default: null,
      },
      phone: {
        type: String,
        default: null,
        trim: true,
      },
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual populate para eventos organizados por el usuario
userSchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "organizer",
});

export const UserModel = model("User", userSchema);
