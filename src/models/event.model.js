const { Schema, model } = require('mongoose');

// Subesquema para la ubicación (Relación 1:1 embebida)
const locationSchema = new Schema({
  venue: {
    type: String,
    required: [true, 'El lugar (venue) es obligatorio'],
    minlength: [3, 'El venue debe tener al menos 3 caracteres'],
    maxlength: [100, 'El venue no puede superar los 100 caracteres'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    minlength: [5, 'La dirección debe tener al menos 5 caracteres'],
    maxlength: [150, 'La dirección no puede superar los 150 caracteres'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'La ciudad es obligatoria'],
    minlength: [2, 'La ciudad debe tener al menos 2 caracteres'],
    maxlength: [50, 'La ciudad no puede superar los 50 caracteres'],
    trim: true
  }
}, { _id: false });

const eventSchema = new Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    unique: true,
    minlength: [3, 'El título debe tener al menos 3 caracteres'],
    maxlength: [150, 'El título no puede superar los 150 caracteres'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    minlength: [20, 'La descripción debe tener al menos 20 caracteres'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'La fecha de inicio es obligatoria']
  },
  endDate: {
    type: Date,
    required: [true, 'La fecha de fin es obligatoria']
  },
  capacity: {
    type: Number,
    required: [true, 'La capacidad es obligatoria'],
    min: [1, 'La capacidad mínima debe ser 1'],
    validate: {
      validator: Number.isInteger,
      message: 'La capacidad debe ser un número entero'
    }
  },
  price: {
    type: Number,
    min: [0, 'El precio no puede ser negativo'],
    default: 0
  },
  status: {
    type: String,
    enum: {
      values: ['scheduled', 'cancelled', 'finished'],
      message: `'{VALUE}' no es un estado válido`
    },
    default: 'scheduled'
  },
  location: {
    type: locationSchema,
    required: true
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El organizador es obligatorio']
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }]
}, {
  timestamps: true,
  versionKey: false
});

const Event = model('Event', eventSchema);
module.exports = Event;