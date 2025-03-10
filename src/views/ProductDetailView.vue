<template>
  <div class="product-detail">
    <!-- Indicador de carga -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando producto...</p>
    </div>

    <div v-else>
      <div class="product-detail__container">
        <div class="product-detail__image-wrapper">
          <img :src="product?.urlImagen" :alt="product?.nombre" class="product-detail__image" />
        </div>

        <div class="product-detail__info">
          <h1 class="product-detail__title">{{ product?.nombre }}</h1>
          <div class="product-detail__price-rating">
            <p class="product-detail__price">{{ product?.precio }} €</p>
            
            <!-- Calificación mejorada -->
            <div v-if="reseñaStore.promedioCalificacion > 0" class="product-detail__rating">
              <div class="stars">
                <span v-for="star in 5" :key="star" class="star" 
                      :class="{'star--filled': star <= Math.round(reseñaStore.promedioCalificacion)}">
                  ★
                </span>
              </div>
              <span class="rating-value">({{ reseñaStore.promedioCalificacion.toFixed(1) }})</span>
            </div>
          </div>
          
          <p class="product-detail__description">{{ product?.descripcion }}</p>
          <button class="product-detail__cart-btn" @click="addToCart">
            <i class="fas fa-shopping-cart"></i> Añadir al Carrito
          </button>
        </div>
      </div>

      <!-- SECCIÓN DE RESEÑAS MEJORADA -->
      <div class="product-reviews">
        <h2 class="product-reviews__title">Opiniones de clientes</h2>
        
        <div class="product-reviews__summary" v-if="reseñaStore.reseñas.length > 0">
          <div class="rating-summary">
            <div class="rating-average">
              <span class="rating-number">{{ reseñaStore.promedioCalificacion.toFixed(1) }}</span>
              <div class="stars">
                <span v-for="star in 5" :key="star" class="star" 
                      :class="{'star--filled': star <= Math.round(reseñaStore.promedioCalificacion)}">
                  ★
                </span>
              </div>
              <span class="total-reviews">{{ reseñaStore.reseñas.length }} opiniones</span>
            </div>
          </div>
        </div>

        <div v-if="reseñaStore.reseñas.length > 0" class="product-reviews__list">
          <div v-for="reseña in reseñaStore.reseñas" :key="reseña.id" class="review">
            <div class="review__header">
              <div class="review__user-info">
                <div class="review__avatar">{{ getInitials(reseña.usuario?.nombre) }}</div>
                <div class="review__user-details">
                  <p class="review__username">{{ reseña.usuario?.nombre || getUserPlaceholder(reseña.usuarioId) }}</p>
                  <div class="review__rating">
                    <div class="stars">
                      <span v-for="star in 5" :key="star" class="star" 
                            :class="{'star--filled': star <= reseña.calificacion}">
                        ★
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="review__date">{{ formatDate(reseña.fechaCreacion) }}</div>
            </div>
            
            <div class="review__content">
              <p>{{ reseña.comentario }}</p>
            </div>
            
            <div class="review__actions" v-if="userStore.user?.esAdmin || reseña.usuarioId === userStore.user?.id">
              <button @click="eliminarReseña(reseña.id)" class="review__delete-btn">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="product-reviews__empty">
          <p>No hay opiniones aún para este producto. ¡Sé el primero en compartir tu experiencia!</p>
        </div>

        <!-- FORMULARIO PARA AGREGAR UNA RESEÑA MEJORADO -->
        <div v-if="userStore.isAuthenticated" class="product-reviews__form">
          <h3 class="form-title">Comparte tu opinión</h3>
          
          <div class="rating-selector">
            <p>¿Cómo valorarías este producto?</p>
            <div class="stars-input">
              <span v-for="star in 5" :key="star" 
                    @click="calificacion = star" 
                    class="star" 
                    :class="{'star--filled': star <= calificacion}">
                ★
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="review-comment">Tu opinión</label>
            <textarea 
              id="review-comment"
              v-model="comentario" 
              placeholder="Comparte tu experiencia con este producto..." 
              rows="4"
              required></textarea>
          </div>
          
          <button @click="submitReview" class="product-reviews__submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Publicando...' : 'Publicar opinión' }}
          </button>
        </div>
        
        <div v-else class="product-reviews__login">
          <p>Inicia sesión para dejar tu opinión sobre este producto.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useCartStore } from '../stores/cartStore';
import { useReseñaStore } from '../stores/reseñaStore';
import { useUserStore } from '../stores/userStore';
import { useToast } from 'vue-toastification';

const route = useRoute();
const cartStore = useCartStore();
const reseñaStore = useReseñaStore();
const userStore = useUserStore();
const toast = useToast();

const product = ref(null);
const comentario = ref('');
const calificacion = ref<number>(0);
const isSubmitting = ref(false);
const isLoading = ref(true);

onMounted(async () => {
  await cargarProducto();
});

const cargarProducto = async () => {
  isLoading.value = true;
  try {
    const productoId = route.params.id;
    const [productoResponse] = await Promise.all([
      axios.get(`/api/Producto/${productoId}`)
    ]);
    
    product.value = productoResponse.data;
    
    await Promise.all([
      reseñaStore.fetchReseñasByProductoId(product.value.id),
      reseñaStore.fetchPromedioCalificacion(product.value.id)
    ]);
    
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    setTimeout(() => {
      toast.error("No se pudo cargar la información del producto");
    }, 500);
  } finally {
    isLoading.value = false;
  }
};

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart({
      id: product.value.id,
      name: product.value.nombre,
      price: product.value.precio,
      image: product.value.urlImagen,
    });
  }
};

const submitReview = async () => {
  if (!comentario.value || calificacion.value === 0) {
    toast.warning("Por favor, escribe un comentario y selecciona una calificación");
    return;
  }

  try {
    isSubmitting.value = true;
    await reseñaStore.agregarReseña(product.value.id, userStore.user.id, comentario.value, calificacion.value);
    
    toast.success("¡Tu opinión ha sido publicada con éxito!");
    comentario.value = '';
    calificacion.value = 0;
    
    // Actualizamos la lista y la media de reseñas sin recargar la página
    await Promise.all([
      reseñaStore.fetchReseñasByProductoId(product.value.id),
      reseñaStore.fetchPromedioCalificacion(product.value.id)
    ]);
  } catch (error) {
    toast.error("No se pudo publicar tu opinión. Inténtalo de nuevo más tarde.");
  } finally {
    isSubmitting.value = false;
  }
};

const eliminarReseña = async (reseñaId: number) => {
  if (confirm("¿Estás seguro de que deseas eliminar esta opinión?")) {
    try {
      await reseñaStore.eliminarReseña(reseñaId);
      toast.success("La opinión ha sido eliminada correctamente");
      // Recargamos la página para actualizar la media real
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("No se pudo eliminar la opinión. Inténtalo de nuevo más tarde.");
    }
  }
};

const getInitials = (name: string | undefined): string => {
  if (!name) return "U";
  return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
};

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const getUserPlaceholder = (userId: number): string => {
  return `Usuario ${userId.toString().slice(-4)}`;
};
</script>



<style lang="scss" scoped>
@use '../styles/variables' as *;


.product-detail {
  width: 100%;
  max-width: 1200px;
  margin: 80px auto;
  padding: $spacing-md;

  &__container {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
    margin-bottom: 40px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__image-wrapper {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;

    @media (min-width: 768px) {
      margin: 0;
      width: 45%;
    }
  }

  &__image {
    width: 100%;
    border-radius: $border-radius;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &__info {
    width: 100%;

    @media (min-width: 768px) {
      width: 55%;
      padding-left: $spacing-lg;
    }
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: $spacing-md;
    color: #333;
  }

  &__price-rating {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-md;
    flex-wrap: wrap;
  }

  &__price {
    font-size: 1.8rem;
    font-weight: 600;
    color: $primary-color;
  }

  &__rating {
    display: flex;
    align-items: center;

    .stars {
      display: flex;
      margin-right: 5px;
    }

    .rating-value {
      font-weight: 500;
    }
  }

  &__description {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: $spacing-lg;
    color: #555;
  }

  &__cart-btn {
    background-color: $primary-color;
    color: white;
    padding: $spacing-sm $spacing-md;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    border-radius: $border-radius;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    max-width: 300px;

    &:hover {
      background-color: $primary-color-hover; 
      transform: translateY(-2px);
    }
  }
}

/* Sección de Reseñas Mejorada */
.product-reviews {
  margin-top: 60px;
  padding: $spacing-lg;
  background: #f9f9f9;
  border-radius: $border-radius;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &__title {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: $spacing-lg;
    color: #333;
    border-bottom: 2px solid $color-borde;
    padding-bottom: $spacing-sm;
  }

  &__summary {
    display: flex;
    justify-content: center;
    margin-bottom: $spacing-lg;

    .rating-summary {
      display: flex;
      flex-direction: column;
      align-items: center;

      .rating-average {
        display: flex;
        flex-direction: column;
        align-items: center;

        .rating-number {
          font-size: 3rem;
          font-weight: 700;
          color: #333;
        }

        .stars {
          margin: 10px 0;
        }

        .total-reviews {
          color: #666;
          font-size: 0.9rem;
        }
      }
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  .review {
    padding: $spacing-md;
    border-radius: $border-radius;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    &__header {
      display: flex;
      justify-content: space-between;
      margin-bottom: $spacing-sm;
      flex-wrap: wrap;
      gap: $spacing-sm;
    }

    &__user-info {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
    }

    &__avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: $primary-color;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    &__user-details {
      display: flex;
      flex-direction: column;
    }

    &__username {
      font-weight: 600;
      margin: 0;
    }

    &__date {
      color: #888;
      font-size: 0.9rem;
    }

    &__content {
      margin: $spacing-sm 0;
      line-height: 1.5;
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      margin-top: $spacing-sm;
    }

    &__delete-btn {
      background-color: transparent;
      color: #d9534f;
      border: 1px solid #d9534f;
      padding: 5px 10px;
      border-radius: $border-radius;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;

      &:hover {
        background-color: #d9534f;
        color: white;
      }
    }
  }

  &__empty {
    text-align: center;
    padding: $spacing-lg;
    color: #888;
    font-style: italic;
  }

  &__form {
    margin-top: $spacing-xl;
    padding: $spacing-lg;
    background: white;
    border-radius: $border-radius;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .form-title {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: $spacing-md;
      color: #333;
    }

    .rating-selector {
      margin-bottom: $spacing-md;

      p {
        margin-bottom: 8px;
        font-weight: 500;
      }

      .stars-input {
        display: flex;
        gap: 5px;

        .star {
          font-size: 1.8rem;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            transform: scale(1.1);
          }
        }
      }
    }

    .form-group {
      margin-bottom: $spacing-md;

      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
      }

      textarea {
        width: 100%;
        padding: $spacing-sm;
        border: 1px solid $color-borde;
        border-radius: $border-radius;
        font-size: 1rem;
        resize: vertical;

        &:focus {
          outline: none;
          border-color: $primary-color;
          box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
        }
      }
    }
  }

  &__submit {
    background-color: $primary-color;
    color: white;
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius;
    cursor: pointer;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    width: 100%;

    &:hover {
      background-color: $primary-color-hover; 
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &__login {
    text-align: center;
    padding: $spacing-lg;
    background: white;
    border-radius: $border-radius;
    margin-top: $spacing-lg;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    p {
      color: #666;
    }
  }
}

// Estrellas
.star {
  color: #ddd;
  font-size: 1.2rem;

  &--filled {
    color: #FFD700;
  }
}
</style>
