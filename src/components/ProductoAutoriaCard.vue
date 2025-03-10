<!-- src/components/ProductoAutoriaCard.vue -->
<template>
    <div class="card">
      <div class="card-header">
        <h3>{{ producto.titulo }}</h3>
      </div>
      <div class="card-body">
        <p><strong>Autor:</strong> {{ producto.autor }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  /**
   * Define la interfaz del producto.
   */
  interface ProductoAutoria {
    id: number;
    titulo: string;
    autor: string;
  }
  
  /**
   * Define las propiedades que recibe el componente.
   */
  const props = defineProps<{
    producto: ProductoAutoria;
  }>();
  
  // Log para verificar que el componente se carga con la información correcta.
  console.log("ProductoAutoriaCard: Producto recibido", props.producto);
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
  