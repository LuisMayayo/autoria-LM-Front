<script setup>
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { useToast } from 'vue-toastification';
import PageHero from '../components/PageHero.vue';
import SoporteInfo from '../components/SoporteInfo.vue';

const toast = useToast();

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const rules = {
  name: { required, minLength: minLength(3) },
  email: { required, email },
  subject: { minLength: minLength(3) },
  message: { required, minLength: minLength(10) },
};

const v$ = useVuelidate(rules, form);

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    console.log("Formulario enviado:", form.value);
    toast.success("Mensaje enviado con éxito.");
    v$.value.$reset();
    form.value = { name: '', email: '', subject: '', message: '' };
  } else {
    toast.error("Por favor, corrija los errores en el formulario.");
  }
};
</script>

<template>
  <div class="contact">
    <PageHero title="Contacto" imageSrc="/fotos/PageHero.jpg" />

    <div class="contact__container">
      <div class="contact__header">
        <h1 class="contact__title">Contacto con nosotros</h1>
        <p class="contact__text">
          Para obtener más información sobre nuestros productos y servicios, no dudes en enviarnos un mensaje.
          Nuestro equipo siempre estará disponible para ayudarte.
        </p>
      </div>

      <form @submit.prevent="submitForm" class="contact__form">
        <div class="contact__form-group">
          <label for="name">Nombre</label>
          <input id="name" v-model="form.name" type="text" :class="{ 'is-invalid': v$.name.$error }">
          <div v-if="v$.name.$error" class="error-message">El nombre es requerido y debe tener al menos 3 caracteres.</div>
        </div>

        <div class="contact__form-group">
          <label for="email">Correo electrónico</label>
          <input id="email" v-model="form.email" type="email" :class="{ 'is-invalid': v$.email.$error }">
          <div v-if="v$.email.$error" class="error-message">Por favor, introduce un correo electrónico válido.</div>
        </div>

        <div class="contact__form-group">
          <label for="subject">Asunto (opcional)</label>
          <input id="subject" v-model="form.subject" type="text" :class="{ 'is-invalid': v$.subject.$error }">
          <div v-if="v$.subject.$error" class="error-message">El asunto debe tener al menos 3 caracteres.</div>
        </div>

        <div class="contact__form-group">
          <label for="message">Mensaje</label>
          <textarea id="message" v-model="form.message" :class="{ 'is-invalid': v$.message.$error }"></textarea>
          <div v-if="v$.message.$error" class="error-message">El mensaje es requerido y debe tener al menos 10 caracteres.</div>
        </div>

        <button type="submit" class="contact__btn">Enviar</button>
      </form>
    </div>

    <SoporteInfo />
  </div>
</template>

<style scoped lang="scss">
.contact {
  &__container {
    max-width: 700px;
    margin: 2rem auto;
    padding: 0 1rem;

    @media (min-width: 768px) {
      margin: 3rem auto;
      padding: 0 1.5rem;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 1.75rem;
    color: #333;
    margin-bottom: 0.75rem;

    @media (min-width: 768px) {
      font-size: 2rem;
    }
  }

  &__text {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.5;
    max-width: 600px;
    margin: 0 auto;

    @media (min-width: 768px) {
      font-size: 1rem;
    }
  }

  &__form {
    background-color: #f9f9f9;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 3px 15px rgba(0,0,0,0.08);

    @media (min-width: 768px) {
      padding: 2.5rem;
    }
  }

  &__form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: bold;
    }

    input,
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #4CAF50;
      }
    }

    textarea {
      min-height: 150px;
    }
  }

  &__btn {
    width: 100%;
    padding: 0.75rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #45a049;
    }

    @media (min-width: 768px) {
      width: auto;
      min-width: 150px;
      margin: 0 auto;
      display: block;
    }
  }
}

.is-invalid {
  border-color: #dc3545 !important;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
</style>
