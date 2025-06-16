// server/routes/admin.routes.js
import express from 'express';

import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';
import { createAccount, deleteAccount, getAllAccounts, searchAccounts, updateAccount } from '../controller/account.controller.js';
import { createDestination, getDestinations, searchDestinations, updateDestination } from '../controller/destination.controller.js';
import { addAccountMember, getAccountMembers } from '../controller/accountmember.js';
import { getLogs } from '../controller/logs.controller.js';

const router = express.Router();
const adminOnly = [authenticateToken, authorizeRoles('Admin')];
const adminOrUser = [authenticateToken, authorizeRoles('Admin', 'User')];

router.post('/accounts', adminOnly, createAccount);           
router.get('/accounts', adminOrUser, getAllAccounts);           
router.put('/accounts/:id', adminOrUser, updateAccount);       
router.delete('/accounts/:id', adminOnly, deleteAccount);      

router.post('/destinations', adminOnly, createDestination);    
router.get('/destinations', adminOrUser, getDestinations);      
router.put('/destinations/:id', adminOrUser, updateDestination);

router.post('/account-members', adminOnly, addAccountMember);  
router.get('/account-members', adminOrUser, getAccountMembers); 
router.get('/find-accounts', authenticateToken, searchAccounts);
// router.get('/find-destinations', authenticateToken, searchDestinations);

router.get('/logs', adminOrUser, getLogs);                      

export default router;
