<template>
  <div class="register-view">
    <!-- Imagen de fondo -->
    <div class="background-image"></div>

    <!-- Contenedor del formulario de registro -->
    <div class="auth">
      <h1 class="auth__title">Registrarse</h1>
      <Alerta v-if="error" :mensaje="error" />
      <form class="auth__form" @submit.prevent="handleRegister">
        <div class="auth__group">
          <label for="nombre" class="auth__label">Nombre</label>
          <input
            type="text"
            id="nombre"
            class="auth__input"
            v-model="form.nombre"
            :class="{ 'is-invalid': v$.nombre.$error }"
          />
          <div v-if="v$.nombre.$error" class="error-message">
            El nombre es requerido y debe tener al menos 3 caracteres.
          </div>
        </div>
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
            La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.
          </div>
        </div>
        <button type="submit" class="auth__button" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>
      <div class="auth__links">
        <router-link class="auth__link" to="/login">Ya tengo cuenta, iniciar sesión</router-link>
      </div>
      <div class="auth__google">
        <!-- Botón para registrarse con Google (usa el mismo flujo de login) -->
        <BotonGoogle v-if="!loading" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
import Alerta from '../components/Alerta.vue';
import BotonGoogle from '../components/BotonGoogle.vue';

const form = ref({
  nombre: '',
  email: '',
  password: '',
});

// Expresión regular para validar la contraseña:
// Al menos 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const rules = {
  nombre: { required, minLength: minLength(3) },
  email: { required, email },
  password: {
    required,
    passwordPattern: (value: string) => passwordRegex.test(value),
  },
};

const v$ = useVuelidate(rules, form);

const loading = ref(false);
const error = ref('');
const userStore = useUserStore();
const router = useRouter();

const handleRegister = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    error.value = "Por favor, corrija los errores del formulario.";
    return;
  }
  loading.value = true;
  error.value = '';
  await userStore.register(form.value.nombre, form.value.email, form.value.password);
  error.value = userStore.error;
  loading.value = false;
  if (!error.value) {
    v$.value.$reset();
    form.value = { nombre: '', email: '', password: '' };
    router.push('/login');
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.register-view {
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
.auth {
  position: relative;
  z-index: 1;
  max-width: 400px;
  width: 90%;
  padding: $spacing-lg;
  background: rgba(255, 255, 255, 0.9);
  border-radius: $border-radius-lg;
  text-align: center;
  margin: 1rem;

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

  /* Estilo de botón igual al login */
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
    justify-content: center;
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

/* Estilos para inputs con error */
.is-invalid {
  border-color: #dc3545 !important;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

/* Media query para pantallas más grandes */
@media (min-width: 768px) {
  .auth {
    padding: 2rem;
  }
}
</style>
