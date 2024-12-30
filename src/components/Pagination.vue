<template>
  <div class="flex gap-4">
    <button v-if="currentPage !== 1" @click="goToPage(1)"><<</button>
    <button v-if="currentPage !== 1" @click="goToPage(currentPage - 1)">
      <
    </button>

    <button v-if="pagesToShow[0] !== 1" @click="goToPage(1)">1</button>
    <span v-if="pagesToShow[0] !== 1">...</span>

    <button
      :class="[
        currentPage === page
          ? 'bg-[#cacaca] color-white px-3 py-1 rounded-[1rem]'
          : '',
      ]"
      v-for="page in pagesToShow"
      :key="page"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>
    <span v-if="pagesToShow[pagesToShow.length - 1] !== totalPages">...</span>
    <button
      v-if="pagesToShow[pagesToShow.length - 1] !== totalPages"
      @click="goToPage(totalPages)"
    >
      {{ totalPages }}
    </button>

    <button
      v-if="currentPage !== totalPages"
      @click="goToPage(currentPage + 1)"
    >
      >
    </button>
    <button v-if="currentPage !== totalPages" @click="goToPage(totalPages)">
      >>
    </button>
  </div>
</template>
<script setup>
import { computed, onMounted, watch } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:currentPage"]);
const pagesToShow = computed(() => {
  const maxPagesToShow = 5;
  const pages = [];

  if (props.totalPages <= maxPagesToShow) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else if (props.currentPage <= Math.ceil(maxPagesToShow / 2)) {
    for (let i = 1; i <= maxPagesToShow; i++) {
      pages.push(i);
    }
  } else if (
    props.currentPage >
    props.totalPages - Math.floor(maxPagesToShow / 2)
  ) {
    for (
      let i = props.totalPages - maxPagesToShow + 1;
      i <= props.totalPages;
      i++
    ) {
      pages.push(i);
    }
  } else {
    const startPage = props.currentPage - Math.floor(maxPagesToShow / 2);
    const endPage = props.currentPage + Math.floor(maxPagesToShow / 2);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }

  return pages;
});

function goToPage(page) {
  if (page >= 1 && page <= props.totalPages) {
    emit("update:currentPage", page);
  }
}
</script>
