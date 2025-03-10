import { defineStore } from 'pinia';
import axios from 'axios';
import { useCartStore } from './cartStore';
import { useToast } from 'vue-toastification';

export const useDetallePedidoStore = defineStore('detallePedido', {
  state: () => ({
    detallesPedido: [] as any[],
    usuario: null as any,
    pedido: null as any,
  }),

  actions: {
    async fetchPedidoById(pedidoId: number) {
      try {
        const response = await axios.get(`/api/Pedido/${pedidoId}`);
        console.log("Pedido completo obtenido:", response.data);
        if (!response.data) {
          throw new Error("Pedido no encontrado.");
        }
        // Asignamos la información devuelta; si 'detalles' es null, usamos []
        this.pedido = response.data;
        this.usuario = response.data.usuario;
        this.detallesPedido = response.data.detalles ?? [];
        console.log("Pedido cargado correctamente");
      } catch (error) {
        console.error("Error obteniendo el pedido:", error);
        throw new Error("No se pudo obtener el pedido.");
      }
    },

    async agregarDetallesPedido(pedidoId: number, productos: any[]) {
      const toast = useToast();
      if (!Array.isArray(productos) || productos.length === 0) {
        console.error("Error: No hay productos para agregar al pedido.");
        throw new Error("No hay productos en el carrito.");
      }

      try {
        const detallesPedido = productos.map((producto) => ({
          pedidoId,
          productoId: producto.id,
          cantidad: producto.quantity,
          precioUnitario: producto.price,
        }));

        console.log("Enviando detalles del pedido:", JSON.stringify(detallesPedido, null, 2));

        await axios.post("/api/DetallePedido", detallesPedido);
        console.log("Detalles del pedido agregados correctamente");

        // Enviar correo de confirmación automáticamente
        try {
          await axios.post(`/api/Pedido/enviar-confirmacion/${pedidoId}`);
          toast.success("Te hemos enviado al correo toda la información de tu pedido.");
        } catch (emailError) {
          console.error("Error al enviar correo:", emailError);
        }

        useCartStore().clearCart();
      } catch (error) {
        console.error("Error al agregar detalles del pedido:", error);
        throw new Error("No se pudieron agregar los detalles del pedido.");
      }
    },

    async eliminarDetallePedido(detalleId: number) {
      try {
        await axios.delete(`/api/DetallePedido/${detalleId}`);
        this.detallesPedido = this.detallesPedido.filter((detalle) => detalle.id !== detalleId);
        console.log("Detalle del pedido eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar el detalle del pedido:", error);
        throw new Error("No se pudo eliminar el detalle del pedido.");
      }
    },
    async fetchDetallesPedido(pedidoId: number) {
      try {
        const response = await axios.get(`/api/DetallePedido/pedido/${pedidoId}`);
        
        console.log("Detalles del pedido:", response.data);
    
        if (response.data && response.data.length > 0) {
          this.detallesPedido = response.data;
          const usuarioId = this.detallesPedido[0]?.pedido?.usuarioId;
          if (usuarioId) {
            await this.fetchUsuarioByPedidoId(usuarioId);
            console.log("Detalles del pedido cargados correctamente");
          } else {
            console.error("No se encontró el usuarioId en los detalles del pedido.");
            throw new Error("No se pudo obtener el usuario asociado al pedido.");
          }
        } else {
          console.error("No se encontraron detalles del pedido.");
          throw new Error("No se encontraron detalles del pedido.");
        }
      } catch (error) {
        console.error("Error obteniendo detalles del pedido:", error);
        throw new Error("No se pudo obtener el detalle del pedido.");
      }
    },
    
    async fetchUsuarioByPedidoId(usuarioId: number) {
      return this.fetchUsuarioCompleto(usuarioId);
    },
    

    async fetchUsuarioCompleto(usuarioId: number) {
      try {
        const response = await axios.get(`/api/Usuario/${usuarioId}`);
        console.log("Datos completos del usuario:", response.data);
        if (!response.data) {
          throw new Error("Usuario no encontrado.");
        }
        this.usuario = response.data;
        console.log("Usuario cargado correctamente");
        return this.usuario;
      } catch (error) {
        console.error("Error obteniendo el usuario:", error);
        throw new Error("No se pudo obtener la información del usuario.");
      }
    },
  },
});
