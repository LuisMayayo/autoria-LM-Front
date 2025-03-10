<template>
  <v-container fluid class="benefits">
    <v-row justify="center">
      <v-col
        cols="12"
        sm="3"
        v-for="(benefit, index) in benefits"
        :key="index"
        class="benefits__item"
      >
        <v-icon class="benefits__icon">{{ benefit.icon }}</v-icon>
        <h3 class="benefits__title">{{ benefit.title }}</h3>
        <p class="benefits__text">{{ benefit.text }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const benefits = ref([
  { icon: 'mdi-trophy', title: 'Alta Calidad', text: 'Fabricado con los mejores materiales' },
  { icon: 'mdi-shield-check', title: 'Garantía de Protección', text: '2 años de garantía' },
  { icon: 'mdi-truck-fast', title: 'Envío Gratis', text: 'Pedidos superiores a 150€' },
  { icon: 'mdi-headset', title: 'Atención 24/7', text: 'Soporte personalizado' },
]);
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;


.benefits {
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  padding: 40px 0;
  background-color: #fff7e7;
  text-align: center;

  &__item {
    text-align: center;
  }

  &__icon {
    font-size: 2.5rem;
    color: #c99a2e;
  }

  &__title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 10px;
  }

  &__text {
    font-size: 0.9rem;
    color: #666;
  }
}
</style>
