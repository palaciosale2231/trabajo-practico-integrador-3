const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la categoría es obligatorio"],
      unique: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [30, "El nombre no puede superar los 30 caracteres"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [200, "La descripción no puede superar los 200 caracteres"],
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual populate: Eventos que pertenecen a esta categoría (Relación N:M referenciada)
categorySchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "categories",
});

const Category = model("Category", categorySchema);
module.exports = Category;
