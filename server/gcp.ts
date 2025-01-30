import compute from '@google-cloud/compute';
import { Account } from './account';
import { decryptText } from './crypto-text';
import { VirtualMachine } from './virtual-machines';

export async function getAllGcpVmInstances(
  account: Account
): Promise<VirtualMachine[]> {
  const VMsInfo: VirtualMachine[] = [];

  const instancesClient = new compute.InstancesClient({
    credentials: {
      client_email: decryptText(account.accessKey),
      private_key: decryptText(account.secretKey),
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
          instanceId: instance.id ? `${instance.id}` : '',
          region: zone.split('/').pop()?.slice(0, -2) ?? '',
          vpcId:
            instance.networkInterfaces?.[0].network?.split('/').pop() ?? '',
          subnetId:
            instance.networkInterfaces?.[0].subnetwork?.split('/').pop() ?? '',
          state: instance.status ?? '',
          type: instance.machineType?.split('/').pop() ?? '',
          os: '',
          privateIp: instance.networkInterfaces?.[0].networkIP ?? '',
          publicIp:
            instance.networkInterfaces?.[0].accessConfigs?.[0].natIP ?? '',
          tags: instance.tags?.items?.join(',') ?? '',
          launchTime: instance.creationTimestamp
            ? new Date(instance.creationTimestamp)
            : undefined,
        });
      }
    }
  }

  return VMsInfo;
}
