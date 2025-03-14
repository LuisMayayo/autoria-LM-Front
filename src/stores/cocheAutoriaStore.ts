// src/stores/cocheAutoriaStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

/**
 * Interfaz que representa un coche con autoría, incluyendo nuevos campos.
 */
export interface CocheAutoriaAutoria {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  descipción: string;
}

/**
 * Store de Pinia para gestionar CocheAutoria.
 * Incluye métodos para realizar operaciones CRUD contra el endpoint.
 */
export const useCocheAutoriaStore = defineStore('cocheAutoria', {
  state: () => ({
    // Lista de coches que se mostrará en la vista.
    coches: [] as CocheAutoria[],
    // Indicador de carga para mostrar estado de la operación.
    loading: false,
    // Mensaje de error en caso de que ocurra algún problema.
    error: null as string | null,
  }),
  actions: {
    /**
     * Obtiene todos los coches desde el API REST.
     */
    async fetchCoches() {
      console.log("Store: Iniciando la carga de coches...");
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<CocheAutoria[]>('http://localhost:5162/api/CocheAutoriaAutoria');
        this.coches = response.data;
        console.log("Store: Coches cargados correctamente:", this.coches);
      } catch (error: any) {
        this.error = error.message;
        console.error("Store: Error al cargar coches:", error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Obtiene un coche por su identificador.
     * @param id - El identificador del coche a obtener.
     * @returns El coche o null en caso de error.
     */
    async fetchCocheById(id: number): Promise<CocheAutoria | null> {
      console.log(`Store: Obteniendo coche con id: ${id}`);
      try {
        const response = await axios.get<CocheAutoria>(`http://localhost:5162/api/CocheAutoriaAutoria/${id}`);
        console.log("Store: Coche obtenido:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Store: Error al obtener coche por id:", error);
        return null;
      }
    },

    /**
     * Crea un nuevo coche.
     * @param coche - Los datos del coche a crear (sin el id).
     * @returns El coche creado o null en caso de error.
     */
    async createCoche(coche: Omit<CocheAutoria, 'id'>): Promise<CocheAutoria | null> {
      console.log("Store: Creando coche...", coche);
      try {
        const response = await axios.post<CocheAutoria>('http://localhost:5162/api/CocheAutoriaAutoria', coche);
        console.log("Store: Coche creado:", response.data);
        // Agregar el nuevo coche a la lista local.
        this.coches.push(response.data);
        return response.data;
      } catch (error: any) {
        console.error("Store: Error al crear coche:", error);
        return null;
      }
    },

    /**
     * Actualiza un coche existente.
     * @param coche - El coche con los datos actualizados.
     * @returns true si la actualización fue exitosa, false en caso de error.
     */
    async updateCoche(coche: CocheAutoria): Promise<boolean> {
      console.log("Store: Actualizando coche...", coche);
      try {
        await axios.put(`http://localhost:5162/api/CocheAutoriaAutoria/${coche.id}`, coche);
        console.log("Store: Coche actualizado exitosamente");
        // Actualizar el coche en la lista local.
        const index = this.coches.findIndex(p => p.id === coche.id);
        if (index !== -1) {
          this.coches[index] = coche;
        }
        return true;
      } catch (error: any) {
        console.error("Store: Error al actualizar coche:", error);
        return false;
      }
    },

    /**
     * Elimina un coche por su identificador.
     * @param id - El identificador del coche a eliminar.
     * @returns true si la eliminación fue exitosa, false en caso de error.
     */
    async deleteCoche(id: number): Promise<boolean> {
      console.log(`Store: Eliminando coche con id: ${id}`);
      try {
        await axios.delete(`http://localhost:5162/api/CocheAutoriaAutoria/${id}`);
        console.log("Store: Coche eliminado exitosamente");
        // Remover el coche de la lista local.
        this.coches = this.coches.filter(p => p.id !== id);
        return true;
      } catch (error: any) {
        console.error("Store: Error al eliminar coche:", error);
        return false;
      }
    }
  },
});
