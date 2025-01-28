import compute from '@google-cloud/compute';
// import { Account } from './account';
// import { decryptText } from './crypto-text';
// import { VirtualMachine } from './virtual-machines';

process.env.GOOGLE_APPLICATION_CREDENTIALS = `YOUR_PROJECT_ID.json`;

const projectId = 'YOUR_PROJECT_ID';

// List all instances in the specified project.
export async function getAllGcpVmInstances(): Promise<void> {
  const instancesClient = new compute.InstancesClient();

  // Use the `maxResults` parameter to limit the number of results that the API returns per response page.
  const aggListRequest = instancesClient.aggregatedListAsync({
    project: projectId,
    maxResults: 5,
  });

  console.log('Instances found:');

  // Despite using the `maxResults` parameter, you don't need to handle the pagination
  // yourself. The returned object handles pagination automatically,
  // requesting next pages as you iterate over the results.
  for await (const [zone, instancesObject] of aggListRequest) {
    const instances = instancesObject.instances;

    if (instances && instances.length > 0) {
      console.log(` ${zone}`);
      for (const instance of instances) {
        console.log(` - ${instance.name} (${instance.machineType})`);
      }
    }
  }
}
