import mongoose, { Schema, model, Document } from 'mongoose';


export interface ReservationDocument extends Document {
  date: Date;
  field: string;
  hour: number;
  reservedBy: mongoose.Schema.Types.ObjectId;
  reservedAt: Date;
  status: string;
}

const reservationSchema = new Schema<ReservationDocument>({
  date: { type: Date, required: true },
  field: {
    type: String,
    required: true,
    enum: ['Football', 'Basketball', 'Volleyball'],
  },
  reservedAt: { type: Date, default: Date.now },
  hour : { type: Number, required: true },
  reservedBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
});

export const Reservation = mongoose.models.Reservation || model<ReservationDocument>('Reservation', reservationSchema);
