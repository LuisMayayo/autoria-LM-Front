import { createApp } from 'vue';
import App from '@/App.vue';

// Vuetify
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

// Notificaciones
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Estilos globales
import '@/styles/main.scss';

// Vue Router y Pinia
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useUserStore } from '@/stores/userStore';

const vuetify = createVuetify({
  components,
  directives,
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(vuetify);
app.use(Toast); 
app.mount('#app');

// Inicializa el store de usuario para restaurar la sesión (si existe)
const userStore = useUserStore();
userStore.initialize();
