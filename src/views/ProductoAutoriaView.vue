<!-- src/views/ProductoAutoriaView.vue -->
<template>
  <div>
    <h1>Productos con Autoría</h1>

    <!-- Filtro por título -->
    <section class="filtros">
      <!-- Filtro por título -->
      <div>
        <input
          type="text"
          placeholder="🔍 Filtrar por título..."
          v-model="filtroTitulo"
        />
        <button @click="limpiarFiltroTitulo">Limpiar Título</button>
      </div>

      <!-- Filtro por autor -->
      <div>
        <input
          type="text"
          placeholder="🔍 Filtrar por autor..."
          v-model="filtroAutor"
        />
        <button @click="limpiarFiltroAutor">Limpiar Autor</button>
      </div>

      <!-- Filtro por NumeroSerie -->
      <div>
        <input
          type="text"
          placeholder="🔍 Filtrar por NumeroSerie..."
          v-model="filtroNumeroSerie"
        />
        <button @click="limpiarFiltroNumeroSerie">Limpiar NumeroSerie</button>
      </div>

      
    </section>

    <!-- Precio promedio -->
    <section class="media-precios" v-if="store.productos.length > 0">
      <h3>Precio Medio: €{{ averagePrice.toFixed(2) }}</h3>
    </section>

    <!-- Lista de productos filtrados -->
    <section class="lista-productos">
      <h2>Lista de Productos</h2>

      <!-- Mensajes de estado -->
      <div v-if="store.loading">Cargando productos...</div>
      <div v-if="store.error" class="error"> Error: {{ store.error }}</div>

      <!-- Productos filtrados -->
      <ul v-if="productosFiltrados.length > 0">
        <li v-for="producto in productosFiltrados" :key="producto.id" class="producto">
          <ProductoAutoriaCard :producto="producto" />
          <div class="acciones">
            <button @click="editProducto(producto)"> Editar</button>
            <button @click="deleteProducto(producto.id)"> Eliminar</button>
          </div>
        </li>
      </ul>

      <!-- Mensaje cuando no hay coincidencias -->
      <div v-else>No hay productos que coincidan con el filtro.</div>
    </section>

    <!-- Formulario Crear/Editar producto -->
    <section class="formulario">
      <h2>{{ isEditing ? "Editar Producto" : "Agregar Producto" }}</h2>
      <form @submit.prevent="submitForm">
        <!-- Título -->
        <div>
          <label for="titulo">Título:</label>
          <input type="text" id="titulo" v-model="form.titulo" required />
        </div>
        <!-- Autor -->
        <div>
          <label for="autor">Autor:</label>
          <input type="text" id="autor" v-model="form.autor" required />
        </div>
        <!-- Precio -->
        <div>
          <label for="precio">Precio (€):</label>
          <input type="number" id="precio" v-model.number="form.precio" step="0.01" required />
        </div>
        <!-- Número de Serie -->
        <div>
          <label for="numeroSerie">Número de Serie:</label>
          <input type="text" id="numeroSerie" v-model="form.numeroSerie" required />
        </div>
        <!-- Botones del formulario -->
        <div class="botones">
          <button type="submit">{{ isEditing ? "Actualizar " : "Crear " }}</button>
          <button type="button" v-if="isEditing" @click="cancelEdit">Cancelar </button>
        </div>
      </form>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useProductoAutoriaStore, ProductoAutoria } from '../stores/productoAutoriaStore';
import ProductoAutoriaCard from '../components/ProductoAutoriaCard.vue';

// Store Pinia
const store = useProductoAutoriaStore();

// Estado del formulario
const form = ref<ProductoAutoria>({
  id: 0,
  titulo: '',
  autor: '',
  precio: 0,
  numeroSerie: ''
});

// Estado edición o creación
const isEditing = ref(false);

// Estados locales para los filtros
const filtroTitulo = ref('');
const filtroAutor = ref('');
const filtroNumeroSerie = ref('');
// Cargar productos al montar el componente
onMounted(() => {
  store.fetchProductos();
});

// Watchers para actualizar filtros en el store automáticamente
watch(filtroTitulo, (nuevoFiltro) => {
  store.setFiltroTitulo(nuevoFiltro);
});

watch(filtroAutor, (nuevoFiltro) => {
  store.setFiltroAutor(nuevoFiltro);
});

watch(filtroNumeroSerie, (nuevoFiltro) => {
  store.setFiltroNumeroSerie(nuevoFiltro);
});

// Computed para obtener productos filtrados desde el store
const productosFiltrados = computed(() => store.productosFiltrados);

// Funciones para limpiar los filtros
function limpiarFiltroTitulo() {
  filtroTitulo.value = '';
}

function limpiarFiltroAutor() {
  filtroAutor.value = '';
}

function limpiarFiltroNumeroSerie() {
  filtroNumeroSerie.value = '';
}

// Computed para calcular precio medio
const averagePrice = computed(() => {
  if (!store.productos.length) return 0;
  const suma = store.productos.reduce((acc, prod) => acc + prod.precio, 0);
  return suma / store.productos.length;
});

// Enviar formulario (crear o actualizar)
async function submitForm() {
  if (isEditing.value) {
    const success = await store.updateProducto(form.value);
    if (success) {
      resetForm();
      isEditing.value = false;
    }
  } else {
    await store.createProducto({
      titulo: form.value.titulo,
      autor: form.value.autor,
      precio: form.value.precio,
      numeroSerie: form.value.numeroSerie
    });
    resetForm();
  }
}

// Editar producto (cargar datos en formulario)
function editProducto(producto: ProductoAutoria) {
  form.value = { ...producto };
  isEditing.value = true;
}

// Cancelar edición
function cancelEdit() {
  resetForm();
  isEditing.value = false;
}

// Resetear formulario
function resetForm() {
  form.value = { id: 0, titulo: '', autor: '', precio: 0, numeroSerie: '' };
}

// Eliminar producto por ID
async function deleteProducto(id: number) {
  await store.deleteProducto(id);
}

</script>

<style scoped>
.error {
  color: red;
}

.media-precios,
.formulario,
.lista-productos,
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

.lista-productos ul {
  list-style-type: none;
  padding: 0;
}

.producto {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.acciones button {
  margin-left: 8px;
}
</style>
