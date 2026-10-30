import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      match: [/^[a-zA-Z0-9]+$/, "El username solo puede ser alfanumérico"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    // se guarda hasheada con bcrypt
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
      firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
        match: [/^[\p{L}\s]+$/u, "El nombre solo puede contener letras"],
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
        match: [/^[\p{L}\s]+$/u, "El apellido solo puede contener letras"],
      },
      birthDate: {
        type: Date,
        default: null,
        validate: {
          validator: (value) => !value || value <= new Date(),
          message: "La fecha de nacimiento no puede ser futura",
        },
      },
      phone: {
        type: String,
        default: null,
        trim: true,
        match: [/^\d{8,15}$/, "El teléfono debe tener entre 8 y 15 dígitos"],
      },
    },
    // Eliminación lógica
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      // no devolver el hash de la contraseña ni el id duplicado
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.id;
        return ret;
      },
    },
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