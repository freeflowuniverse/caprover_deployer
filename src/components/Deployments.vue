<template>
  <a-table :dataSource="dataSource" :columns="columns" />
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";

const columns = [
  {
    title: "Contract ID",
    dataIndex: "contract_id",
    key: "contract_id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "IP",
    dataIndex: "ip",
    key: "ip",
  },
];

export default defineComponent({
  setup() {
    const dataSource = ref([]);
    return {
      columns: columns,
      dataSource: [],
    };
  },
});
</script>
