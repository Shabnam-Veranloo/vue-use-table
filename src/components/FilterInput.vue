<template>
  <div class="flex gap-1 items-center">
    <span>{{ label }}:</span>
    <input
      class="border-[.1rem] min-w-[20vh] min-h-[2rem] p-2 rounded-[.4rem]"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    required: true,
  },
});
</script>
