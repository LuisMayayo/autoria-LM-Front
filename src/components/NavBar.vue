<template>
  <header class="navbar">
    <div class="navbar__container">
      <!-- Barra superior -->
      <div class="navbar__top">
        <!-- Buscador (izquierda) -->
        <div class="navbar__search">
          <SearchBar />
        </div>
        
        <!-- Logo (centro) -->
        <div class="navbar__logo">
          <router-link to="/">
            <LogoCanvasBlack class="navbar__logo-img" />
          </router-link>
        </div>
        
        <!-- Iconos (derecha) -->
        <div class="navbar__icons">
          <!-- Usuario no autenticado -->
          <router-link 
            to="/login" 
            class="navbar__icon" 
            v-if="!store.isAuthenticated"
          >
            <v-icon size="28">mdi-account</v-icon>
            <span class="navbar__icon-text">Iniciar sesión</span>
          </router-link>
          
          <!-- Usuario autenticado -->
          <div class="navbar__user" v-else>
            <div class="navbar__user-dropdown" @click="toggleUserMenu">
              <v-icon size="28">mdi-account</v-icon>
              <span class="navbar__user-name">{{ getUserName }}</span>
              <v-icon size="20">
                {{ isUserMenuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
            </div>
            
            <!-- Menú desplegable del usuario -->
            <div class="navbar__user-menu" v-if="isUserMenuOpen">
              <router-link to="/mi-cuenta" class="navbar__user-menu-item">
                <v-icon size="20">mdi-account-details</v-icon>
                Mi cuenta
              </router-link>
              <div class="navbar__user-menu-item" @click="logout">
                <v-icon size="20">mdi-logout</v-icon>
                Cerrar sesión
              </div>
            </div>
          </div>
          
          <!-- Carrito -->
          <router-link to="/cart" class="navbar__icon navbar__cart">
            <!-- Reemplazamos el antiguo <v-icon> por nuestro componente SVG -->
            <CartIcon :size="28" :fill="'#000'" />
            <span v-if="cartStore.totalItems > 0" class="navbar__cart-badge">
              {{ cartStore.totalItems }}
            </span>
          </router-link>
        </div>
      </div>
      
      <!-- Separador horizontal -->
      <div class="navbar__divider"></div>
      
      <!-- Menú inferior -->
      <nav class="navbar__menu">
        <router-link
          to="/shop"
          class="navbar__menu-item"
          :class="{ 'navbar__menu-item--active': $route.path.startsWith('/shop') }"
        >
          Tienda
        </router-link>
        <router-link
          to="/guia"
          class="navbar__menu-item"
          :class="{ 'navbar__menu-item--active': $route.path.startsWith('/guia') }"
        >
          Guía
        </router-link>
        <router-link
          to="/contacto"
          class="navbar__menu-item"
          :class="{ 'navbar__menu-item--active': $route.path.startsWith('/contacto') }"
        >
          Contacto
        </router-link>
        <router-link
          to="/sobre-nosotros"
          class="navbar__menu-item"
          :class="{ 'navbar__menu-item--active': $route.path.startsWith('/sobre-nosotros') }"
        >
          Sobre LM
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useCartStore } from '../stores/cartStore'
import LogoCanvasBlack from '../components/LogoCanvasBlack.vue'
import SearchBar from '../components/SearchBar.vue'
import CartIcon from '../components/icons/CartIcon.vue' // <-- Importamos el ícono SVG personalizado

const router = useRouter()
const route = useRoute()
const store = useUserStore()
const cartStore = useCartStore()
const isUserMenuOpen = ref(false)

// Obtener el nombre de usuario para mostrar
const getUserName = computed(() => {
  if (!store.user) return ''
  
  // Si hay un nombre, mostrar el primer nombre
  if (store.user.nombre) {
    return store.user.nombre.split(' ')[0]
  }
  
  // Si no hay nombre pero hay email, mostrar la parte antes del @
  if (store.user.email) {
    return store.user.email.split('@')[0]
  }
  
  return 'Usuario'
})

// Alternar el menú de usuario
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// Cerrar el menú cuando se hace clic fuera
const closeUserMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const userDropdown = document.querySelector('.navbar__user-dropdown')
  const userMenu = document.querySelector('.navbar__user-menu')
  
  if (
    userDropdown && 
    userMenu && 
    !userDropdown.contains(target) && 
    !userMenu.contains(target)
  ) {
    isUserMenuOpen.value = false
  }
}

// Cerrar sesión
const logout = (): void => {
  store.logout()
  router.push('/login')
  isUserMenuOpen.value = false
}

// Agregar listener para cerrar el menú al hacer clic fuera
onMounted(() => {
  document.addEventListener('click', closeUserMenu)
})

// Limpiar listener al desmontar
onBeforeUnmount(() => {
  document.removeEventListener('click', closeUserMenu)
})
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;



.navbar {
  width: 100%;
  background-color: $background-color;
  
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 15px 0;
  }
  
  &__search {
    order: 2;
    flex: 1;
    max-width: 100%;
    margin-top: 15px;
  }
  
  &__logo {
    order: 1;
    flex: 1;
    text-align: center;
    display: flex;
    justify-content: center;
    
    &-img {
      height: 60px;
    }
  }
  
  &__icons {
    order: 3;
    flex: 1;
    display: flex;
    gap: 24px;
    justify-content: flex-end;
    max-width: auto;
  }
  
  &__icon {
    color: #000 !important;
    cursor: pointer;
    position: relative;
    transition: transform 0.2s ease-in-out;
    display: flex;
    align-items: center;
    text-decoration: none;
    
    &:hover {
      transform: scale(1.05);
      color: $primary-color !important;
    }
    
    &-text {
      margin-left: 5px;
      font-size: 14px;
      display: none;
      
      @media (min-width: 768px) {
        display: inline;
      }
    }
  }
  
  &__user {
    position: relative;
    
    &-dropdown {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #000;
      transition: color 0.2s ease-in-out;
      
      &:hover {
        color: $primary-color;
      }
    }
    
    &-name {
      margin: 0 5px;
      font-weight: 500;
      display: none;
      
      @media (min-width: 768px) {
        display: inline;
      }
    }
    
    &-menu {
      position: absolute;
      top: 100%;
      right: -50px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 180px;
      z-index: 100;
      overflow: hidden;
      margin-top: 10px;
      
      &-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        color: $text-color;
        text-decoration: none;
        transition: background-color 0.2s ease-in-out;
        
        i {
          margin-right: 10px;
        }
        
        &:hover {
          background-color: $tertiary-color;
          color: $primary-color;
        }
      }
    }
  }
  
  &__cart {
    position: relative;
  }
  
  &__divider {
    height: 1px;
    background-color: #e0e0e0;
    width: 100%;
  }
  
  &__menu {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    padding: 15px 0;
    
    &-item {
      text-decoration: none;
      color: $text-color;
      font-family: $font-family-primary;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.5px;
      transition: color 0.3s ease-in-out;
      
      &:hover {
        color: $primary-color;
      }
      
      &--active {
        color: $primary-color;
      }
    }
  }
}

.navbar__cart-badge {
  position: absolute;
  top: -10px;
  right: -5px;
  background-color: #ff6347; 
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 50%;
  min-width: 20px;
  text-align: center;
  border: 1px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.05);
  }
}

@media (min-width: 768px) {
  .navbar {
    &__top {
      flex-wrap: nowrap;
    }
    
    &__search {
      order: 0;
      max-width: 300px;
      margin-top: 0;
    }
    
    &__logo {
      order: 0;
      
      &-img {
        height: 110px;
        margin-top: 15px;
      }
    }
    
    &__icons {
      order: 0;
      max-width: 300px;
      margin-left: 50px;
    }
    
    &__menu {
      flex-wrap: nowrap;
      gap: 60px;
      
      &-item {
        font-size: 25px;
      }
    }
    
    &__user-menu {
      right: 0; 
    }
  }
}
</style>
