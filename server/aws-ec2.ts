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
  const tagArr = [];
  for (const tag of tags)
    if (tag.Key && tag.Value) tagArr.push(`"${tag.Key}":"${tag.Value}"`);
  return tagArr.join(',');
}

export async function getAllAwsVmInstances(
  account: Account
): Promise<VirtualMachine[]> {
  const VMsInfo: VirtualMachine[] = [];

  // regions to scan
  const regions = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2'];
  for (const region of regions) {
    const client = new EC2Client({
      region,
      credentials: {
        accessKeyId: decryptText(account.credentialIdentity),
        secretAccessKey: decryptText(account.credentialSecret),
      },
    });

    const command = new DescribeInstancesCommand();
    const response = await client.send(command);
    // EC2 response is organized as reservations of instances
    const { Reservations } = response;
    if (Reservations) {
      for (const reservation of Reservations) {
        const instanceList = [];
        instanceList.push(...(reservation.Instances ?? []));

        for (const instance of instanceList) {
          VMsInfo.push({
            name: getNameTagValue(instance.Tags ?? []) ?? '',
            provider: 'AWS',
            account: account.account,
            region,
            zone: instance.Placement?.AvailabilityZone ?? '',
            instanceId: instance.InstanceId ?? '',
            vpcId: instance.VpcId ?? '',
            subnetId: instance.SubnetId ?? '',
            instanceState: instance.State?.Name ?? '',
            instanceType: instance.InstanceType ?? '',
            instanceOs: instance.PlatformDetails ?? '',
            privateIp: instance.PrivateIpAddress ?? '',
            publicIp: instance.PublicIpAddress ?? '',
            tags: getTags(instance.Tags ?? []) ?? '',
            launchTime: instance.LaunchTime,
            lastSeen: new Date(),
          });
        }
      }
    }
  }

  return VMsInfo;
}
