const { Schema, model } = require('mongoose');

// Subesquema para el perfil (Relación 1:1 embebida)
const profileSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede superar los 50 caracteres'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
    maxlength: [50, 'El apellido no puede superar los 50 caracteres'],
    trim: true
  },
  birthDate: {
    type: Date,
    default: null
  },
  phone: {
    type: String,
    trim: true,
    default: null
  }
}, { _id: false }); // _id: false para que el subdocumento no genere un _id independiente

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'El username es obligatorio'],
    unique: true,
    minlength: [3, 'El username debe tener al menos 3 caracteres'],
    maxlength: [20, 'El username no puede superar los 20 caracteres'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: `'{VALUE}' no es un rol válido`
    },
    default: 'user'
  },
  profile: {
    type: profileSchema,
    required: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate: Eventos organizados por el usuario (Relación 1:N referenciada)
userSchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'organizer'
});

const User = model('User', userSchema);
module.exports = User;