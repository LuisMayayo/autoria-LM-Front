import { defineStore } from 'pinia';
import axios from 'axios';

/**
 * Interfaz que representa un balon con autoría.
 */
export interface Balon {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  descripción: string; // Cambiado para coincidir con el backend
  tamaño: string; 
}

/**
 * Store Pinia para gestionar Balon.
 * Incluye métodos CRUD y filtrado por título y autor.
 */
export const useBalonStore = defineStore('balon', {
  state: () => ({
    balones: [] as Balon[],
    loading: false,
    error: null as string | null,
    filtroNombre: '' // Estado para el filtro por título
  }),

  getters: {
    /**
     * Devuelve los balones filtrados según el título y el autor.
     */
    balonesFiltrados(state): Balon[] {
      let balonesFiltrados = state.balones;

      // Filtrar por título si hay texto en `filtroNombre`
      if (state.filtroNombre) {
        balonesFiltrados = balonesFiltrados.filter(p =>
          p.nombre.toLowerCase().includes(state.filtroNombre.toLowerCase())
        );
      }


      return balonesFiltrados;
    }
  },

  actions: {
    /**
     * Obtiene todos los balones desde la API REST.
     */
    async fetchBalones() {
      console.log("Store: Iniciando la carga de balones...");
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<Balon[]>('http://localhost:5162/api/Balon');
        this.balones = response.data;
        console.log("Store: Balones cargados correctamente:", this.balones);
      } catch (error: any) {
        this.error = error.message;
        console.error("Store: Error al cargar balones:", error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Actualiza el filtro por título.
     */
    setFiltroNombre(filtro: string) {
      this.filtroNombre = filtro;
    },


    /**
     * Obtiene un balon por su identificador.
     * @param id - El identificador del balon a obtener.
     * @returns El balon o null en caso de error.
     */
    async fetchBalonById(id: number): Promise<Balon | null> {
      console.log(`Store: Obteniendo balon con id: ${id}`);
      try {
        const response = await axios.get<Balon>(`http://localhost:5162/api/Balon/${id}`);
        console.log("Store: Balon obtenido:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Store: Error al obtener balon por id:", error);
        return null;
      }
    },

    /**
     * Crea un nuevo balon.
     * @param balon - Los datos del balon a crear (sin el id).
     * @returns El balon creado o null en caso de error.
     */
    async createBalon(balon: Omit<Balon, 'id'>): Promise<Balon | null> {
        console.log("Store: Creando balon...", balon);
        try {
          const response = await axios.post<Balon>('http://localhost:5162/api/Balon', balon, {
            headers: {
              'Content-Type': 'application/json' // Asegurar encabezado correcto
            }
          });
          console.log("Store: Balon creado:", response.data);
          this.balones.push(response.data); // Agregar a la lista local
          return response.data;
        } catch (error: any) {
          if (error.response) {
            console.error("Store: Error al crear balon:", error.response.data); // Detalles del error
            console.error("Status:", error.response.status); // Código de estado
          } else {
            console.error("Store: Error desconocido:", error.message);
          }
          return null;
        }
      },
      
      

    /**
     * Actualiza un balon existente.
     * @param balon - El balon con los datos actualizados.
     * @returns true si la actualización fue exitosa, false en caso de error.
     */
    async updateBalon(balon: Balon): Promise<boolean> {
      console.log("Store: Actualizando balon...", balon);
      try {
        await axios.put(`http://localhost:5162/api/Balon/${balon.id}`, balon);
        console.log("Store: Balon actualizado exitosamente");
        // Actualizar el balon en la lista local.
        const index = this.balones.findIndex(p => p.id === balon.id);
        if (index !== -1) {
          this.balones[index] = balon;
        }
        return true;
      } catch (error: any) {
        console.error("Store: Error al actualizar balon:", error);
        return false;
      }
    },

    /**
     * Elimina un balon por su identificador.
     * @param id - El identificador del balon a eliminar.
     * @returns true si la eliminación fue exitosa, false en caso de error.
     */
    async deleteBalon(id: number): Promise<boolean> {
      console.log(`Store: Eliminando balon con id: ${id}`);
      try {
        await axios.delete(`http://localhost:5162/api/Balon/${id}`);
        console.log("Store: Balon eliminado exitosamente");
        // Remover el balon de la lista local.
        this.balones = this.balones.filter(p => p.id !== id);
        return true;
      } catch (error: any) {
        console.error("Store: Error al eliminar balon:", error);
        return false;
      }
    }
  },
});
