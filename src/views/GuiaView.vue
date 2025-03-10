<script setup>
import { ref } from 'vue';
import PageHero from '../components/PageHero.vue';

const secciones = ref([
  {
    titulo: "Textil",
    descripcion: "Los textiles transforman los espacios aportando calidez y personalidad. Combina cojines, mantas y alfombras para crear ambientes acogedores. Opta por colores neutros para armonía o estampados llamativos para un toque vibrante. Mezclar texturas como lino, terciopelo o lana añade profundidad y estilo.",
    imagen: "/fotos/Textil.jpg",
  },
  {
    titulo: "Decoración vertical",
    descripcion: "Aprovecha las paredes para agregar carácter a tu hogar. Cuadros, espejos, estanterías flotantes o paneles de madera pueden transformar un espacio vacío en un punto focal. Para un efecto equilibrado, juega con diferentes tamaños y composiciones. La iluminación estratégica resaltará cada elemento.",
    imagen: "/fotos/Decoración_Vertical.jpg",
  },
  {
    titulo: "Accesorio decorativo",
    descripcion: "Los accesorios son clave para dar un toque final a la decoración. Jarrones, velas, esculturas y elementos naturales como plantas añaden personalidad sin recargar el ambiente. Opta por materiales como cerámica, vidrio o metal para lograr una combinación sofisticada y armoniosa.",
    imagen: "/fotos/AccesorioDecorativo.jpg",
  },
]);
</script>

<template>
  <v-container fluid class="pa-0">
    <PageHero title="Guía de Decoración" imageSrc="/fotos/PageHero.jpg" />

    <v-container class="guia__container">
      <v-row justify="center">
        <v-col cols="12" lg="10" xl="8">
          <div v-for="(item, index) in secciones" :key="index" class="guia__seccion">
            <v-row align="center" :class="{ 'flex-row-reverse': index % 2 !== 0 }">
              <v-col cols="12" md="6">
                <v-img
                  :src="item.imagen"
                  :alt="item.titulo"
                  class="guia__imagen"
                  height="400"
                  cover
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="guia__content">
                  <h2 class="guia__titulo">{{ item.titulo }}</h2>
                  <p class="guia__descripcion">{{ item.descripcion }}</p>
                </div>
              </v-col>
            </v-row>
            <v-divider v-if="index !== secciones.length - 1" class="guia__divider" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped lang="scss">
.guia {
  &__container {
    padding: 40px 10px;
  }

  &__seccion {
    margin-bottom: 40px;
    text-align: center;
  }

  &__imagen {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  &__content {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__titulo {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    text-transform: uppercase;
  }

  &__descripcion {
    font-size: 1.1rem;
    color: #666;
    line-height: 1.6;
  }

  &__divider {
    margin: 40px 0;
  }
}

@media (min-width: 960px) {
  .guia {
    &__container {
      padding: 60px 20px;
    }

    &__seccion {
      text-align: left;
      margin-bottom: 60px;
    }

    &__content {
      padding: 20px;
    }
  }
}
</style>
