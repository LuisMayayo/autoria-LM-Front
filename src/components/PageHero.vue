<template>
  <div class="page-hero">
    <img :src="imageSrc" alt="Hero Image" class="page-hero__image" />
    <h1 class="page-hero__title">{{ title }}</h1>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
    required: true,
  },
})
</script>

<style scoped lang="scss">
.page-hero {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.7);
  }

  &__title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-align: center;
  }
}
</style>
