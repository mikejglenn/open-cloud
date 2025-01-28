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
  for (const vm of virtualMachines) {
    const sqlCheckIId = `
      select * from "virtualMachines"
       where "instanceId" = $1;
    `;
    const paramsCheckIId = [vm.instanceId];
    const resultCheckIId = await db.query(sqlCheckIId, paramsCheckIId);
    if (resultCheckIId.rows) {
      const sqlUpdateVM = `
        update "virtualMachines"
           set "name"              = $2,
               "state"             = $3,
               "type"              = $4,
               "os"                = $5,
               "privateIp"         = $6,
               "publicIp"          = $7,
               "tags"              = $8,
               "launchTime"        = $9
         where "instanceId" = $1
         returning *;
      `;
      const paramsUpdateVM = [
        vm.instanceId,
        vm.name,
        vm.state,
        vm.type,
        vm.os,
        vm.privateIp,
        vm.publicIp,
        vm.tags,
        vm.launchTime,
      ];
      await db.query(sqlUpdateVM, paramsUpdateVM);
    } else {
      const sqlCreateVM = `
          insert into "virtualMachines" ("accountId", "name", "instanceId",
          "region", "vpcId", "subnetId", "state", "type", "os", "privateIp",
          "publicIp", "tags", "launchTime")
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          returning *;
        `;
      const paramsCreateVM = [
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
      await db.query(sqlCreateVM, paramsCreateVM);
    }
  }
}

export async function getAllVMs(account: Account): Promise<VirtualMachine[]> {
  const virtualMachines = await getAllEC2Instances(account);
  await dbWriteVMs(account.accountId, virtualMachines);
  return virtualMachines;
}
