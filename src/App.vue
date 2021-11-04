<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header style="padding: 0 10px">
      <img src="./assets/logo.png" style="height: 100%; object-fit: contain" />
      <span style="color: #ffff; font-size: 120%">
        <strong> CapRover Deployer</strong>
      </span>
    </a-layout-header>
    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
          <a-menu-item key="deploy">
            <router-link to="/">
              <rocket-outlined />
              <span>Deploy</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="deployments">
            <router-link to="/deployments">
              <cloud-server-outlined />
              <span>Deployments</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="settings">
            <router-link to="/settings">
              <setting-outlined />
              <span>Settings</span>
            </router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content :style="{ margin: '16px 16px 16px 16px' }">
        <div :style="{ padding: '24px', background: '#fff', height: '100%' }">
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
import { computed, defineComponent, ref } from "vue";
import router from "@/router";

export default defineComponent({
  components: {
    RocketOutlined,
    CloudServerOutlined,
    SettingOutlined,
  },

  setup() {
    const selectedKeys = computed(() => {
      return [router.currentRoute.value.name];
    });

    return {
      collapsed: ref<boolean>(false),
      selectedKeys,
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
