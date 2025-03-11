<!-- src/views/CocheAutoriaView.vue -->
<template>
    <div>
      <h1>Coches Autoria</h1>
  
      <!-- Apartado para mostrar la media de los precios -->
      <section class="media-precios" v-if="store.coches.length > 0">
        <h3>Precio Medio: €{{ averagePrice.toFixed(2) }}</h3>
      </section>
  
      <!-- Formulario para crear o actualizar un coche -->
      <section class="formulario">
        <h2>{{ isEditing ? "Editar Coche" : "Agregar Coche" }}</h2>
        <!-- Al enviar el formulario se ejecuta la función submitForm -->
        <form @submit.prevent="submitForm">
          <!-- Campo para el título -->
          <div>
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" v-model="form.nombre" required />
          </div>
          <!-- Campo para el autor -->
          <div>
            <label for="marca">Marca:</label>
            <input type="text" id="marca" v-model="form.marca" required />
          </div>
          <!-- Campo para el precio -->
          <div>
            <label for="precio">Precio:</label>
            <input type="number" id="precio" v-model.number="form.precio" step="0.01" required />
          </div>
          <!-- Campo para el número de serie -->
          <div>
            <label for="descripción">Descripción:</label>
            <input type="text" id="descripción" v-model="form.descripción" required />
          </div>
          <!-- Botones de envío y cancelar (solo en modo edición) -->
          <div class="botones">
            <button type="submit">{{ isEditing ? "Actualizar" : "Crear" }}</button>
            <button type="button" v-if="isEditing" @click="cancelEdit">Cancelar</button>
          </div>
        </form>
      </section>
  
      <!-- Lista de coches -->
      <section class="lista-coches">
        <h2>Lista de Coches</h2>
        <!-- Mensajes de carga o error -->
        <div v-if="store.loading">Cargando coches...</div>
        <div v-if="store.error" class="error">Error: {{ store.error }}</div>
        <div v-if="!store.loading && store.coches.length === 0">
          No hay coches para mostrar.
        </div>
        <!-- Se muestra cada coche en una lista -->
        <ul>
          <li v-for="coche in store.coches" :key="coche.id" class="coche">
            <!-- Se muestra la información del coche -->
            <div>
              <strong>{{ coche.nombre }}</strong> - {{ coche.marca }} -
              €{{ coche.precio.toFixed(2) }} - {{ coche.descripción }}
            </div>
            <!-- Botones para editar o eliminar el coche -->
            <div class="acciones">
              <button @click="editCoche(coche)">Editar</button>
              <button @click="deleteCoche(coche.id)">Eliminar</button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useCocheAutoriaStore, CocheAutoria } from '../stores/cocheAutoriaStore';
  
  // Obtenemos el store de coches
  const store = useCocheAutoriaStore();
  
  // Estado reactivo para los datos del formulario
  const form = ref({
    id: 0,
    nombre: '',
    marca: '',
    precio: 0,
    descripción: ''
  });
  
  // Bandera para saber si el formulario está en modo edición
  const isEditing = ref(false);
  
  // Al montar la vista se cargan los coches
  onMounted(() => {
    store.fetchCoches();
  });
  
  // Computed para calcular la media de los precios de los coches
  const averagePrice = computed(() => {
    if (store.coches.length === 0) return 0;
    const total = store.coches.reduce((sum, coche) => sum + coche.precio, 0);
    return total / store.coches.length;
  });
  
  /**
   * Maneja el envío del formulario para crear o actualizar un coche.
   */
  async function submitForm() {
    if (isEditing.value) {
      // Si estamos en modo edición, actualizamos el coche existente
      console.log("Actualizando coche:", form.value);
      const coche: CocheAutoria = { ...form.value };
      const success = await store.updateCoche(coche);
      if (success) {
        resetForm();
        isEditing.value = false;
      }
    } else {
      // Si no estamos en modo edición, creamos un nuevo coche
      console.log("Creando nuevo coche:", form.value);
      const newProduct = {
        nombre: form.value.nombre,
        marca: form.value.marca,
        precio: form.value.precio,
        descripción: form.value.descripción
      };
      await store.createCoche(newProduct);
      resetForm();
    }
  }
  
  /**
   * Pone en modo edición y carga los datos del coche seleccionado en el formulario.
   * @param coche Coche a editar.
   */
  function editCoche(coche: CocheAutoria) {
    console.log("Editando coche:", coche);
    form.value = { ...coche };
    isEditing.value = true;
  }
  
  /**
   * Cancela el modo edición y reinicia el formulario.
   */
  function cancelEdit() {
    resetForm();
    isEditing.value = false;
  }
  
  /**
   * Reinicia el formulario a sus valores por defecto.
   */
  function resetForm() {
    form.value = {
      id: 0,
      nombre: '',
      marca: '',
      precio: 0,
      descripción: ''
    };
  }
  
  /**
   * Elimina un coche mediante su ID.
   * @param id Identificador del coche a eliminar.
   */
  async function deleteCoche(id: number) {
    console.log("Eliminando coche con id:", id);
    await store.deleteCoche(id);
  }
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  
  /* Estilos para el apartado de media de precios */
  .media-precios {
    border: 1px solid #ccc;
    padding: 12px;
    margin-bottom: 20px;
    border-radius: 4px;
    background: #f9f9f9;
  }
  
  /* Estilos simples para el formulario y la lista */
  .formulario {
    border: 1px solid #ccc;
    padding: 16px;
    margin-bottom: 20px;
    border-radius: 4px;
  }
  
  .formulario div {
    margin-bottom: 10px;
  }
  
  .botones button {
    margin-right: 10px;
  }
  
  .lista-coches ul {
    list-style-type: none;
    padding: 0;
  }
  
  .coche {
    border: 1px solid #ddd;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .acciones button {
    margin-left: 8px;
  }
  </style>
  