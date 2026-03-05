import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// ---------------------------------------------------------------------------
// Interface — TypeScript contract for a User document
// ---------------------------------------------------------------------------
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  watchlist: number[];      // TMDB movie IDs
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      // `select: false` — never returned in query results by default.
      // Opt in with `.select('+password')` only during login.
      select: false,
    },
    watchlist: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true },
);

// ---------------------------------------------------------------------------
// Pre-save Hook — Hash password before persisting
// ---------------------------------------------------------------------------
UserSchema.pre<IUser>('save', async function (next) {
  // Skip if the password field was not modified (prevents re-hashing on
  // unrelated updates like changing a user's name or watchlist).
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ---------------------------------------------------------------------------
// Instance Method — Timing-safe password comparison
// ---------------------------------------------------------------------------
UserSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;
