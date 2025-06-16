// controller/accountmember.controller.js
import { validationResult, body } from 'express-validator';
import AccountMember from '../models/accountMember.model.js';

const validateMemberInput = async (req, res) => {
  await body('user_id').notEmpty().withMessage('User ID is required').run(req);
  await body('role_id').notEmpty().withMessage('Role ID is required').run(req);
  await body('account_id').notEmpty().withMessage('Account ID is required').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return { hasErrors: true, response: res.status(400).json({ success: false, errors: errors.array() }) };
  }
  return { hasErrors: false };
};

export const addAccountMember = async (req, res) => {
  const { hasErrors, response } = await validateMemberInput(req, res);
  if (hasErrors) return response;

  try {
    const { user_id, role_id, account_id } = req.body;

    const member = new AccountMember({
      user_id,
      role_id,
      account_id,
      created_by: req.user?.email
    });

    await member.save();
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add member', error });
  }
};

export const getAccountMembers = async (req, res) => {
  try {
    const members = await AccountMember.find().populate('user_id role_id');
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching members', error });
  }
};
