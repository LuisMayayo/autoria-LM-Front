<template>
  <div ref="googleButton"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const googleButton = ref<HTMLElement | null>(null);

// Tu Client ID real de Google
const clientId = '729982024532-k7i01sv0o77u3k26hnq12id3bo7oqpba.apps.googleusercontent.com';

function handleCredentialResponse(response: any) {
  console.log('Google ID token:', response.credential);
  userStore.googleLogin(response.credential);
}

// Función para recargar la página solo una vez
function reloadPageOnce() {
  if (!sessionStorage.getItem('reloaded')) {
    sessionStorage.setItem('reloaded', 'true'); // Marcar que ya recargó
    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 segundo
  }
}

onMounted(() => {
  if (window.google) {
    // 1) Inicializar Google Sign-In
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse
    });

    // 2) Renderizar el botón
    if (googleButton.value) {
      window.google.accounts.id.renderButton(googleButton.value, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left'
      });
    }

    // 3) Recargar la página solo una vez
    reloadPageOnce();
  } else {
    console.warn('Google Identity Services no está cargado.');
    reloadPageOnce(); // Si no está cargado, también recarga la página solo una vez
  }
});
</script>
