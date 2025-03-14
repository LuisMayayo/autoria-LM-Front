// src/stores/pruebaAutoriaStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

/**
 * Interfaz que representa un prueba con autoría, incluyendo nuevos campos.
 */
export interface PruebaAutoria {
  id: number;
  titulo: string;
  autor: string;
  precio: number;
  numeroSerie: string;
}

/**
 * Store de Pinia para gestionar PruebaAutoria.
 * Incluye métodos para realizar operaciones CRUD contra el endpoint.
 */
export const usePruebaAutoriaStore = defineStore('pruebaAutoria', {
  state: () => ({
    // Lista de pruebas que se mostrará en la vista.
    pruebas: [] as PruebaAutoria[],
    // Indicador de carga para mostrar estado de la operación.
    loading: false,
    // Mensaje de error en caso de que ocurra algún problema.
    error: null as string | null,
  }),
  actions: {
    /**
     * Obtiene todos los pruebas desde el API REST.
     */
    async fetchPruebas() {
      console.log("Store: Iniciando la carga de pruebas...");
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<PruebaAutoria[]>('http://localhost:5162/api/productobbdd');
        this.pruebas = response.data;
        console.log("Store: Pruebas cargados correctamente:", this.pruebas);
      } catch (error: any) {
        this.error = error.message;
        console.error("Store: Error al cargar pruebas:", error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Obtiene un prueba por su identificador.
     * @param id - El identificador del prueba a obtener.
     * @returns El prueba o null en caso de error.
     */
    async fetchPruebaById(id: number): Promise<PruebaAutoria | null> {
      console.log(`Store: Obteniendo prueba con id: ${id}`);
      try {
        const response = await axios.get<PruebaAutoria>(`http://localhost:5162/api/productobbdd/${id}`);
        console.log("Store: prueba obtenido:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Store: Error al obtener prueba por id:", error);
        return null;
      }
    },

    /**
     * Crea un nuevo prueba.
     * @param prueba - Los datos del prueba a crear (sin el id).
     * @returns El prueba creado o null en caso de error.
     */
    async createPrueba(prueba: Omit<PruebaAutoria, 'id'>): Promise<PruebaAutoria | null> {
      console.log("Store: Creando prueba...", prueba);
      try {
        const response = await axios.post<PruebaAutoria>('http://localhost:5162/api/productobbdd', prueba);
        console.log("Store: prueba creado:", response.data);
        // Agregar el nuevo prueba a la lista local.
        this.pruebas.push(response.data);
        return response.data;
      } catch (error: any) {
        console.error("Store: Error al crear prueba:", error);
        return null;
      }
    },

    /**
     * Actualiza un prueba existente.
     * @param prueba - El prueba con los datos actualizados.
     * @returns true si la actualización fue exitosa, false en caso de error.
     */
    async updatePrueba(prueba: PruebaAutoria): Promise<boolean> {
      console.log("Store: Actualizando prueba...", prueba);
      try {
        await axios.put(`http://localhost:5162/api/productobbdd/${prueba.id}`, prueba);
        console.log("Store: prueba actualizado exitosamente");
        // Actualizar el prueba en la lista local.
        const index = this.pruebas.findIndex(p => p.id === prueba.id);
        if (index !== -1) {
          this.pruebas[index] = prueba;
        }
        return true;
      } catch (error: any) {
        console.error("Store: Error al actualizar prueba:", error);
        return false;
      }
    },

    /**
     * Elimina un prueba por su identificador.
     * @param id - El identificador del prueba a eliminar.
     * @returns true si la eliminación fue exitosa, false en caso de error.
     */
    async deletePrueba(id: number): Promise<boolean> {
      console.log(`Store: Eliminando prueba con id: ${id}`);
      try {
        await axios.delete(`http://localhost:5162/api/productobbdd/${id}`);
        console.log("Store: prueba eliminado exitosamente");
        // Remover el prueba de la lista local.
        this.pruebas = this.pruebas.filter(p => p.id !== id);
        return true;
      } catch (error: any) {
        console.error("Store: Error al eliminar prueba:", error);
        return false;
      }
    }
  },
});
