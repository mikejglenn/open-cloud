set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId" serial PRIMARY KEY,
  "username" text,
  "hashedPassword" text,
  "createdAt" timestamptz NOT NULL DEFAULT (now()),
  "updatedAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "accounts" (
  "accountId" serial PRIMARY KEY,
  "userId" integer,
  "name" text,
  "provider" text,
  "account" text,
  "accessKey" text,
  "secretKey" text,
  "createdAt" timestamptz NOT NULL DEFAULT (now()),
  "updatedAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "vpcNetworks" (
  "vpcNetworkId" serial PRIMARY KEY,
  "accountId" integer,
  "name" text,
  "vpcId" text,
  "region" text,
  "ip4cidr" text,
  "lastSeen" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT (now()),
  "updatedAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "virtualMachines" (
  "virtualMachineId" serial PRIMARY KEY,
  "accountId" integer,
  "name" text,
  "instanceId" text,
  "region" text,
  "vpcId" text,
  "subnetId" text,
  "state" text,
  "type" text,
  "os" text,
  "privateIp" text,
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
  "name" text,
  "region" text,
  "creationDate" timestamptz,
  "lastSeen" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT (now()),
  "updatedAt" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "accounts" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "vpcNetworks" ADD FOREIGN KEY ("accountId") REFERENCES "accounts" ("accountId");

ALTER TABLE "virtualMachines" ADD FOREIGN KEY ("accountId") REFERENCES "accounts" ("accountId");

ALTER TABLE "buckets" ADD FOREIGN KEY ("accountId") REFERENCES "accounts" ("accountId");
