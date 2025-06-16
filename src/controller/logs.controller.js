import Log from "../models/log.model.js"

export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().populate('account_id destination_id');
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching logs', error });
  }
};