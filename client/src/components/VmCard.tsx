import { FiExternalLink } from 'react-icons/fi';
import { VirtualMachine } from '../lib';

type Props = {
  vm: VirtualMachine | undefined;
};

export function VmCard({ vm }: Props) {
  if (!vm)
    return (
      <div className="border-2 border-base-300 p-4">
        Select an item for more details.
      </div>
    );

  return (
    <div className="border-2 border-base-300 p-4">
      <h3 className="font-bold text-2xl">Details</h3>
      <div>
        <span className="font-bold">Name:</span> {vm.name}{' '}
        <a
          className="link"
          href={
            vm.provider === 'AWS'
              ? `https://${vm.region}.console.aws.amazon.com/ec2/home?region=${vm.region}#InstanceDetails:instanceId=${vm.instanceId}`
              : `https://console.cloud.google.com/compute/instancesDetail/zones/${vm.zone}/instances/${vm.name}?project=${vm.account}`
          }
          target="_blank">
          <FiExternalLink className="inline pb-1" />
        </a>
      </div>
      <div>
        <span className="font-bold">Provider:</span> {vm.provider}
      </div>
      <div>
        <span className="font-bold">Account:</span> {vm.accountName}
      </div>
      <div>
        <span className="font-bold">Region:</span> {vm.region}
      </div>
      <div>
        <span className="font-bold">Instance ID:</span> {vm.instanceId}
      </div>
      <div>
        <span className="font-bold">VPC ID:</span> {vm.vpcId}
      </div>
      <div>
        <span className="font-bold">Subnet ID:</span> {vm.subnetId}
      </div>
      <div>
        <span className="font-bold">State:</span> {vm.instanceState}
      </div>
      <div>
        <span className="font-bold">Instance Type:</span> {vm.instanceType}
      </div>
      <div>
        <span className="font-bold">Private IP:</span> {vm.privateIp}
      </div>
      <div>
        <span className="font-bold">Public IP:</span> {vm.publicIp}
      </div>
      <div>
        <span className="font-bold">Tags:</span> {vm.tags}
      </div>
      <div>
        <span className="font-bold">Launch Time:</span> {`${vm.launchTime}`}
      </div>
      {/* <div>
        <span className="font-bold">Last Seen:</span> null
      </div> */}
    </div>
  );
}
