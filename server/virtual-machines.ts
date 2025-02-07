import { db } from './db';
import { Account } from './account';
import { getAllAwsVmInstances } from './aws-ec2';
import { getAllGcpVmInstances } from './gcp-compute-engine';

export type VirtualMachine = {
  name: string;
  provider: string;
  account: string;
  region: string;
  zone: string;
  instanceId: string;
  vpcId: string;
  subnetId: string;
  instanceState: string;
  instanceType: string;
  instanceOs: string;
  privateIp: string;
  publicIp: string;
  tags: string;
  launchTime: Date | undefined;
  lastSeen: Date;
};

async function dbSelectAccountVMs(
  accountId: number
): Promise<VirtualMachine[]> {
  const sql = `
    select "v"."name", "provider", "a"."name" as "accountName", "account",
    "instanceId", "region", "zone", "vpcId", "subnetId", "instanceState",
    "instanceType", "instanceOs", "privateIp", "publicIp", "tags",
    "launchTime", "lastSeen"
      from "virtualMachines" as "v"
      join "accounts" as "a" using ("accountId")
     where "accountId" = $1
     order by "virtualMachineId";
  `;
  const result = await db.query<VirtualMachine>(sql, [accountId]);
  return result.rows;
}

async function dbWriteVMs(
  accountId: number,
  virtualMachines: VirtualMachine[]
): Promise<void> {
  for (const vm of virtualMachines) {
    const sql = `
      insert into "virtualMachines" ("accountId", "name", "instanceId",
      "region", "zone", "vpcId", "subnetId", "instanceState", "instanceType",
      "instanceOs", "privateIp", "publicIp", "tags", "launchTime", "lastSeen")
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      on conflict ("instanceId")
      do update set "updatedAt"         = now(),
                    "name"              = $2,
                    "instanceState"     = $8,
                    "instanceType"      = $9,
                    "instanceOs"        = $10,
                    "privateIp"         = $11,
                    "publicIp"          = $12,
                    "tags"              = $13,
                    "launchTime"        = $14,
                    "lastSeen"          = $15
      returning *;
    `;
    const params = [
      accountId,
      vm.name,
      vm.instanceId,
      vm.region,
      vm.zone,
      vm.vpcId,
      vm.subnetId,
      vm.instanceState,
      vm.instanceType,
      vm.instanceOs,
      vm.privateIp,
      vm.publicIp,
      vm.tags,
      vm.launchTime,
      vm.lastSeen,
    ];
    await db.query<VirtualMachine>(sql, params);
  }
}

export async function getAllVMs(
  accounts: Account[],
  refresh: string | undefined
): Promise<VirtualMachine[]> {
  let virtualMachines = [];

  if (refresh === 'yes') {
    for (const account of accounts) {
      switch (account.provider) {
        case 'AWS':
          virtualMachines.push(...(await getAllAwsVmInstances(account)));
          break;
        case 'GCP':
          virtualMachines.push(...(await getAllGcpVmInstances(account)));
          break;
      }
      await dbWriteVMs(account.accountId, virtualMachines);
    }
  }

  virtualMachines = [];
  for (const account of accounts) {
    virtualMachines.push(...(await dbSelectAccountVMs(account.accountId)));
  }

  return virtualMachines;
}
