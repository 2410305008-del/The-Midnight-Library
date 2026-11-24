import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['scholar', 'admin', 'guest'], default: 'scholar' },
    membershipTier: { type: String, default: 'Patron Scholar' },
    readingStreaks: { type: Number, default: 14 },
    booksReadCount: { type: Number, default: 8 },
    currentlyReading: [
      {
        bookId: { type: String },
        title: { type: String },
        author: { type: String },
        coverImage: { type: String },
        progressPercent: { type: Number, default: 35 },
        lastReadDate: { type: Date, default: Date.now }
      }
    ],
    savedAddresses: [
      {
        fullName: String,
        streetAddress: String,
        city: String,
        state: String,
        postalCode: String,
        country: { type: String, default: 'United States' },
        isDefault: { type: Boolean, default: true }
      }
    ]
  },
  { timestamps: true }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
