<template>
    <v-alert
      v-if="message"
      :type="type"
      dismissible
      @input="handleDismiss"
    >
      {{ message }}
    </v-alert>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success' // Puede ser 'success', 'error', 'warning', 'info', etc.
    }
  });
  
  const emits = defineEmits(['dismiss']);
  
  const handleDismiss = () => {
    emits('dismiss');
  };
  </script>
  
  <style scoped>
  /* estilos personalizados*/
  </style>
  