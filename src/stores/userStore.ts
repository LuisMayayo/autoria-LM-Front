import { defineStore } from 'pinia';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useCartStore } from '../stores/cartStore';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false,
    error: '',
    isGoogleUser: localStorage.getItem('isGoogleUser') === 'true'
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    displayName: (state) => state.user?.nombre || state.user?.email || 'Invitado'
  },
  actions: {
    decodeToken(token: string) {
      try {
        return jwtDecode(token);
      } catch (err) {
        console.warn('Error decodificando el token:', err);
        return null;
      }
    },

    async fetchUserData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const decoded: any = this.decodeToken(token);
        if (!decoded?.sub) return;
        const userId = decoded.sub;
        const response = await axios.get(`/api/usuario/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Asignamos todo el objeto recibido a this.user
        this.user = response.data;
        // Mostramos en consola toda la información
        console.log("Información completa del usuario:", this.user);
        // Guardamos en localStorage la información completa
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
        toast.error("Error al obtener los datos del usuario.");
      }
    }
    ,
    async register(nombre: string, email: string, password: string) {
      this.loading = true;
      this.error = '';
      try {
        // Llamamos a la API de registro
        const response = await axios.post('/api/auth/register', {
          nombre,
          email,
          password
        });

        // Si el registro fue exitoso, podemos mostrar un mensaje
        toast.success("Registro exitoso. ¡Ya puedes iniciar sesión!");

        // Retornamos true o algo para indicar éxito
        return true;
      } catch (err) {
        console.error('Error en register:', err);
        this.error = 'Error al registrar usuario';
        toast.error("Error al registrar usuario.");
        return false;
      } finally {
        this.loading = false;
      }
    },
    async forgotPassword(email) {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.post('/api/auth/forgot-password', { email });
        toast.success("Check your email for password reset instructions.");
        return true;
      } catch (err) {
        console.error('Error in forgotPassword:', err);
        this.error = 'Error sending password reset email';
        toast.error("Error sending password reset email.");
        return false;
      } finally {
        this.loading = false;
      }
    },


    async updateUserProfile(datos: { nombre: string, telefono: string, direccion: string }) {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const decoded: any = this.decodeToken(token);
        if (!decoded?.sub) return;
        const userId = decoded.sub;
        await axios.put(`/api/usuario/${userId}`, datos, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (this.user) {
          this.user = { ...this.user, ...datos };
          localStorage.setItem('user', JSON.stringify(this.user));
        }
        toast.success("Perfil actualizado correctamente.");
      } catch (error) {
        console.error('Error actualizando perfil:', error);
        toast.error("Error al actualizar el perfil.");
      }
    },

    async updateUserPhoneAndAddress(telefono: string, direccion: string) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("No se encontró token de autenticación.");
          return;
        }
        const decoded: any = this.decodeToken(token);
        if (!decoded?.sub) return;
        const userId = decoded.sub;
        await axios.put(`/api/usuario/${userId}`, { telefono, direccion }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (this.user) {
          this.user.telefono = telefono;
          this.user.direccion = direccion;
          localStorage.setItem('user', JSON.stringify(this.user));
        }
      } catch (error: any) {
        console.error('Error actualizando teléfono y dirección:', error);
        toast.error(error.response?.data || "Error al actualizar teléfono y dirección.");
      }
    },

    // Actualizamos este método para llamar al endpoint reset-password
    async changePassword(nuevaContraseña: string) {
      try {
        // No se requiere enviar la contraseña actual para este endpoint
        await axios.post('/api/Auth/reset-password', {
          newPassword: nuevaContraseña
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        toast.success("Contraseña restablecida correctamente.");
      } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        toast.error("No se pudo restablecer la contraseña.");
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.post('/api/auth/login', { email, password });
        const { token } = response.data;
        if (!token) return;
        this.token = token;
        localStorage.setItem('token', token);
        const decoded: any = this.decodeToken(token);
        if (decoded) {
          this.user = {
            id: decoded.sub,
            email: decoded.email,
            nombre: decoded.name || decoded.email,
            role: decoded.role
          };
          localStorage.setItem('user', JSON.stringify(this.user));
          await this.fetchUserData();
        }
        toast.success(`¡Bienvenido, ${this.user.nombre}!`);
      } catch (err) {
        console.error('Error en login:', err);
        this.error = 'Error al iniciar sesión';
        toast.error("Error al iniciar sesión.");
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(token: string, newPassword: string) {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.post('/api/Auth/reset-password', {
          token,
          newPassword
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        toast.success("Contraseña restablecida correctamente.");
        return response.data;
      } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        this.error = 'No se pudo restablecer la contraseña.';
        toast.error("Error al restablecer la contraseña.");
        throw error;
      } finally {
        this.loading = false;
      }
    },


    async googleLogin(idToken: string) {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.post('/api/auth/google-login', { idToken });
        const { token } = response.data;
        if (!token) return;
        this.token = token;
        localStorage.setItem('token', token);
        localStorage.setItem('isGoogleUser', 'true');
        this.isGoogleUser = true;
        const decoded: any = this.decodeToken(token);
        if (decoded) {
          this.user = {
            id: decoded.sub,
            email: decoded.email,
            nombre: decoded.name || decoded.email,
            role: decoded.role
          };
          localStorage.setItem('user', JSON.stringify(this.user));
          await this.fetchUserData();
        }
        toast.success(`¡Bienvenido, ${this.user.nombre}!`);
      } catch (err) {
        console.error('Error en googleLogin:', err);
        toast.error("Error al iniciar sesión con Google.");
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = '';
      this.user = null;
      this.isGoogleUser = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isGoogleUser');
      const cartStore = useCartStore();
      cartStore.clearCart();
      toast.info("Sesión cerrada correctamente.");
    },

    initialize() {
      if (this.token) {
        const decoded: any = this.decodeToken(this.token);
        if (decoded) {
          this.user = {
            id: decoded.sub,
            email: decoded.email,
            nombre: decoded.name || decoded.email,
            role: decoded.role,
            telefono: this.user?.telefono || '',
            direccion: this.user?.direccion || ''
          };
          this.fetchUserData();
        } else {
          this.logout();
        }
      }
    }
  }
});
