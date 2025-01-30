import { db } from './db';
import { Account } from './account';
import { getAllAwsVmInstances } from './aws';
import { getAllGcpVmInstances } from './gcp';

export type VirtualMachine = {
  name: string;
  instanceId: string;
  region: string;
  vpcId: string;
  subnetId: string;
  state: string;
  type: string;
  os: string;
  privateIp: string;
  publicIp: string;
  tags: string;
  launchTime: Date | undefined;
};

async function dbWriteVMs(
  accountId: number,
  virtualMachines: VirtualMachine[]
): Promise<void> {
  for (const vm of virtualMachines) {
    const sql = `
      insert into "virtualMachines" ("accountId", "name", "instanceId",
      "region", "vpcId", "subnetId", "state", "type", "os", "privateIp",
      "publicIp", "tags", "launchTime")
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      on conflict ("instanceId")
      do update set "name"              = $2,
                    "state"             = $7,
                    "type"              = $8,
                    "os"                = $9,
                    "privateIp"         = $10,
                    "publicIp"          = $11,
                    "tags"              = $12,
                    "launchTime"        = $13
      returning *;
    `;
    const params = [
      accountId,
      vm.name,
      vm.instanceId,
      vm.region,
      vm.vpcId,
      vm.subnetId,
      vm.state,
      vm.type,
      vm.os,
      vm.privateIp,
      vm.publicIp,
      vm.tags,
      vm.launchTime,
    ];
    await db.query(sql, params);
  }
}

export async function getAllVMs(
  accounts: Account[]
): Promise<VirtualMachine[]> {
  const virtualMachines = [];
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
  return virtualMachines;
}
