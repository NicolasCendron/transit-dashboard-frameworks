import { createRouter, createWebHistory } from "vue-router";
import TripsList from "@/views/TripsList.vue";
import TripDetails from "@/views/TripDetails.vue";
import TripForm from "@/views/TripForm.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/trips" },
    { path: "/trips", name: "trips", component: TripsList },
    { path: "/trips/new", name: "trip-create", component: TripForm },
    { path: "/trips/:id", name: "trip-details", component: TripDetails },
    { path: "/trips/:id/edit", name: "trip-edit", component: TripForm },
  ],
});

export default router;
