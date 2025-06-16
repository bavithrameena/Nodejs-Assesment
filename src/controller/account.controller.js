import { body, validationResult } from 'express-validator';
import Account from "../models/account.model.js";

const validateAccountInput = async (req, res) => {
  await body('account_name').notEmpty().withMessage('Account name is required').run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return { hasErrors: true, response: res.status(400).json({ success: false, errors: errors.array() }) };
  }
  return { hasErrors: false };
};

export const createAccount = async (req, res) => {
  const { hasErrors, response } = await validateAccountInput(req, res);
  if (hasErrors) return response;

  try {
    const account = new Account({ ...req.body, created_by: req.user?.email });
    await account.save();
    res.status(201).json({ success: true, data: account });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create account', error });
  }
};


export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json({ success: true, data: accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching accounts', error });
  }
};

export const updateAccount = async (req, res) => {
  const { hasErrors, response } = await validateAccountInput(req, res);
  if (hasErrors) return response;

  try {
    const updated = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update account', error });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting account', error });
  }
};



export const searchAccounts = async (req, res) => {
  try {
    const { name, website } = req.query;
    const query = {};

    if (name) query.account_name = { $regex: name, $options: 'i' };
    if (website) query.website = { $regex: website, $options: 'i' };

    const accounts = await Account.find(query);
    res.status(200).json({ success: true, data: accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching accounts', error });
  }
};