import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  title: string;
  audience: string;
  date: Date;
  status: string;
}

const NotificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  audience: { type: String, required: true, enum: ["All Users", "Students", "Organizers"] },
  date: { type: Date, required: true, default: Date.now },
  status: { type: String, required: true, enum: ["Delivered", "Failed"] },
});

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
