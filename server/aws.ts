import { DescribeInstancesCommand, EC2Client, Tag } from '@aws-sdk/client-ec2';
import { Account } from './account';
import { decryptText } from './crypto-text';
import { VirtualMachine } from './virtual-machines';

function getNameTagValue(tags: Tag[]): Tag['Value'] {
  if (!tags) return '';
  for (const tag of tags) if (tag.Key === 'Name') return tag.Value;
  return '';
}

function getTags(tags: Tag[]): string {
  if (!tags) return '';
  const tagDict: Record<string, string> = {};
  for (const tag of tags)
    if (tag.Key && tag.Value) tagDict[tag.Key] = tag.Value;
  return JSON.stringify(tagDict);
}

export async function getAllAwsVmInstances(
  account: Account
): Promise<VirtualMachine[]> {
  const VMsInfo: VirtualMachine[] = [];

  const regions = ['us-east-2' /*, 'us-east-1', 'us-west-1', 'us-west-2' */];
  for (const region of regions) {
    const client = new EC2Client({
      region,
      credentials: {
        accessKeyId: decryptText(account.accessKey),
        secretAccessKey: decryptText(account.secretKey),
      },
    });

    const command = new DescribeInstancesCommand();
    const response = await client.send(command);
    const { Reservations } = response;
    if (Reservations) {
      for (const reservation of Reservations) {
        const instanceList = [];
        instanceList.push(...(reservation.Instances ?? []));

        for (const instance of instanceList) {
          VMsInfo.push({
            name: getNameTagValue(instance.Tags ?? []) ?? '',
            instanceId: instance.InstanceId ?? '',
            region: instance.Placement?.AvailabilityZone ?? '',
            vpcId: instance.VpcId ?? '',
            subnetId: instance.SubnetId ?? '',
            state: instance.State?.Name ?? '',
            type: instance.InstanceType ?? '',
            os: instance.PlatformDetails ?? '',
            privateIp: instance.PrivateIpAddress ?? '',
            publicIp: instance.PublicIpAddress ?? '',
            tags: getTags(instance.Tags ?? []) ?? '',
            launchTime: instance.LaunchTime,
          });
        }
      }
    }
  }

  return VMsInfo;
}
