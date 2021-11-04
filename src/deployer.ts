import {
  DeleteMachineModel,
  Deployment,
  DiskModel,
  generateString,
  GridClient,
  MachineModel,
  MachinesDeleteModel,
  MachinesGetModel,
  MachinesModel,
  NetworkModel,
} from "grid3_client";
import { HTTPMessageBusClient } from "ts-rmb-http-client";
import { Ref } from "vue";
import { GridConfig } from "./config";

// the following flist contains the latest caprover frontend
// at https://github.com/freeflowuniverse/caprover-frontend/tree/tfgrid
const CAORIVER_FLIST = "https://hub.grid.tf/samehabouelsaad.3bot/tf-caprover-main-a4f186da8d.flist";
const clients: { [key: string]: GridClient } = {}
interface CaproverDeployment {
  name: string;
  ip: string,
  created: number,
  domain: string
}

function getKey(config: GridConfig) {
  return `${config.twin_id}${config.mnemonics}${config.url}${config.proxy_url}`
}

export async function getClient(config: GridConfig): Promise<GridClient> {
  const key = getKey(config)
  if (clients[key]) {
    return clients[key]
  }

  const rmbClient = new HTTPMessageBusClient(
    config.twin_id,
    config.proxy_url
  );

  const client = new GridClient(config.url, config.mnemonics, rmbClient);
  await client.connect()
  clients[key] = client
  return client
}

export async function listDeployments(params: any): Promise<CaproverDeployment[]> {
  const client = await getClient(params)
  const result = await client.machines.list()

  const deployments: CaproverDeployment[] = []

  for (const name of result) {
    const machineDeployments = await client.machines.getObj(name)
    // caprover deployment would only contain 1 machine
    const deployment: any = machineDeployments[0];
    deployments.push({
      name: name,
      ip: deployment.publicIP.ip,
      created: deployment.created,
      domain: deployment.env.CAPROVER_ROOT_DOMAIN
    })
  }

  return deployments
}

export async function destroyDeployment(params: any) {
  const client = await getClient(params)
  const req = new MachinesDeleteModel()
  req.name = params.name
  return client.machines.delete(req)
}

export async function deployNode(params: any) {
  const gridClient = await getClient(params)

  const machines = new MachinesModel();

  // names can be generated then use list/get if needed
  machines.name = params.name; // should be unique? because of deployment hash or local storage
  const network = new NetworkModel();
  // should generate a new name to prevent network updates which take more time
  // we can keep the same network name if we need newly added machines to be reachable from the same network
  network.name = `caprover_network_${generateString(10)}`;
  network.ip_range = "10.200.0.0/16";
  machines.network = network;

  const machine = new MachineModel();
  machine.cpu = params.cpu;
  machine.memory = params.memory;

  const disk0 = new DiskModel();
  disk0.name = "data0";
  disk0.size = params.disk_size;
  disk0.mountpoint = "/var/lib/docker";
  machine.disks = [disk0];

  machine.node_id = params.node_id;
  machine.public_ip = true;
  machine.name = `caprover_leader_${generateString(20)}`;
  machine.planetary = false;
  machine.flist = CAORIVER_FLIST;
  machine.qsfs_disks = [];
  machine.rootfs_size = 10;
  machine.entrypoint = "/sbin/zinit init";
  machine.env = {
    SWM_NODE_MODE: "leader",
    CAPROVER_ROOT_DOMAIN: params.domain,
    PUBLIC_KEY: params.public_key
  };

  machines.machines = [machine];
  machines.description = "caprover leader machine/node";

  // try {
  //   return await gridClient.machines.deploy(machines);
  // } catch (error: any) {
  //   throw error
  // } finally {
  //   // disconnect is not implemented for now
  //   // gridClient.disconnect()
  // }

  return gridClient.machines.deploy(machines)
}


export function createLogsEventListener(holder: Ref<string>) {
  return (msg: any) => {
    let value;

    if (msg instanceof Object) {
      value = "";
    } else {
      value = msg.toString();
    }
    holder.value = value;
  };
}
