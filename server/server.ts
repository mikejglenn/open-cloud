import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ClientError, errorMiddleware } from './lib/index.js';
import { decryptText } from './ crypto-text.js';
import { DescribeInstancesCommand, EC2Client, Tag } from '@aws-sdk/client-ec2';

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};
type Auth = {
  username: string;
  password: string;
};
type Account = {
  accountId: number;
  userId: number;
  name: string;
  provider: string;
  account: string;
  accessKey: string;
  secretKey: string;
};

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

// User management
app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "hashedPassword")
      values ($1, $2)
      returning "userId", "username", "createdAt";
    `;
    const params = [username, hashedPassword];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
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
    const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1;
  `;
    const params = [username];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username };
    const token = jwt.sign(payload, hashKey);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

async function getAccountByAccountId(accountId: number): Promise<Account> {
  const sql = `
      select *
        from "accounts"
      where "accountId" = $1;
    `;
  const result = await db.query<Account>(sql, [accountId]);
  const account = result.rows[0];
  return account;
}

function getNameTagValue(tags: Tag[]): Tag['Value'] {
  if (!tags) {
    return '';
  }
  for (const tag of tags) {
    if (tag.Key === 'Name') {
      return tag.Value;
    }
  }
  return '';
}

// function getTags(tags: Tag[]): string {
//   if (tags === null) {
//     return '';
//   }
//   const tagDict: Record<string, string> = {};
//   for (const tag of tags) {
//     tagDict[tag.Key] = tag.Value;
//   }
//   return JSON.stringify(tagDict);
// }

app.get('/api/aws/virtual-machines', async (req, res, next) => {
  try {
    const account = await getAccountByAccountId(1);
    const client = new EC2Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: decryptText(account.accessKey),
        secretAccessKey: decryptText(account.secretKey),
      },
    });
    const instanceList = [];
    const command = new DescribeInstancesCommand();
    const response = await client.send(command);
    const { Reservations } = response;
    if (Reservations) {
      for (const reservation of Reservations) {
        instanceList.push(...(reservation.Instances ?? []));
      }
    }
    const instancesInfo = [];
    for (const instance of instanceList) {
      instancesInfo.push({
        name: getNameTagValue(instance.Tags ?? []),
        instanceId: instance.InstanceId,
        region: instance.Placement?.AvailabilityZone,
        vpcId: instance.VpcId,
        subnetId: instance.SubnetId,
        state: instance.State?.Name,
        type: instance.InstanceType,
        os: instance.PlatformDetails,
        privateIp: instance.PrivateIpAddress,
        publicIp: instance.PublicIpAddress,
      });
    }
    res.json(instancesInfo);
  } catch (err) {
    next(err);
  }
});

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
