<template>
  <div class="forgot-view">
    <!-- Imagen de fondo -->
    <div class="background-image"></div>

    <!-- Contenedor del formulario -->
    <div class="forgot">
      <h1 class="forgot__title">Olvidé mi contraseña</h1>
      <form class="forgot__form" @submit.prevent="handleForgotPassword">
        <div class="forgot__group">
          <label class="forgot__label" for="email">Email</label>
          <input class="forgot__input" type="email" id="email" v-model="email" required />
        </div>
        <button class="forgot__button" type="submit" :disabled="loading">
          {{ loading ? 'Enviando enlace...' : 'Enviar enlace' }}
        </button>
        <p v-if="message" class="forgot__message">{{ message }}</p>
        <p v-if="error" class="forgot__error">{{ error }}</p>
      </form>
      <div class="forgot__links">
        <router-link class="forgot__link" to="/login">Volver a iniciar sesión</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';

const email = ref('');
const loading = ref(false);
const error = ref('');
const message = ref('');
const userStore = useUserStore();

const handleForgotPassword = async () => {
  loading.value = true;
  error.value = '';
  message.value = '';
  try {
    const res = await userStore.forgotPassword(email.value);
    message.value = res;
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.forgot-view {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Imagen de fondo */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/fotos/login-register.jpg') no-repeat center center;
  background-size: cover;
  opacity: 0.3;
  z-index: 0;
}

/* Contenedor del formulario */
.forgot {
  position: relative;
  z-index: 1;
  width: 90%;
  max-width: 400px;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &__title {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #333;
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
  }

  &__input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  &__button {
    padding: 0.75rem;
    background-color: #ffc107;
    color: #000;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #e0a800; 
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__message {
    color: green;
    margin-top: 1rem;
  }

  &__error {
    color: red;
    margin-top: 1rem;
  }

  &__links {
    margin-top: 1rem;
  }

  &__link {
    color: #007bff;
    text-decoration: none;
  }
}

/* Media queries para pantallas más grandes */
@media (min-width: 768px) {
  .forgot {
    padding: 2rem;
    max-width: 400px;
  }
}
</style>
