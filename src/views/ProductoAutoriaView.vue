<!-- src/views/ProductoAutoriaView.vue -->
<template>
  <div>
    <h1>Productos Autoria</h1>

    <!-- Apartado para mostrar la media de los precios -->
    <section class="media-precios" v-if="store.productos.length > 0">
      <h3>Precio Medio: €{{ averagePrice.toFixed(2) }}</h3>
    </section>

    <!-- Formulario para crear o actualizar un producto -->
    <section class="formulario">
      <h2>{{ isEditing ? "Editar Producto" : "Agregar Producto" }}</h2>
      <!-- Al enviar el formulario se ejecuta la función submitForm -->
      <form @submit.prevent="submitForm">
        <!-- Campo para el título -->
        <div>
          <label for="titulo">Título:</label>
          <input type="text" id="titulo" v-model="form.titulo" required />
        </div>
        <!-- Campo para el autor -->
        <div>
          <label for="autor">Autor:</label>
          <input type="text" id="autor" v-model="form.autor" required />
        </div>
        <!-- Campo para el precio -->
        <div>
          <label for="precio">Precio:</label>
          <input type="number" id="precio" v-model.number="form.precio" step="0.01" required />
        </div>
        <!-- Campo para el número de serie -->
        <div>
          <label for="numeroSerie">Número de Serie:</label>
          <input type="text" id="numeroSerie" v-model="form.numeroSerie" required />
        </div>
        <!-- Botones de envío y cancelar (solo en modo edición) -->
        <div class="botones">
          <button type="submit">{{ isEditing ? "Actualizar" : "Crear" }}</button>
          <button type="button" v-if="isEditing" @click="cancelEdit">Cancelar</button>
        </div>
      </form>
    </section>

    <!-- Lista de productos -->
    <section class="lista-productos">
      <h2>Lista de Productos</h2>
      <!-- Mensajes de carga o error -->
      <div v-if="store.loading">Cargando productos...</div>
      <div v-if="store.error" class="error">Error: {{ store.error }}</div>
      <div v-if="!store.loading && store.productos.length === 0">
        No hay productos para mostrar.
      </div>
      <!-- Se muestra cada producto en una lista -->
      <ul>
        <li v-for="producto in store.productos" :key="producto.id" class="producto">
          <!-- Se muestra la información del producto -->
          <div>
            <strong>{{ producto.titulo }}</strong> - {{ producto.autor }} -
            €{{ producto.precio.toFixed(2) }} - {{ producto.numeroSerie }}
          </div>
          <!-- Botones para editar o eliminar el producto -->
          <div class="acciones">
            <button @click="editProducto(producto)">Editar</button>
            <button @click="deleteProducto(producto.id)">Eliminar</button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProductoAutoriaStore, ProductoAutoria } from '../stores/productoAutoriaStore';

// Obtenemos el store de productos
const store = useProductoAutoriaStore();

// Estado reactivo para los datos del formulario
const form = ref({
  id: 0,
  titulo: '',
  autor: '',
  precio: 0,
  numeroSerie: ''
});

// Bandera para saber si el formulario está en modo edición
const isEditing = ref(false);

// Al montar la vista se cargan los productos
onMounted(() => {
  store.fetchProductos();
});

// Computed para calcular la media de los precios de los productos
const averagePrice = computed(() => {
  if (store.productos.length === 0) return 0;
  const total = store.productos.reduce((sum, producto) => sum + producto.precio, 0);
  return total / store.productos.length;
});

/**
 * Maneja el envío del formulario para crear o actualizar un producto.
 */
async function submitForm() {
  if (isEditing.value) {
    // Si estamos en modo edición, actualizamos el producto existente
    console.log("Actualizando producto:", form.value);
    const producto: ProductoAutoria = { ...form.value };
    const success = await store.updateProducto(producto);
    if (success) {
      resetForm();
      isEditing.value = false;
    }
  } else {
    // Si no estamos en modo edición, creamos un nuevo producto
    console.log("Creando nuevo producto:", form.value);
    const newProduct = {
      titulo: form.value.titulo,
      autor: form.value.autor,
      precio: form.value.precio,
      numeroSerie: form.value.numeroSerie
    };
    await store.createProducto(newProduct);
    resetForm();
  }
}

/**
 * Pone en modo edición y carga los datos del producto seleccionado en el formulario.
 * @param producto Producto a editar.
 */
function editProducto(producto: ProductoAutoria) {
  console.log("Editando producto:", producto);
  form.value = { ...producto };
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
    titulo: '',
    autor: '',
    precio: 0,
    numeroSerie: ''
  };
}

/**
 * Elimina un producto mediante su ID.
 * @param id Identificador del producto a eliminar.
 */
async function deleteProducto(id: number) {
  console.log("Eliminando producto con id:", id);
  await store.deleteProducto(id);
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

.lista-productos ul {
  list-style-type: none;
  padding: 0;
}

.producto {
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
