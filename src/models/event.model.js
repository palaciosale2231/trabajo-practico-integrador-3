import { model, Schema, Types } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 150,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "La capacidad debe ser un número entero",
      },
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "finished"],
      default: "scheduled",
    },
    // Documento embebido 1:1 (estilo inline)
    location: {
      _id: false,
      venue: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 150,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true,
      },
    },
    organizer: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const EventModel = model("Event", eventSchema);
