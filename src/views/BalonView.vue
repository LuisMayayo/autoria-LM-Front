<!-- src/views/BalonView.vue -->
<template>
    <div>
      <h1>📚 balones con Autoría</h1>
  
      <!-- Filtro por título -->
      <section class="filtros">
        <!-- Filtro por título -->
        <div>
          <input
            type="text"
            placeholder="🔍 Filtrar por título..."
            v-model="filtroNombre"
          />
          <button @click="limpiarFiltroNombre">Limpiar Título</button>
        </div>
        
      </section>
  
      <!-- Precio promedio -->
      <section class="media-precios" v-if="store.balones.length > 0">
        <h3>💰 Precio Medio: €{{ averagePrice.toFixed(2) }}</h3>
      </section>
  
      <!-- Lista de balones filtrados -->
      <section class="lista-balones">
        <h2>📖 Lista de balones</h2>
  
        <!-- Mensajes de estado -->
        <div v-if="store.loading">⏳ Cargando balones...</div>
        <div v-if="store.error" class="error">❌ Error: {{ store.error }}</div>
  
        <!-- balones filtrados -->
        <ul v-if="balonesFiltrados.length > 0">
          <li v-for="balon in balonesFiltrados" :key="balon.id" class="balon">
            <BalonCard :balon="balon" />
            <div class="acciones">
              <button @click="editBalon(balon)">✏️ Editar</button>
              <button @click="deleteBalon(balon.id)">🗑️ Eliminar</button>
            </div>
          </li>
        </ul>
  
        <!-- Mensaje cuando no hay coincidencias -->
        <div v-else>No hay balones que coincidan con el filtro.</div>
      </section>
  
      <!-- Formulario Crear/Editar balon -->
      <section class="formulario">
        <h2>{{ isEditing ? "✏️ Editar Balon" : "➕ Agregar Balon" }}</h2>
        <form @submit.prevent="submitForm">
          <!-- Título -->
          <div>
            <label for="nombre">Título:</label>
            <input type="text" id="nombre" v-model="form.nombre" required />
          </div>
          <!-- marca -->
          <div>
            <label for="marca">marca:</label>
            <input type="text" id="marca" v-model="form.marca" required />
          </div>
          <!-- Precio -->
          <div>
            <label for="precio">Precio (€):</label>
            <input type="number" id="precio" v-model.number="form.precio" step="0.01" required />
          </div>
          <!-- descripción -->
          <div>
            <label for="descripción">descripción:</label>
            <input type="text" id="descripción" v-model="form.descripción" required />
          </div>

          <!-- tamaño -->
          <div>
            <label for="tamaño">tamaño:</label>
            <input type="text" id="tamaño" v-model="form.tamaño" required />
          </div>
          <!-- Botones del formulario -->
          <div class="botones">
            <button type="submit">{{ isEditing ? "Actualizar ✅" : "Crear ➕" }}</button>
            <button type="button" v-if="isEditing" @click="cancelEdit">Cancelar ❌</button>
          </div>
        </form>
      </section>
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue';
  import { useBalonStore, Balon } from '../stores/balonStore';
  import BalonCard from '../components/BalonCard.vue';
  
  // Store Pinia
  const store = useBalonStore();
  
  // Estado del formulario
  const form = ref<Balon>({
    id: 0,
    nombre: '',
    marca: '',
    precio: 0,
    descripción: '',
    tamaño: ''
  });
  
  // Estado edición o creación
  const isEditing = ref(false);
  
  // Estados locales para los filtros
  const filtroNombre = ref('');

  // Cargar balones al montar el componente
  onMounted(() => {
    store.fetchBalones();
  });
  
  // Watchers para actualizar filtros en el store automáticamente
  watch(filtroNombre, (nuevoFiltro) => {
    store.setFiltroNombre(nuevoFiltro);
  });
  

  
  // Computed para obtener balones filtrados desde el store
  const balonesFiltrados = computed(() => store.balonesFiltrados);
  
  // Funciones para limpiar los filtros
  function limpiarFiltroNombre() {
    filtroNombre.value = '';
  }
  
  
  // Computed para calcular precio medio
  const averagePrice = computed(() => {
    if (!store.balones.length) return 0;
    const suma = store.balones.reduce((acc, prod) => acc + prod.precio, 0);
    return suma / store.balones.length;
  });
  
  // Enviar formulario (crear o actualizar)
  async function submitForm() {
    if (isEditing.value) {
      const success = await store.updateBalon(form.value);
      if (success) {
        resetForm();
        isEditing.value = false;
      }
    } else {
      await store.createBalon({
        nombre: form.value.nombre,
        marca: form.value.marca,
        precio: form.value.precio,
        descripción: form.value.descripción,
        tamaño: form.value.tamaño
      });
      resetForm();
    }
  }
  
  // Editar balon (cargar datos en formulario)
  function editBalon(balon: Balon) {
    form.value = { ...balon };
    isEditing.value = true;
  }
  
  // Cancelar edición
  function cancelEdit() {
    resetForm();
    isEditing.value = false;
  }
  
  // Resetear formulario
  function resetForm() {
    form.value = { id: 0, nombre: '', marca: '', precio: 0, descripción: '', tamaño: '' };
  }
  
  // Eliminar balon por ID
  async function deleteBalon(id: number) {
    await store.deleteBalon(id);
  }
  
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  
  .media-precios,
  .formulario,
  .lista-balones,
  .filtro {
    border: 1px solid #ccc;
    padding: 16px;
    margin-bottom: 20px;
    border-radius: 4px;
  }
  
  .filtro input {
    padding: 8px;
  }
  
  .botones button,
  .filtro button {
    margin-left: 8px;
  }
  
  .lista-balones ul {
    list-style-type: none;
    padding: 0;
  }
  
  .balon {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .acciones button {
    margin-left: 8px;
  }
  </style>
  