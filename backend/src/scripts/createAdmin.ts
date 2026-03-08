/**
 * One-time script to create an admin user.
 * Run with: npm run seed:admin
 *
 * Uses env vars:
 *   ADMIN_NAME     (default: "Admin")
 *   ADMIN_EMAIL    (default: "admin@cinevault.com")
 *   ADMIN_PASSWORD (default: "Admin@1234")
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.model';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/cinevault';
const ADMIN_NAME = process.env.ADMIN_NAME ?? 'Admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@cinevault.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Admin@1234';

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role === 'admin') {
      console.log(`ℹ️  Admin already exists: ${ADMIN_EMAIL}`);
    } else {
      existing.role = 'admin';
      await existing.save();
      console.log(`✅ Promoted existing user to admin: ${ADMIN_EMAIL}`);
    }
    await mongoose.disconnect();
    return;
  }

  await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
  console.log(`✅ Admin created — email: ${ADMIN_EMAIL}  password: ${ADMIN_PASSWORD}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
