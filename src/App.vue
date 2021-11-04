<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header style="padding: 0 10px">
      <img src="./assets/logo.png" style="height: 100%; object-fit: contain" />
      <span style="color: #ffff; font-size: 120%">
        <strong> Caprover Deployer</strong>
      </span>
    </a-layout-header>
    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
          <a-menu-item key="1">
            <router-link to="/">
              <rocket-outlined />
              <span>Deploy</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link to="/deployments">
              <cloud-server-outlined />
              <span>Deployments</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link to="/settings">
              <setting-outlined />
              <span>Settings</span>
            </router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div
          :style="{ padding: '24px', background: '#fff', minHeight: '360px' }"
        >
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import {
  RocketOutlined,
  CloudServerOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
export default defineComponent({
  components: {
    RocketOutlined,
    CloudServerOutlined,
    SettingOutlined,
  },
  data() {
    return {
      collapsed: ref<boolean>(false),
      selectedKeys: ref<string[]>(["1"]),
    };
  },
});
</script>
<style>
.site-layout .site-layout-background {
  background: #fff;
}
[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}
</style>
