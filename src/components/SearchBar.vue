<template>
  <div class="search">
    <v-autocomplete
      v-model="selectedItem"
      :menu="menuOpen"
      @update:menu="menuOpen = $event"
      :items="filteredItems"
      :search-input.sync="searchQuery"
      placeholder="Buscar productos..."
      variant="plain"
      density="compact"
      hide-details
      class="search__field"
      prepend-inner-icon="mdi-magnify"
      dark
      return-object
      item-title="nombre"
      @update:search-input="onSearchInput"
      @keydown.enter.prevent="onEnter"
      :menu-props="{ attach: 'body', offsetY: true }"
    >
      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props" class="search-item">
          <div class="search-item__content">
            <v-list-item-title>{{ item.raw.nombre }}</v-list-item-title>
          </div>
          <v-img
            :src="item.raw.urlImagen"
            width="50"
            height="50"
            class="rounded-img"
          ></v-img>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useProductsStore } from '../stores/productsStore';
import { useRouter } from 'vue-router';
import debounce from 'lodash/debounce';

const router = useRouter();
const store = useProductsStore();

const searchQuery = ref('');
const selectedItem = ref(null);
const menuOpen = ref(false); // Controla si el menú está abierto

const filteredItems = computed(() => store.allProducts);

// Al escribir, se busca y se abre el menú
const onSearchInput = debounce(async (query: string) => {
  searchQuery.value = query.trim();
  if (!searchQuery.value) {
    await store.fetchProducts();
    return;
  }
  await store.searchProducts(searchQuery.value);
  menuOpen.value = true;
}, 300);

const redirectToProductDetail = (id: number) => {
  console.log('Redirigiendo a producto con ID:', id);
  window.location.href = `/product/${id}`;
};

const onEnter = () => {
  if (!searchQuery.value) return;
  const matchedProduct = store.allProducts.find((item) =>
    item.raw.nombre.toLowerCase() === searchQuery.value.toLowerCase()
  );
  if (matchedProduct && matchedProduct.raw.id) {
    redirectToProductDetail(matchedProduct.raw.id);
  } else {
    router.push({ name: 'Products', query: { search: searchQuery.value } });
  }
};

watch(selectedItem, (value) => {
  if (value && typeof value === 'object') {
    const productId = value.raw ? value.raw.id : value.id;
    if (productId) {
      redirectToProductDetail(productId);
    }
  }
});

// Función para cerrar el menú inmediatamente al detectar scroll
const onScroll = () => {
  if (menuOpen.value) {
    menuOpen.value = false;
  }
};

onMounted(() => {
  if (store.allProducts.length === 0) {
    store.fetchProducts();
  }
  window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped lang="scss">
@use '../styles/variables' as *;


.search {
  width: 100%;
  max-width: 300px;
}

.search__field {
  border-bottom: 1px solid #000000 !important;
  border-radius: 0;
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;

  &:hover,
  &:focus-within {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.rounded-img {
  border-radius: 8px;
  margin-left: 16px;
  object-fit: cover;
}

:deep(.v-field__input) {
  padding-top: 0;
  padding-bottom: 0;
  min-height: 32px;
  color: #000000 !important;
}

:deep(.mdi-magnify) {
  color: #000000 !important;
}

:deep(.v-autocomplete__content) {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

:deep(.v-list-item) {
  padding: 8px 16px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

:deep(.v-list-item__content) {
  display: flex;
}

@media (min-width: 768px) {
  .search {
    width: 300px;
  }
}

@media (min-width: 1024px) {
  .search {
    width: 350px;
  }
}
</style>
