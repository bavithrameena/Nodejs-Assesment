import Destination from '../models/destination.model.js';
import { validationResult, body } from 'express-validator';

const validate = async (req, res) => {
  await body('name').notEmpty().withMessage('Name is required').run(req);
  await body('webhook_url').isURL().withMessage('Valid webhook URL is required').run(req);
  await body('account_id').notEmpty().withMessage('Account ID is required').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return { hasErrors: true, response: res.status(400).json({ success: false, errors: errors.array() }) };
  }
  return { hasErrors: false };
};

export const createDestination = async (req, res) => {
  const { hasErrors, response } = await validate(req, res);
  if (hasErrors) return response;

  try {
    const { name, webhook_url, account_id } = req.body;

    const destination = new Destination({
      name,
      webhook_url,
      account_id,
      created_by: req.user?.email
    });

    await destination.save();
    res.status(201).json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create destination', error });
  }
};

export const getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json({ success: true, data: destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching destinations', error });
  }
};

export const updateDestination = async (req, res) => {
  await body('name').optional().notEmpty().withMessage('Name cannot be empty').run(req);
  await body('webhook_url').optional().isURL().withMessage('Must be a valid URL').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, webhook_url } = req.body;
    const updated = await Destination.findByIdAndUpdate(
      req.params.id,
      { name, webhook_url, updated_by: req.user?.email },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update destination', error });
  }
};
