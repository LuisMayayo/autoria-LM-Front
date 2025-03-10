// src/stores/productoAutoriaStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

/**
 * Interfaz que representa un producto con autoría.
 */
export interface ProductoAutoria {
  id: number;
  titulo: string;
  autor: string;
}

/**
 * Store de Pinia para gestionar ProductoAutoria.
 */
export const useProductoAutoriaStore = defineStore('productoAutoria', {
  state: () => ({
    // Lista de productos que se mostrará en la vista.
    productos: [] as ProductoAutoria[],
    // Indicador de carga.
    loading: false,
    // Almacena el mensaje de error si ocurre alguno.
    error: null as string | null,
  }),
  actions: {
    /**
     * Obtiene los productos desde el API REST.
     */
    async fetchProductos() {
      console.log("Store: Iniciando la carga de productos...");
      this.loading = true;
      this.error = null;
      try {
        // Se utiliza el endpoint completo según lo indicado.
        const response = await axios.get<ProductoAutoria[]>('http://localhost:5162/api/ProductoAutoria');
        this.productos = response.data;
        console.log("Store: Productos cargados correctamente:", this.productos);
      } catch (error: any) {
        this.error = error.message;
        console.error("Store: Error al cargar productos:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
