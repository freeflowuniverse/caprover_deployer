
<template>
  <a-alert
    v-if="needConfig"
    message="Warning"
    description="Please complete grid configuration first (from Settings)"
    type="warning"
    show-icon
  />
  <a-spin :spinning="loading" v-if="!needConfig">
    <a-form
      ref="formRef"
      :model="deployParams"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item ref="node_id" label="Node ID" name="node_id">
        <a-input-number v-model:value="deployParams.node_id" />
      </a-form-item>
      <a-form-item ref="cpu" label="CPU cores" name="cpu">
        <a-input-number v-model:value="deployParams.cpu" />
      </a-form-item>
      <a-form-item ref="memory" label="Memory" name="memory">
        <a-input
          v-model:value="deployParams.memory"
          addonAfter="MB"
          style="width: 25%"
        />
      </a-form-item>
      <a-form-item ref="disk_size" label="Disk size" name="disk_size">
        <a-input
          v-model:value="deployParams.disk_size"
          addonAfter="GB"
          style="width: 25%"
        />
      </a-form-item>
      <a-form-item ref="domain" label="Domain" name="domain">
        <a-input v-model:value="deployParams.domain" />
      </a-form-item>
      <a-form-item ref="public_key" label="Public key" name="public_key">
        <a-textarea v-model:value="deployParams.public_key" />
      </a-form-item>
      <a-collapse>
        <a-collapse-panel key="1" header="Grid configuration">
          <a-form-item ref="twin_id" label="Twin ID" name="twin_id">
            <a-input-number v-model:value="deployParams.twin_id" />
          </a-form-item>
          <a-form-item ref="mnemonics" label="Mnemonics" name="mnemonics">
            <a-input-password v-model:value="deployParams.mnemonics" />
          </a-form-item>
          <hr />
          <div style="height: 20" />
          <a-form-item ref="url" label="URL" name="url">
            <a-input v-model:value="deployParams.url" />
          </a-form-item>
          <a-form-item ref="proxy_url" label="Proxy URL" name="proxy_url">
            <a-input v-model:value="deployParams.proxy_url" />
          </a-form-item>
        </a-collapse-panel>
      </a-collapse>
      <hr />
      <div style="height: 20" />
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">Depoly</a-button>
      </a-form-item>
    </a-form>
  </a-spin>
</template>
<script lang="ts">
import { message, Modal } from "ant-design-vue";
import { reactive, ref, toRaw, h, defineComponent, onMounted } from "vue";
import type { UnwrapRef } from "vue";

import { rules as settingsRules } from "./Settings.vue";
import { DEFAULT_GRID_CONFIG, GridConfig, loadConfig } from "@/config";
import { deployNode } from "@/deployer";

interface MachineParams {
  node_id: number;
  cpu: number;
  memory: number;
  disk_size: number;
  domain: string;
  public_key: string;
}

type DeployParams = MachineParams | GridConfig;
const DEFAULT_MACHINE_PARAMS = {
  node_id: undefined,
  cpu: 2,
  memory: 4096,
  disk_size: 40,
  public_key: undefined,
};

export default defineComponent({
  setup() {
    const needConfig = ref<any>(true);
    const loading = ref<boolean>(true);
    const formRef = ref();
    const defaultDeployParams = Object.assign(
      DEFAULT_GRID_CONFIG,
      DEFAULT_MACHINE_PARAMS
    );

    const deployParams: UnwrapRef<DeployParams> = reactive(defaultDeployParams);

    const rules = Object.assign(settingsRules, {
      node_id: [
        {
          required: true,
          message: "Please select a node",
        },
        {
          type: "number",
        },
      ],
      cpu: [
        {
          required: true,
          message: "Please set no. of CPU cores",
        },
        {
          type: "number",
        },
      ],
      memory: [
        {
          required: true,
          message: "Please set memory size",
        },
        {
          type: "number",
        },
      ],
      disk_size: [
        {
          required: true,
          message: "Please choose a disk dize",
        },
        {
          type: "number",
        },
      ],
      domain: [
        {
          required: true,
          message:
            "Please enter the root domain for caprover e.g. apps.example.com",
        },
        {
          pattern:
            /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}$)/,
          message: "Please enter a valid domain name",
        },
      ],
      public_key: [
        {
          required: true,
          message:
            "Please enter your public key to be able to access this nodePlease choose a default proxy URL",
        },
      ],
    });

    onMounted(async () => {
      loading.value = true;
      try {
        const config: GridConfig = await loadConfig();
        deployParams.twin_id = config.twin_id;
        deployParams.mnemonics = config.mnemonics;
        deployParams.url = config.url;
        deployParams.proxy_url = config.proxy_url;

        needConfig.value = !(
          config.twin_id &&
          config.mnemonics.length &&
          config.url &&
          config.proxy_url
        );
      } catch (error: any) {
        message.error(`Loading of configurations failed: ${error.toString()}`);
      } finally {
        loading.value = false;
      }
    });

    const onSubmit = async () => {
      await formRef.value.validate();

      loading.value = true;
      try {
        const params = toRaw(deployParams);
        console.log(params);
        const result = await deployNode(params);

        const ids = result.contracts.created.map(
          (contract) => contract.contract_id
        );

        Modal.info({
          title: "Success",
          content: h("div", {}, [
            h("span", "Deployed a worker node with contract ID(s) of:"),
            h("br"),
            h("b", ids.join(",")),
          ]),
        });
      } catch (error: any) {
        Modal.error({
          title: "Error",
          content: h("div", {}, [
            h("span", "An error occurred while trying to deploy a worker node"),
            h("br"),
            h("span", error.toString()),
          ]),
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      formRef,
      needConfig,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      deployParams,
      rules,
      loading,
      onSubmit,
    };
  },
});
</script>
