<template>
  <div class="shop">
    <h1 class="shop__title">Productos</h1>

    <!-- Filtros -->
    <div class="shop__filters">
      <!-- Filtro de categorías -->
      <div class="shop__filter">
        <label for="categorySelect" class="shop__filter-label">
          Filtrar por categoría:
        </label>
        <select
          id="categorySelect"
          v-model="selectedCategory"
          class="shop__filter-select"
        >
          <option value="Todas">Todas</option>
          <option
            v-for="category in categoriesStore.allCategories"
            :key="category.id"
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Filtro de precio con slider -->
      <div class="shop__filter shop__filter--price">
        <label class="shop__filter-label">
          Precio: {{ priceRange[0] }}€ - {{ priceRange[1] }}€
        </label>
        <div class="shop__price-slider-container">
          <div class="shop__price-slider-track"></div>
          <div class="shop__price-slider-progress" :style="progressStyle"></div>
          <input 
            type="range" 
            v-model.number="priceRange[0]" 
            :min="productsStore.minProductPrice" 
            :max="productsStore.maxProductPrice"
            class="shop__price-slider shop__price-slider--min"
            @input="validatePriceRange"
          />
          <input 
            type="range" 
            v-model.number="priceRange[1]" 
            :min="productsStore.minProductPrice" 
            :max="productsStore.maxProductPrice"
            class="shop__price-slider shop__price-slider--max"
            @input="validatePriceRange"
          />
        </div>
        <div class="shop__price-labels">
          <span>{{ productsStore.minProductPrice }}€</span>
          <span>{{ productsStore.maxProductPrice }}€</span>
        </div>
      </div>
    </div>

    <!-- Mensaje de "sin resultados" -->
    <p v-if="filteredProducts.length === 0" class="no-results">
      No se encontraron productos con los filtros seleccionados
    </p>

    <!-- Lista de productos -->
    <div v-else class="products-grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :producto="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '../stores/productsStore';
import { useCategoriesStore } from '../stores/categoriesStore';
import ProductCard from '../components/ProductCard.vue';

const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const route = useRoute();
const router = useRouter();

// Categoría seleccionada
const selectedCategory = ref<string>('Todas');

// Rango de precio seleccionado [min, max]
const priceRange = ref<[number, number]>([0, 1000]);

// Estilo dinámico para la barra de progreso del slider de precio
const progressStyle = computed(() => {
  const min = ((priceRange.value[0] - productsStore.minProductPrice) / 
               (productsStore.maxProductPrice - productsStore.minProductPrice)) * 100;
  const max = ((priceRange.value[1] - productsStore.minProductPrice) / 
               (productsStore.maxProductPrice - productsStore.minProductPrice)) * 100;
  return {
    left: `${min}%`,
    width: `${max - min}%`
  };
});

// Validar que el rango mínimo no sea mayor que el máximo
const validatePriceRange = () => {
  if (priceRange.value[0] > priceRange.value[1]) {
    priceRange.value[0] = priceRange.value[1];
  }
  updateUrlWithFilters();
};

// Actualizar la URL con los filtros aplicados (categoría y precio)
const updateUrlWithFilters = () => {
  const query = { ...route.query };

  // Actualizar categoría
  if (selectedCategory.value !== 'Todas') {
    query.category = selectedCategory.value;
  } else {
    delete query.category;
  }

  // Actualizar rango de precios
  if (priceRange.value[0] > productsStore.minProductPrice) {
    query.minPrice = priceRange.value[0].toString();
  } else {
    delete query.minPrice;
  }
  
  if (priceRange.value[1] < productsStore.maxProductPrice) {
    query.maxPrice = priceRange.value[1].toString();
  } else {
    delete query.maxPrice;
  }

  router.push({ query });
};

// Función para realizar la búsqueda según el query "search"
const fetchProducts = async () => {
  const searchParam = route.query.search ? String(route.query.search) : '';
  if (searchParam) {
    await productsStore.searchProducts(searchParam);
  } else {
    await productsStore.fetchProducts();
  }
};

// Al montar el componente
onMounted(async () => {
  // Cargar categorías
  await categoriesStore.fetchCategories();
  // Realizar la búsqueda (si hay query search, se filtra; sino, carga todos)
  await fetchProducts();

  // Inicializar el rango de precios con los valores calculados en el store
  priceRange.value = [
    productsStore.minProductPrice,
    productsStore.maxProductPrice
  ];

  // Si en la URL hay filtros de categoría o precio, los aplicamos
  if (route.query.category) {
    selectedCategory.value = String(route.query.category);
  }
  if (route.query.minPrice) {
    priceRange.value[0] = Number(route.query.minPrice);
  }
  if (route.query.maxPrice) {
    priceRange.value[1] = Number(route.query.maxPrice);
  }
});

// Detectar cambios en el query de búsqueda y actualizar los productos
watch(
  () => route.query.search,
  async () => {
    await fetchProducts();
  }
);

// Watch para cambios en la categoría seleccionada y actualizar la URL
watch(selectedCategory, () => {
  updateUrlWithFilters();
});

// Computed: filtra los productos según la categoría y el rango de precio
const filteredProducts = computed(() => {
  let products = productsStore.allProducts;

  // Filtrar por categoría
  if (selectedCategory.value !== 'Todas') {
    const cat = categoriesStore.allCategories.find(
      (category) => category.name === selectedCategory.value
    );
    if (cat) {
      products = products.filter(
        (product) => product.categoriaId === cat.id
      );
    }
  }

  // Filtrar por rango de precio
  products = products.filter(product =>
    product.precio >= priceRange.value[0] &&
    product.precio <= priceRange.value[1]
  );

  return products;
});
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;


/* Estilos base */
.shop {
  width: 100%;
  padding: $spacing-md;
  text-align: center;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
}

/* Estilos del mensaje "sin resultados" */
.no-results {
  font-size: $font-size-base;
  font-weight: bold;
  color: #ff0000;
  margin-top: $spacing-md;
}

/* Título */
.shop__title {
  font-size: $font-size-xl;
  font-weight: bold;
  margin-bottom: $spacing-lg;
  margin-top: 0 !important;
}

/* Filtros */
.shop__filters {
  margin-bottom: $spacing-xl;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-lg;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.shop__filter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  width: 100%;
  max-width: 300px;

  &-label {
    font-size: $font-size-small;
    font-weight: bold;
    margin-bottom: 2px;
  }

  &-select {
    padding: $spacing-xs;
    font-size: $font-size-small;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    cursor: pointer;
    width: 100%;
    background: white;
  }
}

/* Slider de precio */
.shop__filter--price {
  width: 100%;
  max-width: 250px;
}

.shop__price-slider-container {
  position: relative;
  width: 100%;
  height: 30px;
  margin: $spacing-sm 0;
}

.shop__price-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  z-index: 2;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: $primary-color;
    cursor: pointer;
    pointer-events: auto;
    margin-top: -6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: $primary-color;
    cursor: pointer;
    pointer-events: auto;
    border: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
}

.shop__price-slider-track {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  width: 100%;
  background-color: $tertiary-color;
  border-radius: 4px;
  z-index: 1;
}

.shop__price-slider-progress {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background-color: $primary-color;
  border-radius: 4px;
  z-index: 1;
}

.shop__price-labels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 12px;
  color: $text-color-secondary;
  margin-top: -5px;
}

/* Grid de productos */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
  justify-items: center;
  max-width: 1100px;
  margin: 0 auto;
}

/* Media queries */
@media (min-width: $breakpoint-sm) {
  .shop {
    padding: $spacing-lg;
  }
}

@media (min-width: $breakpoint-md) {
  .shop__filters {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20%;
  }
  
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-lg;
  }
}

@media (min-width: $breakpoint-lg) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
    column-gap: $spacing-lg;
    row-gap: $spacing-xl;
  }
}
</style>
