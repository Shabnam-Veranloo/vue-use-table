import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import UserTable from "../pages/UserTable.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Table",
    component: UserTable,
    props: (route) => ({
      name: route.query.name || "",
      phone: route.query.phone || "",
      address: route.query.address || "",
      sortKey: route.query.sortKey || "",
      sortDirection: parseInt(route.query.sortDirection as string) || 1,
      page: parseInt(route.query.page as string) || 1,
      pageSize: parseInt(route.query.pageSize as string) || 10,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
