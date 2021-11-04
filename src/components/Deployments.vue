<template>
  <a-spin :spinning="loading" :tip="currentEvent">
    <div>
      <a-button
        type="primary"
        :disabled="!hasSelected"
        @click="destroy"
        style="margin-bottom: 8px"
      >
        Destroy
      </a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `Selected ${selectedRowKeys.length} items` }}
        </template>
      </span>
    </div>
    <a-table
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :data-source="data"
    />
  </a-spin>
</template>
<script lang="ts">
import { message, Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import {
  computed,
  createVNode,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import {
  createLogsEventListener,
  destroyDeployment,
  listDeployments,
} from "@/deployer";
import { GridConfig, loadConfig } from "@/config";
import { events } from "grid3_client";

interface DataType {
  key: any;
  name: string;
  ip: string;
  domain: string;
  created: string;
}

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "IP",
    dataIndex: "ip",
  },
  {
    title: "Domain",
    dataIndex: "domain",
  },
  {
    title: "Created",
    dataIndex: "created",
    render(text: any, record: any) {
      console.log("custom renderer");
      console.log(text);
      console.log(record);
      return text;
    },
  },
];

export default defineComponent({
  setup() {
    const currentEvent = ref<string>("");
    const data = ref<DataType[]>([]);
    const state = reactive<{
      selectedRowKeys: any[];
      loading: boolean;
      gridConfig: GridConfig;
    }>({
      selectedRowKeys: [],
      loading: false,
      gridConfig: {
        twin_id: 0,
        mnemonics: "",
        url: "",
        proxy_url: "",
      },
    });

    const hasSelected = computed(() => state.selectedRowKeys.length > 0);

    onMounted(async () => {
      state.loading = true;
      currentEvent.value = "Loading deployments...";
      try {
        state.gridConfig = await loadConfig();
        const deployments = await listDeployments(state.gridConfig);
        for (const deployment of deployments) {
          data.value.push({
            key: deployment.name,
            name: deployment.name,
            ip: deployment.ip,
            domain: deployment.domain,
            created: new Date(deployment.created * 1000).toLocaleString(),
          });
        }
      } catch (error: any) {
        message.error(`Error while loading deployment(s): ${error.toString()}`);
      } finally {
        state.loading = false;
        currentEvent.value = "";
      }
    });

    const destroy = async () => {
      const names = state.selectedRowKeys;

      const eventListener = createLogsEventListener(currentEvent);
      Modal.confirm({
        title: "Do you want to delete destroy selected nodes?",
        icon: createVNode(ExclamationCircleOutlined),
        content: `Please confirm that you want to destroy the following nodes: ${names.join(
          ", "
        )}`,
        async onOk() {
          Modal.destroyAll();
          state.loading = true;
          events.addListener("logs", eventListener);

          try {
            for (const name of names) {
              const params = Object.assign(state.gridConfig, {
                name: name,
              });
              const result = await destroyDeployment(params);
              console.log(result);
            }

            data.value = data.value.filter((item: any) => {
              return !names.includes(item.key);
            });
            state.selectedRowKeys = [];
          } catch (error: any) {
            message.error(
              `Error while destorying selected deployment(s): ${error.toString()}`
            );
          } finally {
            state.loading = false;
            events.removeListener("logs", eventListener);
            currentEvent.value = "";
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() {},
      });
    };

    const onSelectChange = (selectedRowKeys: any[]) => {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };

    return {
      data,
      columns,
      hasSelected,
      currentEvent,
      ...toRefs(state),

      // func
      destroy,
      onSelectChange,
    };
  },
});
</script>
