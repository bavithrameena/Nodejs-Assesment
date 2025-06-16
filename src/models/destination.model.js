
const destinationSchema = new mongoose.Schema({
  account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  url: { type: String, required: true },
  method: { type: String, required: true, enum: ['GET', 'POST', 'PUT', 'DELETE'] },
  headers: { type: Map, of: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: String },
  updated_by: { type: String }
});

export default mongoose.model('Destination', destinationSchema);