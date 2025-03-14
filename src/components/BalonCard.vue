<!-- src/components/BalonCard.vue -->
<template>
    <div class="card">
        <div class="card-header">
            <h3>{{ balon.nombre }}</h3>
        </div>
        <div class="card-body">
            <p><strong>marca:</strong> {{ balon.marca }}</p>
            <p><strong>Precio:</strong> €{{ balon.precio.toFixed(2) }}</p>
            <p><strong>descripción:</strong> {{ balon.descripción }}</p>
            <p><strong>tamaño:</strong> {{ balon.tamaño }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

/**
 * Interfaz que representa un balon con autoría, incluyendo los nuevos campos.
 */
interface Balon {
    id: number;
    nombre: string;
    marca: string;
    precio: number;
    descripción: string;
    tamaño: string;
}

/**
 * Define las propiedades que recibe el componente.
 */
const props = defineProps<{
    balon: Balon;
}>();

// Log para verificar que el componente recibe los datos correctamente.
console.log("BalonCard: Balon recibido", props.balon);
</script>

<style scoped>
.card {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 16px;
    margin: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
    border-bottom: 1px solid #eee;
    margin-bottom: 8px;
}
</style>