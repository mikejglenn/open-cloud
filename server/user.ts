import argon2 from 'argon2';
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
export type PayloadForToken = {
  userId: number;
  username: string;
};

export async function userSignUp(
  username: string,
  password: string
): Promise<User> {
  const hashedPassword = await argon2.hash(password);
  const sql = `
        insert into "users" ("username", "hashedPassword")
        values ($1, $2)
        returning "userId", "username", "createdAt";
      `;
  const params = [username, hashedPassword];
  const result = await db.query<User>(sql, params);
  const [user] = result.rows;
  return user;
}

export async function userSignIn(
  username: string,
  password: string
): Promise<PayloadForToken> {
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
  return { userId, username };
}
