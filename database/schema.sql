set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId" serial PRIMARY KEY,
  "username" text NOT NULL,
  "hashedPassword" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (now()),
  "updatedAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "accounts" (
  "accountId" serial PRIMARY KEY,
  "userId" integer,
  "name" text NOT NULL,
  "provider" text NOT NULL,
  "account" text NOT NULL,
  "credentialIdentity" text NOT NULL,
  "credentialSecret" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (now()),
  "updatedAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "virtualMachines" (
  "virtualMachineId" serial PRIMARY KEY,
  "accountId" integer,
  "name" text NOT NULL,
  "instanceId" text UNIQUE NOT NULL,
  "region" text NOT NULL,
  "vpcId" text NOT NULL,
  "subnetId" text NOT NULL,
  "instanceState" text NOT NULL,
  "instanceType" text NOT NULL,
  "instanceOs" text,
  "privateIp" text NOT NULL,
  "publicIp" text,
  "tags" text,
  "launchTime" timestamptz,
  "lastSeen" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT (now()),
  "updatedAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "buckets" (
  "bucketId" serial PRIMARY KEY,
  "accountId" integer,
  "name" text NOT NULL,
  "region" text NOT NULL,
  "creationDate" timestamptz NOT NULL,
  "lastSeen" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT (now()),
  "updatedAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "vpcNetworks" (
  "vpcNetworkId" serial PRIMARY KEY,
  "accountId" integer,
  "name" text,
  "vpcId" text NOT NULL,
  "region" text NOT NULL,
  "ip4cidr" text NOT NULL,
  "lastSeen" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT (now()),
  "updatedAt" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "accounts" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "virtualMachines" ADD FOREIGN KEY ("accountId") REFERENCES "accounts" ("accountId");

ALTER TABLE "buckets" ADD FOREIGN KEY ("accountId") REFERENCES "accounts" ("accountId");

ALTER TABLE "vpcNetworks" ADD FOREIGN KEY ("accountId") REFERENCES "accounts" ("accountId");
