import { defineStore } from 'pinia';
import axios from 'axios';

/**
 * Interfaz que representa un producto con autoría.
 */
export interface ProductoAutoria {
  id: number;
  titulo: string;
  autor: string;
  precio: number;
  numeroSerie: string;
}

/**
 * Store Pinia para gestionar ProductoAutoria.
 * Incluye métodos CRUD y filtrado por título y autor.
 */
export const useProductoAutoriaStore = defineStore('productoAutoria', {
  state: () => ({
    productos: [] as ProductoAutoria[],
    loading: false,
    error: null as string | null,
    filtroTitulo: '', // Estado para el filtro por título
    filtroAutor: '' ,  // Estado para el filtro por autor
    filtroNumeroSerie: ''   // Estado para el filtro filtroNumeroSerie
  }),

  getters: {
    /**
     * Devuelve los productos filtrados según el título y el autor.
     */
    productosFiltrados(state): ProductoAutoria[] {
      let productosFiltrados = state.productos;

      // Filtrar por título si hay texto en `filtroTitulo`
      if (state.filtroTitulo) {
        productosFiltrados = productosFiltrados.filter(p =>
          p.titulo.toLowerCase().includes(state.filtroTitulo.toLowerCase())
        );
      }

      // Filtrar por autor si hay texto en `filtroAutor`
      if (state.filtroAutor) {
        productosFiltrados = productosFiltrados.filter(p =>
          p.autor.toLowerCase().includes(state.filtroAutor.toLowerCase())
        );
      }

      // Filtrar por numeroSerie si hay texto en `filtroNumeroSerie`
      if (state.filtroNumeroSerie) {
        productosFiltrados = productosFiltrados.filter(p =>
          p.numeroSerie.toLowerCase().includes(state.filtroNumeroSerie.toLowerCase())
        );
      }

      return productosFiltrados;
    }
  },

  actions: {
    /**
     * Obtiene todos los productos desde la API REST.
     */
    async fetchProductos() {
      console.log("Store: Iniciando la carga de productos...");
      this.loading = true;
      this.error = null;
      try {
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

    /**
     * Actualiza el filtro por título.
     */
    setFiltroTitulo(filtro: string) {
      this.filtroTitulo = filtro;
    },

    /**
     * Actualiza el filtro por autor.
     */
    setFiltroAutor(filtro: string) {
      this.filtroAutor = filtro;
    },
    
    setFiltroNumeroSerie(filtro: string) {
      this.filtroNumeroSerie = filtro;
    },


    /**
     * Obtiene un producto por su identificador.
     * @param id - El identificador del producto a obtener.
     * @returns El producto o null en caso de error.
     */
    async fetchProductoById(id: number): Promise<ProductoAutoria | null> {
      console.log(`Store: Obteniendo producto con id: ${id}`);
      try {
        const response = await axios.get<ProductoAutoria>(`http://localhost:5162/api/ProductoAutoria/${id}`);
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
        const response = await axios.post<ProductoAutoria>('http://localhost:5162/api/ProductoAutoria', producto);
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
        await axios.put(`http://localhost:5162/api/ProductoAutoria/${producto.id}`, producto);
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
        await axios.delete(`http://localhost:5162/api/ProductoAutoria/${id}`);
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
