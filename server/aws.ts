import { DescribeInstancesCommand, EC2Client, Tag } from '@aws-sdk/client-ec2';
import { Account } from './account';
import { decryptText } from './crypto-text';
import { VirtualMachine } from './virtual-machines';

export function getNameTagValue(tags: Tag[]): Tag['Value'] {
  if (!tags) return '';
  for (const tag of tags) if (tag.Key === 'Name') return tag.Value;
  return '';
}

export function getTags(tags: Tag[]): string {
  if (!tags) return '';
  const tagDict: Record<string, string> = {};
  for (const tag of tags)
    if (tag.Key && tag.Value) tagDict[tag.Key] = tag.Value;
  return JSON.stringify(tagDict);
}

export async function getAllAwsVmInstances(
  account: Account
): Promise<VirtualMachine[]> {
  const client = new EC2Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: decryptText(account.accessKey),
      secretAccessKey: decryptText(account.secretKey),
    },
  });
  const instanceList = [];
  const command = new DescribeInstancesCommand();
  const response = await client.send(command);
  const { Reservations } = response;
  if (Reservations) {
    for (const reservation of Reservations) {
      instanceList.push(...(reservation.Instances ?? []));
    }
  }
  const instancesInfo: VirtualMachine[] = [];
  for (const instance of instanceList) {
    if (instancesInfo) {
      instancesInfo.push({
        name: getNameTagValue(instance.Tags ?? []),
        instanceId: instance.InstanceId,
        region: instance.Placement?.AvailabilityZone,
        vpcId: instance.VpcId,
        subnetId: instance.SubnetId,
        state: instance.State?.Name,
        type: instance.InstanceType,
        os: instance.PlatformDetails,
        privateIp: instance.PrivateIpAddress,
        publicIp: instance.PublicIpAddress,
        tags: getTags(instance.Tags ?? []),
        launchTime: instance.LaunchTime,
      });
    }
  }
  return instancesInfo;
}
