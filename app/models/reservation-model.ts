import mongoose, { Schema, model, Document } from 'mongoose';


export interface ReservationDocument extends Document {
  date: Date;
  field: string;
  hour: { type: Number, required: true },
  reservedBy: { type: String, required: true }
  reservedAt: Date;
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
  reservedBy : { type: String, required: true }

});

export const Reservation = mongoose.models.Reservation || model<ReservationDocument>('Reservation', reservationSchema);
