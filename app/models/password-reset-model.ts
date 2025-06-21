import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 3600, // Token expires after 1 hour
  },
  used: {
    type: Boolean,
    default: false,
  },
});

export const PasswordResetModel = mongoose.models.PasswordReset || mongoose.model('PasswordReset', passwordResetSchema); 