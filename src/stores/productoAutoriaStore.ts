// src/stores/productoAutoriaStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

/**
 * Interfaz que representa un producto con autoría, incluyendo nuevos campos.
 */
export interface ProductoAutoria {
  id: number;
  titulo: string;
  autor: string;
  precio: number;
  numeroSerie: string;
}

/**
 * Store de Pinia para gestionar ProductoAutoria.
 * Incluye métodos para realizar operaciones CRUD contra el endpoint.
 */
export const useProductoAutoriaStore = defineStore('productoAutoria', {
  state: () => ({
    // Lista de productos que se mostrará en la vista.
    productos: [] as ProductoAutoria[],
    // Indicador de carga para mostrar estado de la operación.
    loading: false,
    // Mensaje de error en caso de que ocurra algún problema.
    error: null as string | null,
  }),
  actions: {
    /**
     * Obtiene todos los productos desde el API REST.
     */
    async fetchProductos() {
      console.log("Store: Iniciando la carga de productos...");
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<ProductoAutoria[]>('http://localhost:5162/api/productobbdd');
        this.productos = response.data;
        console.log("Store: Productos cargados correctamente:", this.productos);
      } catch (error: any) {
        this.error = error.message;
        console.error("Store: Error al cargar productos:", error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Obtiene un producto por su identificador.
     * @param id - El identificador del producto a obtener.
     * @returns El producto o null en caso de error.
     */
    async fetchProductoById(id: number): Promise<ProductoAutoria | null> {
      console.log(`Store: Obteniendo producto con id: ${id}`);
      try {
        const response = await axios.get<ProductoAutoria>(`http://localhost:5162/api/productobbdd/${id}`);
        console.log("Store: Producto obtenido:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Store: Error al obtener producto por id:", error);
        return null;
      }
    },

    /**
     * Crea un nuevo producto.
     * @param producto - Los datos del producto a crear (sin el id).
     * @returns El producto creado o null en caso de error.
     */
    async createProducto(producto: Omit<ProductoAutoria, 'id'>): Promise<ProductoAutoria | null> {
      console.log("Store: Creando producto...", producto);
      try {
        const response = await axios.post<ProductoAutoria>('http://localhost:5162/api/productobbdd', producto);
        console.log("Store: Producto creado:", response.data);
        // Agregar el nuevo producto a la lista local.
        this.productos.push(response.data);
        return response.data;
      } catch (error: any) {
        console.error("Store: Error al crear producto:", error);
        return null;
      }
    },

    /**
     * Actualiza un producto existente.
     * @param producto - El producto con los datos actualizados.
     * @returns true si la actualización fue exitosa, false en caso de error.
     */
    async updateProducto(producto: ProductoAutoria): Promise<boolean> {
      console.log("Store: Actualizando producto...", producto);
      try {
        await axios.put(`http://localhost:5162/api/productobbdd/${producto.id}`, producto);
        console.log("Store: Producto actualizado exitosamente");
        // Actualizar el producto en la lista local.
        const index = this.productos.findIndex(p => p.id === producto.id);
        if (index !== -1) {
          this.productos[index] = producto;
        }
        return true;
      } catch (error: any) {
        console.error("Store: Error al actualizar producto:", error);
        return false;
      }
    },

    /**
     * Elimina un producto por su identificador.
     * @param id - El identificador del producto a eliminar.
     * @returns true si la eliminación fue exitosa, false en caso de error.
     */
    async deleteProducto(id: number): Promise<boolean> {
      console.log(`Store: Eliminando producto con id: ${id}`);
      try {
        await axios.delete(`http://localhost:5162/api/productobbdd/${id}`);
        console.log("Store: Producto eliminado exitosamente");
        // Remover el producto de la lista local.
        this.productos = this.productos.filter(p => p.id !== id);
        return true;
      } catch (error: any) {
        console.error("Store: Error al eliminar producto:", error);
        return false;
      }
    }
  },
});
