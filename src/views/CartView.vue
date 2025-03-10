<template>
  <div class="cart">
    <h1 class="cart__title">Mi Carrito</h1>

    <div v-if="cartStore.cart.length === 0" class="cart__empty">
      <p class="cart__empty-message">Tu carrito está vacío.</p>
      <router-link to="/" class="cart__continue-shopping">Continuar comprando</router-link>
    </div>

    <div v-else class="cart__container">
      <div class="cart__items">
        <div class="cart__item" v-for="item in cartStore.cart" :key="item.id">
          <img :src="item.image" :alt="item.name" class="cart__item-image" />
          <div class="cart__item-info">
            <h3 class="cart__item-name">{{ item.name }}</h3>
            <p class="cart__item-price">{{ item.price.toFixed(2) }} €</p>
            <div class="cart__item-quantity-controls">
              <button
                class="cart__quantity-btn"
                @click="decreaseQuantity(item)"
                :disabled="item.quantity <= 1"
              >
                -
              </button>
              <p class="cart__item-quantity">{{ item.quantity }}</p>
              <button
                class="cart__quantity-btn"
                @click="increaseQuantity(item)"
              >
                +
              </button>
            </div>
          </div>
          <button class="cart__remove-btn" @click="removeItem(item)">
            Quitar
          </button>
        </div>
      </div>

      <div class="cart__total">
        <h2>Total: {{ cartStore.cartTotal.toFixed(2) }} €</h2>
        <div class="cart__actions">
          <button class="cart__clear-btn" @click="clearCart">
            Vaciar Carrito
          </button>
          <!-- Condicionamos el acceso a finalizar compra -->
          <router-link
            v-if="userStore.isAuthenticated"
            to="/pedido-confirmacion"
            class="cart__checkout-btn"
          >
            Finalizar Compra
          </router-link>
          <button
            v-else
            class="cart__checkout-btn"
            @click="notifyNotLoggedIn"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cartStore';
import { useUserStore } from '../stores/userStore';
import { useToast } from 'vue-toastification';

const cartStore = useCartStore();
const userStore = useUserStore();
const toast = useToast();

// Notificar al usuario que debe iniciar sesión
const notifyNotLoggedIn = () => {
  toast.info("Debes iniciar sesión para finalizar la compra");
};

// Remover un ítem del carrito
const removeItem = (item) => {
  cartStore.removeFromCart(item.id);
};

// Vaciar todo el carrito
const clearCart = () => {
  if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
    cartStore.clearCart();
  }
};

// Guardamos timeouts de "sumar" por producto (clave: item.id)
const increaseTimeouts: Record<number, ReturnType<typeof setTimeout> | null> = {};

// Guardamos timeouts de "restar" por producto (clave: item.id)
const decreaseTimeouts: Record<number, ReturnType<typeof setTimeout> | null> = {};

// Sumar cantidad
const increaseQuantity = (item) => {
  cartStore.addToCart(item);

  // Cancelamos cualquier timeout previo para este item
  if (increaseTimeouts[item.id]) {
    clearTimeout(increaseTimeouts[item.id]);
  }

  // Programamos un nuevo timeout para mostrar 1 sola notificación
  increaseTimeouts[item.id] = setTimeout(() => {
    toast.success(`Cantidad actualizada: ${item.quantity} unidades de "${item.name}"`);
    increaseTimeouts[item.id] = null;
  }, 1000);
};

// Restar cantidad
const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    cartStore.decreaseQuantity(item.id);

    // Cancelamos cualquier timeout previo para este item
    if (decreaseTimeouts[item.id]) {
      clearTimeout(decreaseTimeouts[item.id]);
    }

    // Programamos un nuevo timeout para mostrar 1 sola notificación
    decreaseTimeouts[item.id] = setTimeout(() => {
      toast.info(`Cantidad actualizada: ${item.quantity} unidades de "${item.name}"`);
      decreaseTimeouts[item.id] = null;
    }, 2000);
  }
};

</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;


.cart {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: $spacing-md;
  background-color: $background-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
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
    color: $text-color;
    text-align: center;
    font-weight: 700;
    
    @media (min-width: $breakpoint-md) {
      font-size: $font-size-xxl;
      margin-bottom: $spacing-xl;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-xl 0;
    text-align: center;
    
    &-message {
      font-size: $font-size-large;
      color: $text-color-secondary;
      margin-bottom: $spacing-lg;
    }
  }

  &__continue-shopping {
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

  &__container {
    display: flex;
    flex-direction: column;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  &__item {
    display: flex;
    flex-direction: column;
    background-color: $cart-item-background;
    border-radius: $border-radius;
    padding: $spacing-md;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform $transition-fast, box-shadow $transition-fast;
    
    @media (min-width: $breakpoint-sm) {
      flex-direction: row;
      align-items: center;
      padding: $spacing-md;
    }
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }

  &__item-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: $border-radius;
    margin-bottom: $spacing-sm;
    
    @media (min-width: $breakpoint-sm) {
      width: 100px;
      height: 100px;
      margin-bottom: 0;
    }
    
    @media (min-width: $breakpoint-md) {
      width: 120px;
      height: 120px;
    }
  }

  &__item-info {
    flex-grow: 1;
    margin-bottom: $spacing-sm;
    
    @media (min-width: $breakpoint-sm) {
      padding-left: $spacing-md;
      margin-bottom: 0;
    }
  }

  &__item-name {
    font-family: $font-family-primary;
    font-size: $font-size-large;
    margin: 0 0 $spacing-xs;
    color: $text-color;
  }

  &__item-price {
    font-size: $font-size-base;
    font-weight: 600;
    color: $primary-color;
    margin: 0 0 $spacing-sm;
  }

  &__item-quantity-controls {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-top: $spacing-xs;
  }

  &__quantity-btn {
    background-color: $primary-color;
    color: $button-text-color;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: $border-radius-circle;
    font-weight: bold;
    font-size: $font-size-large;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color $transition-normal;
    
    &:disabled {
      background-color: $text-color-secondary;
      cursor: not-allowed;
    }
    
    &:hover:not(:disabled) {
      background-color: $primary-color-hover;
    }
  }

  &__item-quantity {
    font-size: $font-size-base;
    font-weight: 600;
    margin: 0;
    min-width: 30px;
    text-align: center;
  }

  &__remove-btn {
    background-color: $button-remove-color;
    color: $button-text-color;
    border: none;
    padding: $spacing-xs $spacing-md;
    cursor: pointer;
    border-radius: $button-radius;
    font-weight: 500;
    font-size: $font-size-small;
    transition: background-color $transition-normal;
    align-self: flex-end;
    
    @media (min-width: $breakpoint-sm) {
      align-self: center;
    }
    
    &:hover {
      background-color: $button-remove-hover;
    }
  }

  &__total {
    margin-top: $spacing-lg;
    padding-top: $spacing-md;
    border-top: 1px solid $cart-item-border;
    
    h2 {
      font-family: $font-family-primary;
      font-size: $cart-total-price-size;
      margin-bottom: $spacing-md;
      color: $text-color;
      text-align: center;
      
      @media (min-width: $breakpoint-md) {
        text-align: right;
      }
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    
    @media (min-width: $breakpoint-sm) {
      flex-direction: row;
      justify-content: space-between;
    }
    
    @media (min-width: $breakpoint-md) {
      justify-content: flex-end;
      gap: $spacing-lg;
    }
  }

  &__clear-btn {
    background-color: $error-color;
    color: $button-text-color;
    border: none;
    padding: $button-padding;
    font-size: $font-size-base;
    cursor: pointer;
    border-radius: $button-radius;
    font-weight: 600;
    transition: background-color $transition-normal, transform $transition-fast;
    box-shadow: $button-shadow;
    
    &:hover {
      background-color: #E63946;
      transform: translateY(-2px);
      box-shadow: $button-hover-shadow;
    }
    
    &:active {
      transform: translateY(0);
    }
  }

  &__checkout-btn {
    display: inline-block;
    background-color: $primary-color;
    color: $button-text-color;
    text-decoration: none;
    padding: $button-padding;
    font-size: $cart-total-checkout-size;
    cursor: pointer;
    border-radius: $button-radius;
    font-weight: 600;
    text-align: center;
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
}
</style>
