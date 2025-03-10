<template>
  <div class="container">
    <h2>Restablecer Contraseña</h2>
    <div v-if="!token">
      <p class="error-message">Token no encontrado en la URL.</p>
    </div>
    <div v-else>
      <form @submit.prevent="handleResetPassword">
        <div class="form-group">
          <label for="newPassword">Nueva Contraseña</label>
          <input type="password" id="newPassword" v-model="newPassword" required />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Restableciendo...' : 'Restablecer Contraseña' }}
        </button>
      </form>
      <p v-if="message" class="success-message">{{ message }}</p>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const token = ref(route.query.token as string || '');
const newPassword = ref('');
const loading = ref(false);
const error = ref('');
const message = ref('');

const handleResetPassword = async () => {
  if (!token.value) {
    error.value = "Token no encontrado en la URL.";
    return;
  }
  loading.value = true;
  error.value = '';
  message.value = '';
  try {
    const res = await userStore.resetPassword(token.value, newPassword.value);
    message.value = res;
    // Opcional: redirigir al login tras el éxito
    // setTimeout(() => router.push('/login'), 3000);
  } catch (e: any) {
    error.value = e.message || "Error al restablecer la contraseña.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
}

.error-message {
  color: #ff0000;
  margin-top: 10px;
}

.success-message {
  color: #4CAF50;
  margin-top: 10px;
}
</style>
