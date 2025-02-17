import compute from '@google-cloud/compute';
import { Account } from './account';
import { decryptText } from './crypto-text';
import { VirtualMachine } from './virtual-machines';

function endSlash(str: string | undefined): string | undefined {
  return str?.split('/').pop();
}

export async function getAllGcpVmInstances(
  account: Account
): Promise<VirtualMachine[]> {
  const VMsInfo: VirtualMachine[] = [];

  const instancesClient = new compute.InstancesClient({
    credentials: {
      client_email: decryptText(account.credentialIdentity),
      private_key: decryptText(account.credentialSecret),
    },
  });

  const aggListRequest = instancesClient.aggregatedListAsync({
    project: account.account, // projectId
  });

  for await (const [zone, instancesObject] of aggListRequest) {
    const instances = instancesObject.instances;

    if (instances && instances.length > 0) {
      for (const instance of instances) {
        VMsInfo.push({
          name: instance.name ?? '',
          provider: 'GCP',
          account: account.account,
          instanceId: instance.id ? `${instance.id}` : '',
          region: endSlash(zone)?.slice(0, -2) ?? '',
          zone: endSlash(zone) ?? '',
          vpcId: endSlash(instance.networkInterfaces?.[0].network ?? '') ?? '',
          subnetId:
            endSlash(instance.networkInterfaces?.[0].subnetwork ?? '') ?? '',
          instanceState: instance.status ?? '',
          instanceType: endSlash(instance.machineType ?? '') ?? '',
          instanceOs: '',
          privateIp: instance.networkInterfaces?.[0].networkIP ?? '',
          publicIp:
            instance.networkInterfaces?.[0].accessConfigs?.[0].natIP ?? '',
          tags: instance.tags?.items?.join(',') ?? '',
          launchTime: instance.creationTimestamp
            ? new Date(instance.creationTimestamp)
            : undefined,
          lastSeen: new Date(),
        });
      }
    }
  }

  return VMsInfo;
}
