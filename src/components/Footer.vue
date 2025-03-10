<template>
  <v-footer app class="footer">
    <v-container>
      <v-row justify="center" class="footer__content">
        <v-col cols="12" md="3" class="footer__section">
          <nav class="footer__nav">
            <router-link to="/shop" class="footer__link">Tienda</router-link>
            <router-link to="/guia" class="footer__link">Guía</router-link>
            <router-link to="/contacto" class="footer__link">Contacto</router-link>
            <router-link to="/sobre-nosotros" class="footer__link">Sobre LM</router-link>
          </nav>
        </v-col>

        <v-col cols="12" md="3" class="footer__section footer__logo">
          <LogoCanvasWhite class="footer__logo-img" />
        </v-col>

        <v-col cols="12" md="3" class="footer__section footer__social">
          <v-btn icon class="footer__icon">
            <v-icon color="black">mdi-instagram</v-icon>
          </v-btn>
          <v-btn icon class="footer__icon">
            <v-icon color="black">mdi-linkedin</v-icon>
          </v-btn>
          <v-btn icon class="footer__icon">
            <v-icon color="black">mdi-youtube</v-icon>
          </v-btn>
          <v-btn icon class="footer__icon">
            <v-icon color="black">mdi-twitter</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="footer__divider"></v-divider>

      <v-row justify="center" class="footer__bottom">
        <v-col cols="12" class="text-center footer__copyright">
          2025 LM DECORACIONES. All rights reserved
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
import LogoCanvasWhite from '../components/LogoCanvasWhite.vue'
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;


.v-footer {
  position: relative !important;
}

.footer {
  background-color: $secondary-color;
  color: $background-color;
  padding: $spacing-lg 0;
  text-align: center;
  width: 100%;
  margin-top: auto;

  &__content {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__section {
    text-align: center;
  }

  &__nav {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
    margin-bottom: $spacing-md;
  }

  &__link {
    text-decoration: none;
    color: $background-color;
    font-size: $font-size-base;
    transition: color 0.3s;
    &:hover {
      color: $primary-color;
    }
    &--admin {
      font-size: $font-size-small;
      opacity: 0.7;
      &:hover {
        opacity: 1;
      }
    }
  }

  &__logo-img {
    height: 50px;
    margin-bottom: $spacing-sm;
  }

  &__social {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
  }

  &__icon {
    background-color: white;
    border-radius: 50%;
    padding: 8px;
    transition: transform 0.3s;
    &:hover {
      transform: scale(1.1);
      color: $primary-color;
    }
  }

  &__divider {
    margin: $spacing-md auto;
    width: 90%;
    background-color: rgba(255, 255, 255, 0.2);
  }

  &__bottom {
    margin-top: $spacing-md;
  }

  &__copyright {
    font-size: $font-size-small;
  }

}
</style>
