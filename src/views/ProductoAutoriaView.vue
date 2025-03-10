<!-- src/views/ProductoAutoriaView.vue -->
<template>
    <div>
      <h1>Productos Autoria</h1>
      <!-- Botón para refrescar la lista de productos -->
      <button @click="fetchProductos">Refrescar Productos</button>
      
      <!-- Muestra un mensaje mientras se cargan los productos -->
      <div v-if="store.loading">Cargando productos...</div>
      
      <!-- Muestra un mensaje de error si ocurre alguno -->
      <div v-if="store.error" class="error">Error: {{ store.error }}</div>
      
      <!-- Mensaje si no hay productos para mostrar -->
      <div v-if="!store.loading && store.productos.length === 0">
        No hay productos para mostrar.
      </div>
      
      <!-- Contenedor de productos, se renderiza un card por cada producto -->
      <div class="productos-container">
        <ProductoAutoriaCard
          v-for="producto in store.productos"
          :key="producto.id"
          :producto="producto"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue';
  import { useProductoAutoriaStore } from '../stores/productoAutoriaStore';
  import ProductoAutoriaCard from '../components/ProductoAutoriaCard.vue';
  
  // Inicializa el store
  const store = useProductoAutoriaStore();
  
  // Log de inicio de la vista
  console.log("ProductoAutoriaView: Vista cargada");
  
  // Obtiene los productos cuando la vista se monta
  onMounted(() => {
    console.log("ProductoAutoriaView: onMounted - obteniendo productos...");
    store.fetchProductos();
  });
  
  /**
   * Función para refrescar los productos.
   */
  function fetchProductos() {
    console.log("ProductoAutoriaView: Refrescando productos...");
    store.fetchProductos();
  }
  </script>
  
  <style scoped>
  .productos-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 16px;
  }
  .error {
    color: red;
    margin: 8px 0;
  }
  </style>
  