<template>
  <div class="product-card">
    <router-link :to="`/product/${producto.id}`" class="product-card__content">
      <div class="product-card__image-wrapper">
        <img
          :src="producto.urlImagen"
          alt="Imagen del producto"
          class="product-card__image"
        />
        <div class="product-card__overlay">
          <span class="product-card__view">Ver</span>
        </div>
      </div>
      <div class="product-card__info">
        <h3 class="product-card__title">{{ producto.nombre }}</h3>
        <p class="product-card__price">{{ producto.precio.toFixed(2) }} €</p>
      </div>
    </router-link>
    <button
      class="product-card__cart-btn"
      @click="addToCart($event)"
      :disabled="isAddingToCart"
    >
      <font-awesome-icon
        :icon="isAddingToCart ? faSpinner : faShoppingCart"
        :spin="isAddingToCart"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useCartStore } from '../stores/cartStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faShoppingCart, faSpinner } from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  producto: Object,
});

const cartStore = useCartStore();
const isAddingToCart = ref(false);

const addToCart = async (event: Event) => {
  event.stopPropagation();
  if (props.producto) {
    isAddingToCart.value = true;
    
    try {
      cartStore.addToCart({
        id: props.producto.id,
        name: props.producto.nombre,
        price: props.producto.precio,
        image: props.producto.urlImagen,
      });
    } finally {
      setTimeout(() => {
        isAddingToCart.value = false;
      }, 500);
    }
  }
};
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;


.product-card {
  position: relative;
  background-color: $background-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  overflow: hidden;
  transition: transform $transition-fast, box-shadow $transition-fast;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 200px; 

  &:hover {
    transform: translateY(-3px);
    box-shadow: $box-shadow-lg;
    
    .product-card__overlay {
      opacity: 1;
    }
    
    .product-card__image {
      transform: scale(1.05);
    }
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    flex: 1;
    text-decoration: none;
    color: inherit;
  }
  
  &__image-wrapper {
    position: relative;
    padding-top: 80%; 
    overflow: hidden;
    margin: 0 auto;
    width: 90%;
    margin-top: 10px;
  }
  
  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-normal;
    border-radius: $border-radius-sm;
  }
  
  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity $transition-normal;
    border-radius: $border-radius-sm;
  }
  
  &__view {
    background-color: $background-color;
    color: $text-color;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-sm;
    font-weight: 500;
    font-size: $font-size-small;
    transform: translateY(5px);
    transition: transform $transition-normal, background-color $transition-fast;
    
    .product-card:hover & {
      transform: translateY(0);
    }
    
    &:hover {
      background-color: $primary-color;
      color: $button-text-color;
    }
  }
  
  &__info {
    padding: $spacing-md;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  &__title {
    font-family: $font-family-primary;
    font-size: $font-size-small;
    font-weight: 600;
    margin: 0 0 $spacing-xs;
    color: $text-color;
    line-height: $line-height-tight;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 2.4em;
  }
  
  &__price {
    font-size: $font-size-base;
    font-weight: 700;
    color: $primary-color;
    margin: $spacing-xs 0 0;
  }
  
  &__cart-btn {
    position: absolute;
    bottom: $spacing-sm;
    right: $spacing-sm;
    width: 32px;
    height: 32px;
    border-radius: $border-radius-circle;
    background-color: $primary-color;
    color: $button-text-color;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color $transition-fast, transform $transition-fast;
    font-size: $font-size-small;
    
    &:hover:not(:disabled) {
      background-color: $primary-color-hover;
      transform: scale(1.1);
    }
    
    &:disabled {
      background-color: $text-color-secondary;
      cursor: not-allowed;
    }
  }
}

@media (min-width: $breakpoint-md) {
  .product-card {
    max-width: 220px;
  }
}
</style>
