<template>
  <VApp class="app">
    <NavBar />
    <div class="layout">
      <VMain class="main">
        <VContainer fluid class="pa-0">
          <RouterView />
        </VContainer>
      </VMain>
    </div>
    <Footer />
  </VApp>
</template>

<script setup>
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
</script>

<style lang="scss">
// Correcto desde App.vue
@use './styles/variables' as *;



.app {
  background-color: $background-color !important;
  color: $text-color;
  font-family: $font-family-primary;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
  background-color: $background-color !important;
}

.v-main {
  padding-bottom: 0 !important;
}

.content {
  flex-grow: 1;
  display: flex;
  align-items: center;
}
</style>
