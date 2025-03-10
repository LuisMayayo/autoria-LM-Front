<template>
  <div class="mi-cuenta">
    <h1 class="mi-cuenta__title">Mi Cuenta</h1>

    <div class="mi-cuenta__tabs">
      <button class="mi-cuenta__tab-btn" :class="{ 'mi-cuenta__tab-btn--active': activeTab === 'perfil' }" @click="activeTab = 'perfil'">
        Mis Datos
      </button>
      <button class="mi-cuenta__tab-btn" :class="{ 'mi-cuenta__tab-btn--active': activeTab === 'pedidos' }" @click="activeTab = 'pedidos'">
        Mis Pedidos
      </button>
    </div>

    <!-- Sección de Perfil -->
    <div v-if="activeTab === 'perfil'" class="mi-cuenta__section">
      <h2 class="mi-cuenta__subtitle">Datos Personales</h2>
      <form class="mi-cuenta__form" @submit.prevent="actualizarPerfil">
        <div class="mi-cuenta__form-group">
          <label class="mi-cuenta__label">Nombre:</label>
          <input v-model="perfil.nombre" type="text" class="mi-cuenta__input" required />
        </div>
        <div class="mi-cuenta__form-group">
          <label class="mi-cuenta__label">Email:</label>
          <input v-model="perfil.email" type="email" class="mi-cuenta__input" required disabled />
          <small class="mi-cuenta__input-help">El email no se puede modificar</small>
        </div>
        <div class="mi-cuenta__form-group">
          <label class="mi-cuenta__label">Teléfono:</label>
          <input v-model="perfil.telefono" type="tel" class="mi-cuenta__input" required />
        </div>
        <div class="mi-cuenta__form-group">
          <label class="mi-cuenta__label">Dirección:</label>
          <input v-model="perfil.direccion" type="text" class="mi-cuenta__input" required />
        </div>
        <button type="submit" class="mi-cuenta__submit-btn" :disabled="isUpdating">
          {{ isUpdating ? 'Actualizando...' : 'Guardar Cambios' }}
        </button>
      </form>
    </div>

    <!-- Sección de Pedidos -->
    <div v-else-if="activeTab === 'pedidos'" class="mi-cuenta__section">
      <h2 class="mi-cuenta__subtitle">Historial de Pedidos</h2>
      <div v-if="loading" class="mi-cuenta__loading">
        <div class="spinner"></div>
        <p>Cargando tus pedidos...</p>
      </div>
      <div v-else-if="pedidos.length === 0" class="mi-cuenta__empty">
        <p>No tienes pedidos realizados todavía.</p>
        <router-link to="/" class="mi-cuenta__shop-btn">Ir a la tienda</router-link>
      </div>
      <div v-else class="mi-cuenta__pedidos">
        <div v-for="pedido in pedidos" :key="pedido.id" class="mi-cuenta__pedido">
          <div class="mi-cuenta__pedido-header">
            <div>
              <h3 class="mi-cuenta__pedido-id">Pedido #{{ pedido.id }}</h3>
              <p class="mi-cuenta__pedido-date">{{ new Date(pedido.fechaPedido).toLocaleString() }}</p>
            </div>
            <div class="mi-cuenta__pedido-status" :class="`mi-cuenta__pedido-status--${getStatusClass(pedido.estado)}`">
              {{ pedido.estado || 'Pendiente' }}
            </div>
          </div>
          <div class="mi-cuenta__pedido-total">
            <p>Total: <strong>{{ pedido.total.toFixed(2) }} €</strong></p>
          </div>
          <div class="mi-cuenta__pedido-actions">
            <router-link :to="`/pedido-detalle/${pedido.id}`" class="mi-cuenta__view-btn">
              Ver detalles
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useUserStore } from '../stores/userStore';
import { usePedidoStore } from '../stores/pedidoStore';
import { useToast } from 'vue-toastification';

const userStore = useUserStore();
const pedidoStore = usePedidoStore();
const toast = useToast();

const activeTab = ref('perfil');
const loading = ref(false);
const isUpdating = ref(false);
const pedidos = ref([]);

const perfil = reactive({
  nombre: userStore.user?.nombre || '',
  email: userStore.user?.email || '',
  telefono: userStore.user?.telefono || '',
  direccion: userStore.user?.direccion || ''
});

const actualizarPerfil = async () => {
  isUpdating.value = true;
  try {
    await userStore.updateUserProfile({
      id: userStore.user.id,
      nombre: perfil.nombre,
      telefono: perfil.telefono,
      direccion: perfil.direccion
    });
    toast.success("Datos actualizados correctamente");
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    toast.error("No se pudieron actualizar tus datos");
  } finally {
    isUpdating.value = false;
  }
};

const cargarPedidos = async () => {
  loading.value = true;
  try {
    await pedidoStore.fetchPedidosByUser(userStore.user.id);
    pedidos.value = pedidoStore.pedidos;
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    toast.error("No se pudieron cargar tus pedidos");
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'entregado':
      return 'completed';
    case 'enviado':
      return 'shipped';
    case 'cancelado':
      return 'cancelled';
    default:
      return 'pending';
  }
};

const watchActiveTab = (newTab) => {
  if (newTab === 'pedidos') {
    cargarPedidos();
  }
};

watch(activeTab, watchActiveTab);

onMounted(() => {
  if (activeTab.value === 'pedidos') {
    cargarPedidos();
  }
});
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.mi-cuenta {
  width: 100%;
  max-width: 1000px;
  margin: 2rem auto;
  padding: $spacing-md;
  background-color: $background-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  color: $text-color;
  font-family: $font-family-secondary;

  @media (min-width: $breakpoint-sm) {
    padding: $spacing-lg;
    margin: 3rem auto;
  }

  @media (min-width: $breakpoint-md) {
    padding: $spacing-xl;
    margin: 4rem auto;
  }

  &__title {
    font-family: $font-family-primary;
    font-size: $font-size-xl;
    margin-bottom: $spacing-lg;
    color: $primary-color;
    text-align: center;
    font-weight: 700;

    @media (min-width: $breakpoint-md) {
      font-size: $font-size-xxl;
      margin-bottom: $spacing-xl;
    }
  }

  &__tabs {
    display: flex;
    border-bottom: 2px solid $tertiary-color;
    margin-bottom: $spacing-lg;
    -webkit-overflow-scrolling: touch;

    @media (min-width: $breakpoint-sm) {
      justify-content: center;
    }
  }

  &__tab-btn {
    padding: $spacing-sm $spacing-md;
    background: none;
    border: none;
    font-family: $font-family-primary;
    font-size: $font-size-base;
    color: $text-color-secondary;
    cursor: pointer;
    position: relative;
    white-space: nowrap;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 3px;
      background-color: $primary-color;
      transition: width $transition-normal;
    }

    &:hover {
      color: $text-color;
    }

    &--active {
      color: $primary-color;
      font-weight: 600;

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
    margin: $spacing-lg 0 $spacing-md;
    color: $primary-color;
    font-weight: 600;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    max-width: 600px;
    margin: 0 auto;
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__label {
    font-weight: 600;
    font-size: $font-size-base;
    color: $text-color;
  }

  &__input {
    padding: $input-padding;
    border: $input-border;
    border-radius: $input-border-radius;
    font-size: $font-size-base;
    font-family: $font-family-secondary;
    transition: border $transition-fast;

    &:focus {
      outline: none;
      border: $input-focus-border;
    }

    &:disabled {
      background-color: $tertiary-color;
      cursor: not-allowed;
    }
  }

  &__input-help {
    font-size: $font-size-small;
    color: $text-color-secondary;
    margin-top: -$spacing-xs;
  }

  &__submit-btn {
    background-color: $primary-color;
    color: $button-text-color;
    border: none;
    padding: $spacing-md;
    font-size: $font-size-base;
    font-weight: 600;
    border-radius: $button-radius;
    cursor: pointer;
    transition: background-color $transition-normal, transform $transition-fast;
    box-shadow: $button-shadow;
    margin-top: $spacing-sm;

    &:hover:not(:disabled) {
      background-color: $primary-color-hover;
      transform: translateY(-2px);
      box-shadow: $button-hover-shadow;
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      background-color: $text-color-secondary;
      cursor: not-allowed;
    }
  }

  &__separator {
    height: 1px;
    background-color: $tertiary-color;
    margin: $spacing-xl 0;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl 0;

    p {
      margin-top: $spacing-md;
      font-size: $font-size-base;
      color: $text-color-secondary;
    }
  }

  &__empty {
    text-align: center;
    padding: $spacing-xl 0;

    p {
      color: $text-color-secondary;
      font-size: $font-size-large;
      margin-bottom: $spacing-md;
    }
  }

  &__shop-btn {
    display: inline-block;
    background-color: $primary-color;
    color: $button-text-color;
    text-decoration: none;
    padding: $button-padding;
    border-radius: $button-radius;
    font-weight: 600;
    font-size: $font-size-base;
    transition: background-color $transition-normal, transform $transition-fast;
    box-shadow: $button-shadow;

    &:hover {
      background-color: $primary-color-hover;
      transform: translateY(-2px);
      box-shadow: $button-hover-shadow;
    }

    &:active {
      transform: translateY(0);
    }
  }

  &__pedidos {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__pedido {
    background-color: $tertiary-color;
    border-radius: $border-radius;
    padding: $spacing-lg;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform $transition-fast, box-shadow $transition-fast;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }
  }

  &__pedido-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-md;
    flex-wrap: wrap;
    gap: $spacing-sm;

    @media (min-width: $breakpoint-sm) {
      flex-wrap: nowrap;
    }
  }

  &__pedido-id {
    font-family: $font-family-primary;
    font-size: $font-size-large;
    margin: 0 0 $spacing-xs;
    color: $text-color;
  }

  &__pedido-date {
    font-size: $font-size-small;
    color: $text-color-secondary;
    margin: 0;
  }

  &__pedido-status {
    display: inline-block;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius;
    font-size: $font-size-small;
    font-weight: 600;
    text-align: center;

    &--pending {
      background-color: $warning-color;
      color: $status-pending-text;
    }

    &--completed {
      background-color: $success-color;
      color: $status-completed-text;
    }

    &--shipped {
      background-color: $info-color;
      color: $status-shipped-text;
    }

    &--cancelled {
      background-color: $error-color;
      color: $status-cancelled-text;
    }
  }

  &__pedido-total {
    margin-bottom: $spacing-md;

    p {
      font-size: $font-size-base;
      margin: 0;

      strong {
        color: $primary-color;
        font-size: $font-size-large;
      }
    }
  }

  &__pedido-actions {
    display: flex;
    justify-content: flex-end;
  }

  &__view-btn {
    display: inline-block;
    background-color: $primary-color;
    color: $button-text-color;
    text-decoration: none;
    padding: $spacing-xs $spacing-md;
    border-radius: $button-radius;
    font-size: $font-size-small;
    font-weight: 600;
    transition: background-color $transition-normal, transform $transition-fast;

    &:hover {
      background-color: $primary-color-hover;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border-left-color: $primary-color;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
