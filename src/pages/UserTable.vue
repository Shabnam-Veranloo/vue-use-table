<template>
  <div class="flex gap-2 w-full items-center">
    <span class="font-bold">Filters:</span>
    <div class="flex flex-1 justify-between">
      <FilterInput
        label="Name"
        placeholder="Filter by name"
        v-model="filters.name"
      />
      <FilterInput
        label="Phone"
        placeholder="Filter by phone"
        v-model="filters.phone"
      />
      <FilterInput
        label="Address"
        placeholder="Filter by address"
        v-model="filters.address"
      />
    </div>
  </div>
  <div
    class="flex items-start w-full max-h-[70vh] justify-center overflow-y-scroll"
  >
    <table>
      <thead>
        <tr>
          <th></th>
          <th>User ID</th>
          <th @click="sort('name')">
            <div
              class="flex w-full items-center justify-between cursor-pointer"
            >
              <span>Name</span>
              <div
                v-if="sortKey === 'name' && sortDirection === 1"
                class="arrow-up"
              ></div>
              <div
                v-if="sortKey === 'name' && sortDirection === -1"
                class="arrow-down"
              ></div>
            </div>
          </th>
          <th @click="sort('date')">
            <div
              class="flex w-full items-center justify-between cursor-pointer"
            >
              <span>Date of Registration</span>
              <div
                v-if="sortKey === 'date' && sortDirection === 1"
                class="arrow-up"
              ></div>
              <div
                v-if="sortKey === 'date' && sortDirection === -1"
                class="arrow-down"
              ></div>
            </div>
          </th>
          <th>Address</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in paginatedUsers" :key="user.id">
          <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.date }}</td>
          <td>{{ user.address }}</td>
          <td>{{ user.phone }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="w-full flex gap-4 items-center justify-between">
    <div class="flex gap-4 items-center">
      <p>items per page:</p>
      <DropdownModal v-model="pageSize" :options="[10, 15, 20, 30]" />
    </div>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @update:currentPage="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import getData from "../utils/getData.ts";
import FilterInput from "../components/FilterInput.vue";
import Pagination from "../components/Pagination.vue";
import DropdownModal from "../components/DropdownModal.vue";
const route = useRoute();
const router = useRouter();

const mainList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const sortKey = ref("");
const sortDirection = ref(1);
const totalPages = ref(10);
const filteredList = ref([]);

const filters = ref({
  name: "",
  phone: "",
  address: "",
});

function updateUrlParams() {
  let newQuery = {
    ...route.query,
    name: filters.value.name || undefined,
    phone: filters.value.phone || undefined,
    address: filters.value.address || undefined,
    sortKey: sortKey.value || undefined,
    sortDirection: sortDirection.value || undefined,
    page: currentPage.value || undefined,
    pageSize: pageSize.value || undefined,
  };

  router.replace({
    query: Object.fromEntries(
      Object.entries(newQuery).filter(([_, value]) => value !== undefined)
    ),
  });
}

const processedUsers = computed(() => {
  const filtered = mainList.value.filter((user) => {
    const nameMatch = user.name
      .toLowerCase()
      .includes(filters.value.name.toLowerCase());
    const phoneMatch = user.phone.includes(filters.value.phone);
    const addressMatch = user.address
      .toLowerCase()
      .includes(filters.value.address.toLowerCase());
    return nameMatch && phoneMatch && addressMatch;
  });
  filteredList.value = filtered;
  calculateTotalPage();
  const sorted = filtered.sort((a, b) => {
    if (!sortKey.value) return 0;
    const valA = a[sortKey.value];
    const valB = b[sortKey.value];
    return valA > valB
      ? sortDirection.value
      : valA < valB
      ? -sortDirection.value
      : 0;
  });

  return sorted;
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return processedUsers.value.slice(start, end);
});

function sort(key) {
  if (sortKey.value === key) {
    sortDirection.value *= -1;
  } else {
    sortKey.value = key;
    sortDirection.value = 1;
  }
}

function calculateTotalPage() {
  const filterList = filteredList.value;
  const main = mainList.value;

  totalPages.value = Math.ceil(
    (filterList.length < main.length ? filterList.length : main.length) /
      pageSize.value
  );

  if (totalPages.value < currentPage.value) {
    currentPage.value = 1;
  }
}

onMounted(async () => {
  const data = await getData();

  mainList.value = [...data];
  filteredList.value = [...data];

  filters.value = {
    name: route.query.name || "",
    phone: route.query.phone || "",
    address: route.query.address || "",
  };
  currentPage.value = parseInt(route.query.page) || 1;
  sortKey.value = route.query.sortKey || "";
  sortDirection.value = parseInt(route.query.sortDirection) || 1;
  pageSize.value = parseInt(route.query.pageSize) || 10;

  if (!route.query.sortKey) {
    sort("name");
  }
});

watch([filters, sortKey, sortDirection, currentPage], updateUrlParams, {
  deep: true,
});

function handlePageChange(page) {
  currentPage.value = page;
}
</script>
