<!-- src/components/CocheAutoriaCard.vue -->
<template>
    <div class="card">
      <div class="card-header">
        <h3>{{ coche.titulo }}</h3>
      </div>
      <div class="card-body">
        <p><strong>Marca:</strong> {{ coche.autor }}</p>
        <p><strong>Precio:</strong> ${{ coche.precio.toFixed(2) }}</p>
        <p><strong>Descripción:</strong> {{ coche.numeroSerie }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  /**
   * Interfaz que representa un coche con autoría, incluyendo los nuevos campos.
   */
  interface CocheAutoria {
    id: number;
    nombre: string;
    marca: string;
    precio: number;
    descripción: string;
  }
  
  /**
   * Define las propiedades que recibe el componente.
   */
  const props = defineProps<{
    coche: CocheAutoria;
  }>();
  
  // Log para verificar que el componente recibe los datos correctamente.
  console.log("CocheAutoriaCard: Coche recibido", props.coche);
  </script>
  
  <style scoped>
  .card {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 16px;
    margin: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .card-header {
    border-bottom: 1px solid #eee;
    margin-bottom: 8px;
  }
  </style>
  