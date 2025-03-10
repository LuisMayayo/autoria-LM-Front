import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

// Definir la interfaz para una categoría
interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

export const useCategoriesStore = defineStore('categories', () => {
  const allCategories = ref<Category[]>([]); // Lista de categorías

  // Función para obtener las categorías desde la API
  const fetchCategories = async () => {
    try {
      const response = await axios.get('api/Categoria'); // ✅ Petición a la API
      const data = response.data; // ✅ Extrae los datos correctamente

      // Asignar datos correctamente usando la URL de imagen de la API
      allCategories.value = data.map((category: any) => ({
        id: category.id,
        name: category.nombre,
        description: category.descripcion,
        image: category.urlImagen && category.urlImagen.trim() !== "" ? category.urlImagen : '/fotos/default.jpg' // ✅ Si no hay imagen, usa una por defecto
      }));

      console.log("Categorías cargadas:", allCategories.value);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  return { allCategories, fetchCategories };
});
