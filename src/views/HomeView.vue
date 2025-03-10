<template>
  <div class="home">
    <!-- Carrusel -->
    <v-carousel height="600" show-arrows="hover" cycle hide-delimiter-background class="home__carousel">
      <v-carousel-item v-for="(slide, i) in slides" :key="i">
        <v-sheet height="100%" class="home__carousel-sheet">
          <img :src="slide.image" class="home__carousel-image" alt="Carrusel" />
          <div class="home__carousel-text">
            <h2>{{ slide.text }}</h2>
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>

    <!-- Categorías -->
    <section class="home__categories">
      <div class="home__categories-grid">
        <div class="home__category-card" v-for="category in categoriesStore.allCategories" :key="category.id"
          @click="goToCategory(category.name)">
          <img :src="category.image || '/fotos/default.jpg'" :alt="category.name" class="home__category-card__image" />
          <div class="home__category-card__title">{{ category.name }}</div>
        </div>
      </div>
    </section>

    <!-- Productos Destacados -->
    <section class="home__products">
      <div class="home__products-header">
        <h2 class="home__products-title">Productos Destacados</h2>
        <p class="home__products-description">Descubre nuestra selección de artículos de decoración que transformarán tu hogar con estilo y elegancia.</p>
      </div>
      <div class="home__products-grid">
        <ProductCard v-for="product in productsStore.randomProducts" :key="product.id" :producto="product" />
      </div>
    </section>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCategoriesStore } from '../stores/categoriesStore';
import { useProductsStore } from '../stores/productsStore';
import { useRouter } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';

const categoriesStore = useCategoriesStore();
const productsStore = useProductsStore();
const router = useRouter();

const slides = ref([
  { image: '/fotos/carrusel3.jpg', text: 'Dale vida a tu hogar con un toque único' },
  { image: '/fotos/carrusel1.jpg', text: 'Pequeños detalles con un gran impacto' },
  { image: '/fotos/carrusel4.jpg', text: 'Confort y elegancia en cada rincón' },
  { image: '/fotos/carrusel2.jpg', text: 'Transforma tu espacio en un hogar acogedor' },
  { image: '/fotos/carrusel5.jpg', text: 'Encuentra la inspiración que necesitas' },
]);

onMounted(async () => {
  await categoriesStore.fetchCategories();
  await productsStore.fetchProducts();
  console.log('Categorías cargadas:', categoriesStore.allCategories);
});

const goToCategory = (categoryName: string) => {
  router.push({ path: '/shop', query: { category: categoryName } });
};
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;


.home {
  width: 100%;
  margin: 0;
  padding: 0;

  /* Carrusel */
  &__carousel {}

  &__carousel-sheet {
    position: relative;
  }

  &__carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__carousel-text {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 1.5rem;
    text-align: center;
    font-weight: bold;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.8);
  }

  /* Categorías */
  &__categories {
    width: 100%;
    margin: 0;
    padding: 0;

    &-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0;
    }
  }

  &__category-card {
    flex: 0 0 calc(100% / 3);
    position: relative;
    overflow: hidden;
    cursor: pointer;

    &__image {
      width: 100%;
      height: 600px;
      object-fit: cover;
      display: block;
      filter: brightness(0.7);
      transition: filter 0.3s ease;
    }

    &:hover &__image {
      filter: brightness(1);
    }

    &__title {
      position: absolute;
      top: 3rem;
      left: 50%;
      transform: translateX(-50%);
      background-color: transparent;
      color: #fff;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: bold;
      text-align: center;
      font-size: 1.4rem;
    }
  }

  /* Productos Destacados */
  /* Productos Destacados */
&__products {
  padding: $spacing-xl;
  margin: 60px auto;
  max-width: 1200px;
  background-color: #f9f9f9; // Fondo sutil
  border-radius: $border-radius-lg;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.03);

  &-header {
    margin-bottom: $spacing-xl;
    text-align: center;
  }

  &-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: $spacing-md;
    color: $text-color;
    font-family: $font-family-primary;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background-color: $primary-color;
    }
  }

  &-description {
    max-width: 600px;
    margin: $spacing-lg auto 0;
    color: $text-color-secondary;
    font-size: $font-size-base;
    line-height: 1.6;
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: $spacing-lg;
    justify-items: center;
  }
}
}
  </style>
