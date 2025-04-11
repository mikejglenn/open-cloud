import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ClientError } from './lib';
import { db } from './db';

export type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};
export type Auth = {
  username: string;
  password: string;
};
type PayloadForToken = {
  userId: number;
  username: string;
};
export type TokenUser = {
  token: string;
  user: PayloadForToken;
};

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

export async function userSignUp(
  username: string,
  password: string
): Promise<User> {
  const hashedPassword = await argon2.hash(password);
  const sql = `
        INSERT INTO "users" ("username", "hashedPassword")
        VALUES ($1, $2)
        RETURNING "userId", "username", "createdAt";
      `;
  const params = [username, hashedPassword];
  const result = await db.query<User>(sql, params);
  const [user] = result.rows;
  return user;
}

export async function userSignIn(
  username: string,
  password: string
): Promise<TokenUser> {
  const sql = `
    SELECT "userId",
           "hashedPassword"
      FROM "users"
     WHERE "username" = $1;
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
  if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');
  const token = jwt.sign(payload, hashKey);
  return { token, user: payload };
}
