<template>
  <div class="relative inline-block text-left">
    <button
      @click="toggleDropdown"
      class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
    >
      {{ selectedOption }}
      <svg
        class="-mr-1 ml-2 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="origin-top-right absolute right-0 mt-2 w-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div class="py-1">
        <button
          v-for="option in options"
          :key="option"
          @click="selectOption(option)"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          {{ option }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

import { ref } from "vue";
const isOpen = ref(false);
const selectedOption = ref(props.modelValue);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectOption(option) {
  selectedOption.value = option;
  emit("update:modelValue", option);
  isOpen.value = false;
}
</script>
