import 'dotenv/config';
import express from 'express';
import { ClientError, errorMiddleware, authMiddleware } from './lib';
import { User, Auth, userSignIn, userSignUp, TokenUser } from './user';
import {
  Account,
  createAccount,
  getAccountsByUserId,
  getAccountByAccountId,
  updateAccount,
  deleteAccount,
} from './account';
import { getAllVMs, VirtualMachine } from './virtual-machines';
import { Bucket, getAllBuckets } from './object-storage';

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const user = (await userSignUp(username, password)) as User;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const tokenUser = (await userSignIn(username, password)) as TokenUser;
    res.json(tokenUser);
  } catch (err) {
    next(err);
  }
});

app.get('/api/accounts', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) throw new ClientError(403, 'user not logged in');
    const accounts = (await getAccountsByUserId(req.user.userId)) as Account[];
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

app.get('/api/accounts/:accountId', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) throw new ClientError(403, 'user not logged in');
    const { accountId } = req.params;
    if (!Number.isInteger(+accountId)) {
      throw new ClientError(400, 'accountId needs to be a number');
    }

    const account = (await getAccountByAccountId(
      req.user?.userId,
      +accountId
    )) as Account;
    if (!account) {
      return res.status(404).json({ error: 'account not found' });
    }
    res.status(200).json(account);
  } catch (err) {
    next(err);
  }
});

app.post('/api/accounts', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) throw new ClientError(403, 'user not logged in');
    const createdAccount = (await createAccount(
      req.user.userId,
      req.body
    )) as Account;
    res.status(201).json(createdAccount);
  } catch (err) {
    next(err);
  }
});

app.put('/api/accounts/:accountId', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) throw new ClientError(403, 'user not logged in');

    const { accountId } = req.params;
    if (!Number.isInteger(+accountId)) {
      throw new ClientError(400, 'accountId needs to be a number');
    }

    const updatedAccount = (await updateAccount(
      req.user.userId,
      +accountId,
      req.body
    )) as Account;
    if (!updatedAccount) {
      throw new ClientError(404, 'Entry not found');
    }
    res.status(200).json(updatedAccount);
  } catch (err) {
    next(err);
  }
});

app.delete(
  '/api/accounts/:accountId',
  authMiddleware,
  async (req, res, next) => {
    try {
      if (!req.user) throw new ClientError(403, 'user not logged in');

      const { accountId } = req.params;
      if (!Number.isInteger(+accountId)) {
        throw new ClientError(400, 'accountId needs to be a number');
      }

      const deletedAccount = (await deleteAccount(
        req.user.userId,
        +accountId
      )) as Account;
      if (!deletedAccount) {
        throw new ClientError(404, 'Account not found');
      }
      res.status(204).json(deletedAccount);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/inventory/virtual-machines',
  authMiddleware,
  async (req, res, next) => {
    try {
      if (!req.user) throw new ClientError(403, 'user not logged in');
      const accounts = (await getAccountsByUserId(
        req.user.userId
      )) as Account[];
      const { refresh } = req.query;
      const virtualMachines = (await getAllVMs(
        accounts,
        `${refresh}`
      )) as VirtualMachine[];
      res.json(virtualMachines);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/inventory/object-storage',
  authMiddleware,
  async (req, res, next) => {
    try {
      if (!req.user) throw new ClientError(403, 'user not logged in');
      const accounts = (await getAccountsByUserId(
        req.user.userId
      )) as Account[];
      const { refresh } = req.query;
      const buckets = (await getAllBuckets(accounts, `${refresh}`)) as Bucket[];
      res.json(buckets);
    } catch (err) {
      next(err);
    }
  }
);

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
