import { defineStore } from 'pinia';
import axios from 'axios';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  role: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

interface DetallePedido {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
}

interface Pedido {
  id: number;
  usuarioId: number;
  FechaPedido: Date;
  total: number;
  detalles?: DetallePedido[];
}

function parseFechaPedido(dateStr: string): Date {
  let date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    // Intenta extraer el timestamp del formato .NET: /Date(1648763622000)/
    const match = dateStr.match(/\/Date\((\d+)\)\//);
    if (match) {
      date = new Date(parseInt(match[1]));
    }
  }
  return date;
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [] as Usuario[],
    products: [] as Producto[],
    orders: [] as Pedido[],
    loading: false,
    error: null as string | null,
    token: localStorage.getItem('token') || ''
  }),

  actions: {
    // ======================
    //  MÉTODOS PARA USUARIOS
    // ======================
    async fetchAllUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<any[]>('/api/Usuario', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.users = response.data.map(user => ({
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          role: user.esAdmin ? 'Admin' : 'Usuario'
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
        this.error = 'Error al obtener usuarios';
      } finally {
        this.loading = false;
      }
    },

    async updateUser(user: Usuario) {
      this.error = null;
      try {
        // Preparamos el payload para la API:
        // Convertimos el rol a booleano: 'Admin' -> true, de lo contrario false.
        const payload = {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          esAdmin: user.role === 'Admin'
        };
        const response = await axios.put(`/api/Usuario/${user.id}`, payload, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        // Suponiendo que la API devuelve el usuario actualizado, mapeamos el campo booleano a string para la vista
        const updatedUser = response.data;
        const mappedUser = {
          id: updatedUser.id,
          nombre: updatedUser.nombre,
          email: updatedUser.email,
          role: updatedUser.esAdmin ? 'Admin' : 'Usuario'
        };
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = mappedUser;
        }
        return mappedUser;
      } catch (error) {
        console.error("Error updating user:", error);
        this.error = "Error al actualizar usuario";
        throw error;
      }
    }
    ,

    async deleteUser(userId: number) {
      this.error = null;
      try {
        await axios.delete(`/api/Usuario/${userId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.users = this.users.filter(u => u.id !== userId);
      } catch (error) {
        console.error('Error deleting user:', error);
        this.error = 'Error al eliminar usuario';
      }
    },

    // ========================
    //  MÉTODOS PARA PRODUCTOS
    // ========================
    async fetchAllProducts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<any[]>('/api/Producto', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.products = response.data.map(prod => ({
          id: prod.id,
          nombre: prod.nombre,
          precio: prod.precio,
          // Se contempla que la propiedad pueda venir en PascalCase o camelCase
          categoria: prod.categoriaNombre || prod.CategoriaNombre || 'Sin Categoría',
          descripcion: prod.descripcion || '',   // Agregamos descripción
          urlImagen: prod.urlImagen || ''          // Agregamos URL de imagen
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'Error al obtener productos';
      } finally {
        this.loading = false;
      }
    }
    ,

    async updateProduct(product: Producto) {
      this.error = null;
      try {
        await axios.put(`/api/Producto/${product.id}`, product, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = product;
        }
      } catch (error) {
        console.error('Error updating product:', error);
        this.error = 'Error al actualizar producto';
      }
    },

    async deleteProduct(productId: number) {
      this.error = null;
      try {
        await axios.delete(`/api/Producto/${productId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.products = this.products.filter(p => p.id !== productId);
      } catch (error) {
        console.error('Error deleting product:', error);
        this.error = 'Error al eliminar producto';
      }
    },
    async createNewProduct(productoParaEnviar: {
      nombre: string;
      precio: number;
      categoriaId: number;
      descripcion?: string;
      urlImagen?: string;
    }) {
      this.error = null;
      try {
        await axios.post('/api/Producto', productoParaEnviar, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        // Actualizamos la lista de productos
        await this.fetchAllProducts();
      } catch (error) {
        console.error('Error creando producto:', error);
        this.error = 'Error al crear producto';
        throw error;
      }
    }
    ,
  
    

    // ======================
    //  MÉTODOS PARA PEDIDOS
    // ======================
    async fetchAllOrders() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<any[]>('/api/Pedido', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.orders = response.data.map((order: any) => ({
          ...order,
          // Se utiliza la función auxiliar para parsear la fecha
          FechaPedido: parseFechaPedido(order.FechaPedido || order.fechaPedido)
        }));
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.error = 'Error al obtener pedidos';
      } finally {
        this.loading = false;
      }
    },

    async updateOrder(order: Pedido) {
      this.error = null;
      try {
        await axios.put(`/api/Pedido/${order.id}`, order, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
          this.orders[index] = order;
        }
      } catch (error) {
        console.error('Error updating order:', error);
        this.error = 'Error al actualizar pedido';
      }
    },

    async deleteOrder(orderId: number) {
      this.error = null;
      try {
        await axios.delete(`/api/Pedido/${orderId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.orders = this.orders.filter(o => o.id !== orderId);
      } catch (error) {
        if (error.response) {
          // Extract the detailed error message from the response
          const errorMessage = error.response.data;
          console.error('Error deleting order:', errorMessage);
          this.error = `Error al eliminar pedido: ${errorMessage}`;
        } else {
          console.error('Error deleting order:', error);
          this.error = 'Error al eliminar pedido';
        }
        throw error;
      }
    }

  }
});
