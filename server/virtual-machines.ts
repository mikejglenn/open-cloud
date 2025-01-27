import { db } from './db';
import { Account } from './account';
import { getAllEC2Instances } from './aws';

export type VirtualMachine = {
  virtualMachineId?: number;
  accountId?: number;
  name?: string;
  instanceId?: string;
  region?: string;
  vpcId?: string;
  subnetId?: string;
  state?: string;
  type?: string;
  os?: string;
  privateIp?: string;
  publicIp?: string;
  tags?: string;
  launchTime?: Date;
  lastSeen?: Date;
};

async function dbWriteVMs(
  accountId: number,
  virtualMachines: VirtualMachine[]
): Promise<void> {
  const sql = `
      insert into "virtualMachines" ("accountId", "name", "instanceId",
      "region", "vpcId", "subnetId", "state", "type", "os", "privateIp",
      "publicIp", "tags", "launchTime")
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      returning *;
    `;
  const params = [
    accountId,
    virtualMachines[0].name,
    virtualMachines[0].instanceId,
    virtualMachines[0].region,
    virtualMachines[0].vpcId,
    virtualMachines[0].subnetId,
    virtualMachines[0].state,
    virtualMachines[0].type,
    virtualMachines[0].os,
    virtualMachines[0].privateIp,
    virtualMachines[0].publicIp,
    virtualMachines[0].tags,
    virtualMachines[0].launchTime,
  ];
  await db.query(sql, params);
}

export async function getAllVMs(account: Account): Promise<VirtualMachine[]> {
  const virtualMachines = await getAllEC2Instances(account);
  await dbWriteVMs(account.accountId, virtualMachines);
  return virtualMachines;
}
