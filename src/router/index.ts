import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Deploy from "../components/Deploy.vue";
import Deployments from "../components/Deployments.vue";
import Settings from "../components/Settings.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "deploy",
    component: Deploy,
  },
  {
    path: "/deployments",
    name: "deployments",
    component: Deployments,
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
