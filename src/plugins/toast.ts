import { createApp } from 'vue'
import Toast, { PluginOptions, POSITION } from 'vue-toastification'
import "vue-toastification/dist/index.css"

const options: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 1500, 
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
}

export default {
  install: (app: ReturnType<typeof createApp>) => {
    app.use(Toast, options)
  }
}
