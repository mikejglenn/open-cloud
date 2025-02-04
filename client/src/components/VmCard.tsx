import { VirtualMachine } from '../lib';

type Props = {
  vm: VirtualMachine | undefined;
};

export function VmCard({ vm }: Props) {
  if (!vm)
    return (
      <div className="border-2 border-base-300 p-2">
        Select an item for more details.
      </div>
    );

  return (
    <div className="border-2 border-base-300 p-2">
      <h3 className="font-bold text-2xl">Details</h3>
      <div>
        <span className="font-bold">Name:</span> {vm.name}
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
      <div>
        <span className="font-bold">Last Seen:</span> null
      </div>
    </div>
  );
}
