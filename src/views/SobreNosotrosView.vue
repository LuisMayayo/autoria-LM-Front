<script setup>
import { ref } from 'vue';
import PageHero from '../components/PageHero.vue'
import SoporteInfo from '../components/SoporteInfo.vue'

const sections = ref([
  {
    title: "Nuestra Historia",
    content: "Desde nuestros inicios, nos hemos dedicado a ofrecer productos de decoración únicos y de alta calidad. Nuestra pasión por el diseño de interiores nos llevó a crear una tienda donde cada pieza tiene una historia y un propósito.",
  },
  {
    title: "Nuestra Misión",
    content: "Buscamos transformar cada hogar en un espacio acogedor y con estilo. Creemos que los pequeños detalles marcan la diferencia y queremos ayudarte a encontrar esos complementos que harán de tu casa un hogar.",
  },
  {
    title: "Nuestros Valores",
    content: "Calidad, Sostenibilidad, Innovación, Atención al Cliente",
  },
  {
    title: "Nuestro Equipo",
    content: "Contamos con expertos en diseño de interiores y decoración que trabajan para ofrecerte los mejores productos y asesoramiento personalizado.",
  },
  {
    title: "¿Por qué elegirnos?",
    content: "Productos seleccionados, Envíos rápidos, Atención personalizada, Materiales sostenibles, Diseños exclusivos",
  }
]);
</script>

<template>
  <div class="about">
    <PageHero title="Sobre Nosotros" imageSrc="/fotos/PageHero.jpg" />

    <div class="about__content">
      <div v-for="(section, index) in sections" :key="index" class="about__section">
        <h2 class="about__title">{{ section.title }}</h2>
        <p class="about__text">{{ section.content }}</p>
      </div>
    </div>

    <SoporteInfo />
  </div>
</template>

<style scoped>
.about__content {
  max-width: 900px;
  margin: 3rem auto;
  padding: 0 1rem;
}

.about__section {
  margin-bottom: 3rem;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  background-color: #f9f9f9;
  transition: box-shadow 0.3s ease;
}

.about__section:hover {
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.about__title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
  position: relative;
  display: inline-block;
}

.about__title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background-color: #666;
}

.about__text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
}

@media (min-width: 768px) {
  .about__title {
    font-size: 2.25rem;
  }

  .about__text {
    font-size: 1.2rem;
  }
}
</style>
