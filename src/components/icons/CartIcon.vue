<template>
    <svg
      :class="iconClasses"
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      @click="onClick"
      @dragstart="onDragStart"
      draggable="true"
    >
      <path
        :style="{ fill, stroke }"
        d="M7 4h14l-1.68 8.39c-.16.8-.87 1.38-1.68 1.38H9.59l-.31 1.57h10.22v2H8c-.48 0-.93-.21-1.24-.58-.31-.37-.44-.86-.34-1.33l.52-2.66L5.82 3H2V1h4.18c.46 0 .87.31.97.76L7 4zm0 14c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm10 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"
      />
    </svg>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    size: {
      type: [Number, String],
      default: 24
    },
    fill: {
      type: String,
      default: 'currentColor'
    },
    stroke: {
      type: String,
      default: 'none'
    },
    isActive: {
      type: Boolean,
      default: false
    }
  })
  
  function onClick (event) {
  }
  
  function onDragStart (event) {
  }
  
  const iconClasses = computed(() => ({
    icon: true,
    'icon--active': props.isActive
  }))
  </script>
  
  <style scoped lang="scss">
  .icon {
    cursor: pointer;
    transition: transform 0.3s ease, fill 0.3s ease;
  
    &:hover {
      transform: scale(1.1);
    }
  
    &--active {
      fill: #f00; 
      transform: rotate(10deg);
    }
  }
  </style>
  