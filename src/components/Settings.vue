
<template>
  <a-spin :spinning="loading">
    <a-form
      ref="formRef"
      :model="gridConfig"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item ref="twin_id" label="Twin ID" name="twin_id">
        <a-input-number v-model:value="gridConfig.twin_id" />
      </a-form-item>
      <a-form-item ref="mnemonics" label="Mnemonics" name="mnemonics">
        <a-input-password v-model:value="gridConfig.mnemonics" />
      </a-form-item>
      <hr />
      <div style="height: 20" />
      <a-form-item ref="url" label="URL" name="url">
        <a-input v-model:value="gridConfig.url" />
      </a-form-item>
      <a-form-item ref="proxy_url" label="Proxy URL" name="proxy_url">
        <a-input v-model:value="gridConfig.proxy_url" />
      </a-form-item>
      <a-form-item ref="public_key" label="Public key" name="public_key">
        <a-textarea v-model:value="gridConfig.public_key" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }" :hidden="readOnly">
        <a-button type="primary" @click="onSubmit">Save</a-button>
      </a-form-item>
    </a-form>
  </a-spin>
</template>
<script lang="ts">
import { reactive, ref, toRaw, defineComponent, onMounted, h } from "vue";
import type { UnwrapRef } from "vue";
import { message } from "ant-design-vue";

import {
  loadConfig,
  saveConfig,
  GridConfig,
  DEFAULT_GRID_CONFIG,
} from "../config";

export const rules = {
  twin_id: [
    {
      required: true,
      message: "Please enter your twin ID",
    },
    {
      type: "number",
    },
  ],
  mnemonics: [
    {
      required: true,
      message: "Please enter your mnemonics",
    },
  ],
  url: [
    {
      required: true,
      message: "Please choose a default explorer URL",
    },
  ],
  proxy_url: [
    {
      required: true,
      message: "Please choose a default proxy URL",
    },
  ],
};

export default defineComponent({
  props: {
    readOnly: Boolean,
  },

  setup() {
    const formRef = ref();
    const loading = ref<boolean>(false);

    const gridConfig: UnwrapRef<GridConfig> = reactive(DEFAULT_GRID_CONFIG);

    onMounted(async () => {
      loading.value = true;
      try {
        const config: GridConfig = await loadConfig();
        gridConfig.twin_id = config.twin_id;
        gridConfig.mnemonics = config.mnemonics;
        gridConfig.url = config.url;
        gridConfig.proxy_url = config.proxy_url;
        gridConfig.public_key = config.public_key;
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
        const config = toRaw(gridConfig);
        saveConfig(config);
        message.success("Saved!");
      } catch (error: any) {
        message.error(`Saving of configurations failed: ${error.toString()}`);
      } finally {
        loading.value = false;
      }
    };

    return {
      formRef,
      loading,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      gridConfig,
      rules,
      onSubmit,
    };
  },
});
</script>
