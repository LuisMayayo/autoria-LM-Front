<template>
  <div class="admin-panel">
    <h1 class="admin-panel__title">Panel de Administración</h1>

    <!-- Pestañas (Usuarios, Productos, Pedidos) -->
    <div class="admin-panel__tabs">
      <button v-for="tab in tabs" :key="tab.id" class="admin-panel__tab-btn"
        :class="{ 'admin-panel__tab-btn--active': activeTab === tab.id }" @click="activeTab = tab.id">
        {{ tab.name }}
      </button>
    </div>

    <!-- SECCIÓN USUARIOS -->
    <div v-if="activeTab === 'users'" class="admin-panel__section">
      <h2 class="admin-panel__subtitle">GESTIÓN DE USUARIOS</h2>
      <div class="users-table">
        <div class="users-table__container">
          <table class="users-table__content">
            <thead>
              <tr>
                <th class="users-table__header users-table__header--sticky">ID</th>
                <th class="users-table__header">Nombre</th>
                <th class="users-table__header">Email</th>
                <th class="users-table__header">Rol</th>
                <th class="users-table__header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td class="users-table__cell users-table__cell--sticky">{{ user.id }}</td>
                <td class="users-table__cell">{{ user.nombre }}</td>
                <td class="users-table__cell">{{ user.email }}</td>
                <td class="users-table__cell">{{ user.role }}</td>
                <td class="users-table__cell">
                  <button @click="openEditUserModal(user)" class="users-table__btn users-table__btn--edit">
                    Editar
                  </button>
                  <button @click="deleteUser(user.id)" class="users-table__btn users-table__btn--delete">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SECCIÓN PRODUCTOS -->
    <div v-if="activeTab === 'products'" class="admin-panel__section">
      <h2 class="admin-panel__subtitle">GESTIÓN DE PRODUCTOS</h2>
      <button @click="showAddProductForm = true" class="admin-panel__add-btn">Añadir Producto</button>
      <div class="users-table">
        <div class="users-table__container">
          <table class="users-table__content">
            <thead>
              <tr>
                <th class="users-table__header users-table__header--sticky">ID</th>
                <th class="users-table__header">Nombre</th>
                <th class="users-table__header">Precio</th>
                <th class="users-table__header">Categoría</th>
                <th class="users-table__header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td class="users-table__cell users-table__cell--sticky">{{ product.id }}</td>
                <td class="users-table__cell">{{ product.nombre }}</td>
                <td class="users-table__cell">{{ product.precio.toFixed(2) }}€</td>
                <td class="users-table__cell">{{ product.categoria }}</td>
                <td class="users-table__cell">
                  <button @click="openEditProductModal(product)" class="users-table__btn users-table__btn--edit">
                    Editar
                  </button>
                  <button @click="deleteProduct(product.id)" class="users-table__btn users-table__btn--delete">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SECCIÓN PEDIDOS (solo "Eliminar") -->
    <div v-if="activeTab === 'orders'" class="admin-panel__section">
      <h2 class="admin-panel__subtitle">GESTIÓN DE PEDIDOS</h2>
      <div class="users-table">
        <div class="users-table__container">
          <table class="users-table__content">
            <thead>
              <tr>
                <th class="users-table__header users-table__header--sticky">ID</th>
                <th class="users-table__header">Usuario ID</th>
                <th class="users-table__header">Fecha</th>
                <th class="users-table__header">Total</th>
                <th class="users-table__header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td class="users-table__cell users-table__cell--sticky">{{ order.id }}</td>
                <td class="users-table__cell">{{ order.usuarioId }}</td>
                <td class="users-table__cell">{{ formatDate(order.FechaPedido) }}</td>
                <td class="users-table__cell">
                  {{ order.total ? `${order.total.toFixed(2)}€` : '0€' }}
                </td>
                <td class="users-table__cell">
                  <button @click="deleteOrder(order.id)" class="users-table__btn users-table__btn--delete">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Formulario para añadir producto -->
    <div v-if="showAddProductForm" class="admin-panel__section">
      <h2 class="admin-panel__subtitle">Añadir Producto</h2>
      <!-- Formulario para crear un nuevo producto... -->
      <p>Aquí va el formulario de creación de producto</p>
      <button @click="showAddProductForm = false" class="admin-panel__add-btn">Cerrar</button>
    </div>

    <!-- Modal de Edición de Usuario -->
    <!-- Modal de Edición de Usuario -->
    <div v-if="editingUser" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Editar Usuario</h3>
        <form @submit.prevent="saveUserEdits" class="modal-form">
          <div class="form-group">
            <label for="user-id">ID:</label>
            <input type="text" id="user-id" v-model="editingUser.id" disabled
              class="form-control form-control--disabled" />
          </div>

          <div class="form-group">
            <label for="user-name">Nombre:</label>
            <input type="text" id="user-name" v-model="editingUser.nombre" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="user-email">Email:</label>
            <input type="email" id="user-email" v-model="editingUser.email" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="user-role">Rol:</label>
            <select id="user-role" v-model="editingUser.role" class="form-control">
              <option value="User">Usuario</option>
              <option value="Admin">Administrador</option>
            </select>
          </div>

          <div class="modal-buttons">
            <button type="submit" class="modal-btn modal-btn--primary">Guardar cambios</button>
            <button type="button" @click="cancelUserEdit" class="modal-btn modal-btn--secondary">Cancelar</button>
          </div>
        </form>
      </div>
    </div>


    <!-- Modal de Edición de Producto -->
    <div v-if="editingProduct" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Editar Producto</h3>
        <form @submit.prevent="saveProductEdits" class="modal-form">
          <div class="form-group">
            <label for="product-id">ID:</label>
            <input type="text" id="product-id" v-model="editingProduct.id" disabled
              class="form-control form-control--disabled" />
          </div>

          <div class="form-group">
            <label for="product-name">Nombre:</label>
            <input type="text" id="product-name" v-model="editingProduct.nombre" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="product-price">Precio (€):</label>
            <input type="number" id="product-price" v-model.number="editingProduct.precio" step="0.01" min="0"
              class="form-control" required />
          </div>

          <div class="form-group">
            <label for="product-category">Categoría:</label>
            <input type="text" id="product-category" v-model="editingProduct.categoria" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="product-description">Descripción:</label>
            <textarea id="product-description" v-model="editingProduct.descripcion" rows="3"
              class="form-control"></textarea>
          </div>

          <div class="form-group">
            <label for="product-image">URL de imagen:</label>
            <input type="url" id="product-image" v-model="editingProduct.urlImagen" class="form-control" />
            <div v-if="editingProduct.urlImagen" class="image-preview">
              <img :src="editingProduct.urlImagen" alt="Vista previa" />
            </div>
          </div>

          <div class="modal-buttons">
            <button type="submit" class="modal-btn modal-btn--primary">Guardar cambios</button>
            <button type="button" @click="cancelProductEdit" class="modal-btn modal-btn--secondary">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
    <!-- Modal para añadir producto -->
    <div v-if="showAddProductForm" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Añadir Nuevo Producto</h3>
        <form @submit.prevent="createNewProduct" class="modal-form">
          <div class="form-group">
            <label for="new-product-name">Nombre:</label>
            <input type="text" id="new-product-name" v-model="newProduct.nombre" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="new-product-price">Precio (€):</label>
            <input type="number" id="new-product-price" v-model.number="newProduct.precio" step="0.01" min="0"
              class="form-control" required />
          </div>

          <div class="form-group">
            <label for="new-product-category">Categoría:</label>
            <select id="new-product-category" v-model="newProduct.categoria" class="form-control" required>
              <option disabled value="">Seleccione una categoría</option>
              <option value="1">Textil</option>
              <option value="2">Decoración vertical</option>
              <option value="3">Accesorio decorativo</option>
            </select>
          </div>


          <div class="form-group">
            <label for="new-product-description">Descripción:</label>
            <textarea id="new-product-description" v-model="newProduct.descripcion" rows="3"
              class="form-control"></textarea>
          </div>

          <div class="form-group">
            <label for="new-product-image">URL de imagen:</label>
            <input type="url" id="new-product-image" v-model="newProduct.urlImagen" class="form-control" />
            <div v-if="newProduct.urlImagen" class="image-preview">
              <img :src="newProduct.urlImagen" alt="Vista previa" />
            </div>
          </div>

          <div class="modal-buttons">
            <button type="submit" class="modal-btn modal-btn--primary" :disabled="isCreatingProduct">
              {{ isCreatingProduct ? 'Creando...' : 'Crear Producto' }}
            </button>
            <button type="button" @click="cancelAddProduct" class="modal-btn modal-btn--secondary">Cancelar</button>
          </div>
        </form>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../stores/adminStore';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const router = useRouter();
const adminStore = useAdminStore();
const toast = useToast();

const activeTab = ref('users');
const users = ref<any[]>([]);
const products = ref<any[]>([]);
const orders = ref<any[]>([]);
const showAddProductForm = ref(false);
const isCreatingProduct = ref(false);

// Variables reactivas para modales (Usuario y Producto)
const editingUser = ref<any>(null);
const editingProduct = ref<any>(null);

// Variable para nuevo producto
const newProduct = ref({
  nombre: '',
  precio: 0,
  categoria: '',
  descripcion: '',
  urlImagen: ''
});

const tabs = [
  { id: 'users', name: 'Usuarios' },
  { id: 'products', name: 'Productos' },
  { id: 'orders', name: 'Pedidos' }
];

// Función para formatear fechas en formato local
function formatDate(dateString: string): string {
  if (!dateString) return 'Sin fecha';
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? 'Fecha inválida'
    : date.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
}

onMounted(async () => {
  try {
    await adminStore.fetchAllUsers();
    await adminStore.fetchAllProducts();
    await adminStore.fetchAllOrders();

    users.value = adminStore.users;
    products.value = adminStore.products;
    orders.value = adminStore.orders;
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
});

/* USUARIOS */
function openEditUserModal(user: any) {
  editingUser.value = { ...user };
}
async function saveUserEdits() {
  if (editingUser.value) {
    await adminStore.updateUser(editingUser.value);
    await adminStore.fetchAllUsers();
    users.value = adminStore.users;
    editingUser.value = null;
    toast.success("Usuario actualizado correctamente");
    location.reload();
  }
}
function cancelUserEdit() {
  editingUser.value = null;
}
async function deleteUser(userId: number) {
  try {
    await adminStore.deleteUser(userId);
    toast.success("Usuario eliminado correctamente");
    location.reload();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    toast.error("Error al eliminar usuario");
  }
}

/* PRODUCTOS */
function openEditProductModal(product: any) {
  editingProduct.value = { ...product };
}
async function saveProductEdits() {
  if (editingProduct.value) {
    await adminStore.updateProduct(editingProduct.value);
    await adminStore.fetchAllProducts();
    products.value = adminStore.products;
    editingProduct.value = null;
    toast.success("Producto actualizado correctamente");
    location.reload();
  }
}
function cancelProductEdit() {
  editingProduct.value = null;
}
async function deleteProduct(productId: number) {
  try {
    await adminStore.deleteProduct(productId);
    toast.success("Producto eliminado correctamente");
    location.reload();
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    toast.error("Error al eliminar producto");
  }
}

// Funciones para añadir producto
function openAddProductForm() {
  showAddProductForm.value = true;
}

function cancelAddProduct() {
  showAddProductForm.value = false;
  // Resetear el formulario
  newProduct.value = {
    nombre: '',
    precio: 0,
    categoria: '',
    descripcion: '',
    urlImagen: ''
  };
}

async function createNewProduct() {
  if (!newProduct.value.nombre || !newProduct.value.precio || !newProduct.value.categoria) {
    toast.warning("Por favor, completa los campos obligatorios");
    return;
  }

  try {
    isCreatingProduct.value = true;
    const productoParaEnviar = {
      nombre: newProduct.value.nombre,
      precio: newProduct.value.precio,
      categoriaId: parseInt(newProduct.value.categoria),
      descripcion: newProduct.value.descripcion || '',
      urlImagen: newProduct.value.urlImagen || ''
    };

    await adminStore.createNewProduct(productoParaEnviar);
    toast.success("Producto creado correctamente");
    showAddProductForm.value = false;
    // Reiniciar el formulario y actualizar la lista
    newProduct.value = { nombre: '', precio: 0, categoria: '', descripcion: '', urlImagen: '' };
  } catch (error) {
    toast.error("Error al crear el producto");
  } finally {
    isCreatingProduct.value = false;
  }
}


/* PEDIDOS */
async function deleteOrder(orderId: number) {
  try {
    await adminStore.deleteOrder(orderId);
    toast.success("Pedido eliminado correctamente");
    location.reload();
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    toast.error("Error al eliminar pedido");
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;


/* Contenedor principal del Admin Panel */
.admin-panel {
  width: 100%;
  max-width: $container-width;
  margin: $spacing-lg auto;
  padding: $spacing-md;
  background-color: $background-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  color: $text-color;
  font-family: $font-family-secondary;

  @media (min-width: $breakpoint-md) {
    margin: $spacing-xl auto;
    padding: $spacing-lg;
  }

  &__title {
    font-family: $font-family-primary;
    font-size: $font-size-large;
    margin-bottom: $spacing-md;
    color: $primary-color;
    text-align: center;
    font-weight: $font-weight-bold;

    @media (min-width: $breakpoint-md) {
      font-size: $font-size-xl;
      margin-bottom: $spacing-lg;
    }
  }

  &__tabs {
    display: flex;
    flex-wrap: wrap;
    border-bottom: $border-width solid $tertiary-color;
    margin-bottom: $spacing-md;

    @media (min-width: $breakpoint-md) {
      flex-wrap: nowrap;
      margin-bottom: $spacing-lg;
    }
  }

  &__tab-btn {
    flex: 1 0 50%;
    padding: $spacing-sm;
    background: none;
    border: none;
    font-family: $font-family-primary;
    font-size: $font-size-small;
    color: $text-color-secondary;
    cursor: pointer;
    position: relative;
    transition: color $transition-normal;

    @media (min-width: $breakpoint-md) {
      flex: 1;
      font-size: $font-size-base;
      padding: $spacing-sm $spacing-md;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -$border-width;
      left: 0;
      width: 0;
      height: $border-width-md;
      background-color: $primary-color;
      transition: width $transition-normal;
    }

    &:hover {
      color: $text-color;
    }

    &--active {
      color: $primary-color;
      font-weight: $font-weight-semibold;

      &::after {
        width: 100%;
      }
    }
  }

  &__section {
    padding: $spacing-md 0;
  }

  &__subtitle {
    font-family: $font-family-primary;
    font-size: $font-size-large;
    margin: $spacing-md 0;
    color: $primary-color;
    font-weight: $font-weight-semibold;

    @media (min-width: $breakpoint-md) {
      font-size: $font-size-xl;
      margin: $spacing-lg 0 $spacing-md;
    }
  }

  &__add-btn {
    padding: $spacing-sm;
    background-color: $success-color;
    color: $button-text-color;
    border: none;
    border-radius: $button-radius;
    cursor: pointer;
    transition: background-color $transition-fast;
    margin-bottom: $spacing-md;
    width: 100%;
    font-size: $font-size-base;

    @media (min-width: $breakpoint-md) {
      width: auto;
      padding: $spacing-sm $spacing-md;
    }

    &:hover {
      background-color: $success-color; 
    }
  }

  &__action-btn {
    padding: $spacing-xs;
    margin-right: $spacing-xs;
    background-color: $primary-color;
    color: $button-text-color;
    border: none;
    border-radius: $button-radius-sm;
    cursor: pointer;
    transition: background-color $transition-fast;
    font-size: $font-size-small;

    @media (min-width: $breakpoint-md) {
      padding: $spacing-xs $spacing-sm;
      font-size: $font-size-base;
    }

    &:hover {
      background-color: $primary-color-hover;
    }

    &--danger {
      background-color: $error-color;

      &:hover {
        background-color: $error-color;
      }
    }
  }
}

/* Usamos la misma clase .users-table para las TRES secciones */
.users-table {
  width: 100%;
  overflow-x: auto;
  /* Scroll horizontal en móvil */
  -webkit-overflow-scrolling: touch;

  &__container {
    min-width: 100%;
    padding-bottom: $spacing-sm;
  }

  &__content {
    width: 100%;
    border-collapse: collapse;
  }

  &__header,
  &__cell {
    padding: $spacing-sm;
    text-align: left;
    white-space: nowrap;

    &--sticky {
      position: sticky;
      left: 0;
      background-color: $background-color;
      /* Fijamos el color de fondo */
      z-index: $z-index-sticky;
    }
  }

  &__header {
    background-color: $primary-color;
    color: $button-text-color;
    font-weight: $font-weight-bold;
  }

  &__cell {
    border-bottom: $border-width solid $border-color;
  }

  &__btn {
    padding: $spacing-xs $spacing-sm;
    border: none;
    border-radius: $button-radius-sm;
    font-size: $font-size-small;
    cursor: pointer;
    transition: background-color $transition-fast;

    &--edit {
      background-color: $primary-color;
      color: $button-text-color;
      margin-right: $spacing-xs;

      &:hover {
        background-color: $primary-color-hover;
      }
    }

    &--delete {
      background-color: $error-color;
      color: $button-text-color;

      &:hover {
        background-color: $error-color;
      }
    }
  }
}

/* Estilos para los modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; // Valor alto para que se muestre por encima de otros elementos
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: $primary-color;
  margin-bottom: 1.5rem;
  text-align: center;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: #333;
  }
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
  }

  &--disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
}

.image-preview {
  margin-top: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;

  img {
    max-width: 100%;
    max-height: 150px;
    display: block;
    margin: 0 auto;
  }
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &--primary {
    background-color: $primary-color;
    color: white;
    border: none;

    &:hover {
      background-color: $primary-color;
    }
  }

  &--secondary {
    background-color: transparent;
    color: #666;
    border: 1px solid #ddd;

    &:hover {
      background-color: #f5f5f5;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
