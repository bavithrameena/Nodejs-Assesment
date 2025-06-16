import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  role_name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Role', roleSchema);