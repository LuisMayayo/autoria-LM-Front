<template>
  <div class="login-view">
    <!-- Imagen de fondo -->
    <div class="background-image"></div>

    <!-- Contenedor del contenido de la vista (formulario, etc.) -->
    <div class="auth">
      <h1 class="auth__title">Iniciar Sesión</h1>
      <Alerta v-if="error" :mensaje="error" />
      <form class="auth__form" @submit.prevent="handleLogin">
        <div class="auth__group">
          <label for="email" class="auth__label">Email</label>
          <input
            type="email"
            id="email"
            class="auth__input"
            v-model="form.email"
            :class="{ 'is-invalid': v$.email.$error }"
          />
          <div v-if="v$.email.$error" class="error-message">
            Por favor, introduce un correo electrónico válido.
          </div>
        </div>
        <div class="auth__group">
          <label for="password" class="auth__label">Contraseña</label>
          <input
            type="password"
            id="password"
            class="auth__input"
            v-model="form.password"
            :class="{ 'is-invalid': v$.password.$error }"
          />
          <div v-if="v$.password.$error" class="error-message">
            La contraseña es obligatoria.
          </div>
        </div>
        <button type="submit" class="auth__button" :disabled="loading">
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>
      <div class="auth__links">
        <router-link class="auth__link" to="/register">Registrarse</router-link>
        <router-link class="auth__link" to="/forgot-password">Olvidé mi contraseña</router-link>
      </div>
      <div class="auth__google">
        <BotonGoogle v-if="!loading" />
      </div>
    </div>

    <!-- Modal para selección de página -->
    <div v-if="showAdminModal" class="modal-overlay">
      <div class="modal">
        <h2>Bienvenido Administrador</h2>
        <p>¿Qué página deseas ver?</p>
        <div class="modal-actions">
          <button @click="redirectToHome" class="modal-button">Ver Página</button>
          <button @click="redirectToAdmin" class="modal-button modal-button--admin">Página Admin</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email as emailValidator } from '@vuelidate/validators';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
import Alerta from '../components/Alerta.vue';
import BotonGoogle from '../components/BotonGoogle.vue';

const form = ref({
  email: '',
  password: '',
});

const rules = {
  email: { required, email: emailValidator },
  password: { required },
};

const v$ = useVuelidate(rules, form);

const loading = ref(false);
const error = ref('');
const showAdminModal = ref(false);
const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  if (userStore.isAuthenticated && userStore.user?.esAdmin) {
    showAdminModal.value = true;
  }
});

const handleLogin = async () => {
  // Validamos el formulario
  const isValid = await v$.value.$validate();
  if (!isValid) {
    error.value = "Por favor, corrija los errores del formulario.";
    return;
  }
  
  loading.value = true;
  error.value = '';
  try {
    await userStore.login(form.value.email, form.value.password);
    console.log("Usuario completo:", JSON.stringify(userStore.user, null, 2));
    
    if (userStore.isAuthenticated) {
      if (userStore.user?.esAdmin === true) {
        showAdminModal.value = true;
      } else {
        router.push('/');
      }
    }
  } catch (err) {
    console.error("Error en login:", err);
    error.value = 'Error al iniciar sesión. Verifica tus credenciales.';
  } finally {
    loading.value = false;
  }
};

const redirectToHome = () => {
  showAdminModal.value = false;
  router.push('/');
};

const redirectToAdmin = () => {
  showAdminModal.value = false;
  router.push('/admin');
};
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;


.login-view {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/fotos/login-register.jpg') no-repeat center center;
  background-size: cover;
  opacity: 0.3;
}

.auth {
  position: relative;
  z-index: 1;
  width: 90%;
  max-width: 400px;
  padding: $spacing-lg;
  background: rgba(255, 255, 255, 0.9);
  border-radius: $border-radius-lg;
}

/* Modal estilos */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: #fff;
  padding: $spacing-lg;
  border-radius: $border-radius-lg;
  text-align: center;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: $font-size-xl;
    margin-bottom: $spacing-md;
    color: $primary-color;
    font-family: $font-family-primary;
    font-weight: bold;
  }

  p {
    font-size: $font-size-base;
    margin-bottom: $spacing-lg;
    color: $text-color-secondary;
    font-family: $font-family-secondary;
    line-height: $line-height-base;
  }

  .modal-actions {
    display: flex;
    justify-content: space-around;
    margin-top: $spacing-md;

    .modal-button {
      padding: $spacing-sm $spacing-md;
      border-radius: $border-radius-sm;
      font-size: $font-size-base;
      cursor: pointer;
      transition: all $transition-fast;

      &--admin {
        background-color: $primary-color;
        color: white;
        border: none;
        font-weight: bold;

        &:hover {
          background-color: $primary-color-hover;
          transform: translateY(-2px);
        }

        &:active {
          transform: translateY(0);
        }
      }

      &:not(&--admin) {
        background-color: $tertiary-color;
        color: $text-color;
        border: 1px solid $border-color;

        &:hover {
          background-color: $tertiary-color-hover;
        }
      }
    }
  }
}

/* Resto de estilos del formulario */
.auth {
  &__title {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: $primary-color;
    font-weight: bold;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__group {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  &__label {
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: $text-color;
  }

  &__input {
    padding: 0.5rem;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    font-size: $font-size-base;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }
  }

  &__button {
    padding: 0.75rem;
    background-color: $primary-color;
    color: white;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    transition: background-color $transition-fast;
    font-weight: bold;

    &:hover {
      background-color: $primary-color-hover;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__links {
    margin-top: 1rem;
    display: flex;
    justify-content: space-around;
  }

  &__link {
    color: $primary-color;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__google {
    margin-top: 1.5rem;
  }
}

/* Estilos para mensajes de error y inputs inválidos */
.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.is-invalid {
  border-color: #dc3545 !important;
}

@media (min-width: 768px) {
  .auth {
    padding: 2rem;
    max-width: 400px;
  }

  .modal {
    max-width: 500px;

    .modal-actions {
      gap: $spacing-lg;

      .modal-button {
        min-width: 150px;
      }
    }
  }
}
</style>
