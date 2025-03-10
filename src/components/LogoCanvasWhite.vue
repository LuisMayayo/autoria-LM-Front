<template>
    <!-- Mantén el lienzo con width/height nativos -->
    <canvas ref="canvasEl" width="185" height="210"></canvas>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  
  const canvasEl = ref(null)
  
  onMounted(() => {
    const canvas = canvasEl.value
    const ctx = canvas.getContext('2d')
  
    const baseState = {
      L:   { scale: 1,   offsetX: 0,  offsetY: 0 },
      bar: { scale: 1,   offsetX: 0,  offsetY: 0 },
      M:   { scale: 1,   offsetX: 0,  offsetY: 0 },
      text:{ scale: 1,   offsetX: 0,  offsetY: 0 }
    }
  
    const activeState = {
      L:   { scale: 1.1, offsetX: -15, offsetY: -15 },
      bar: { scale: 1.1, offsetX:  10, offsetY: -15 },
      M:   { scale: 1.1, offsetX:  15, offsetY:  10 },
      text:{ scale: 1.05,offsetX:   0,  offsetY:  10 }
    }
  
    let animProps = JSON.parse(JSON.stringify(baseState))
  
    function easeOutBack(t) {
      const c1 = 1.70158
      const c3 = c1 + 1
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    }
  
    function drawLogo() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
  
      // "L" en blanco
      ctx.save()
      ctx.translate(32 + animProps.L.offsetX, 35 + animProps.L.offsetY)
      ctx.scale(animProps.L.scale, animProps.L.scale)
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, 14, 80)    // L vertical
      ctx.fillRect(0, 70, 35, 14)   // L base
      ctx.restore()
  
      // Barra vertical en blanco
      ctx.save()
      ctx.translate(77 + animProps.bar.offsetX, 30 + animProps.bar.offsetY)
      ctx.scale(animProps.bar.scale, animProps.bar.scale)
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, 4, 92)
      ctx.restore()
  
      // "M" en verde
      ctx.save()
      ctx.translate(89 + animProps.M.offsetX, 35 + animProps.M.offsetY)
      ctx.scale(animProps.M.scale, animProps.M.scale)
      ctx.beginPath()
      ctx.fillStyle = '#06AA51'
      ctx.moveTo(0, 60)
      ctx.lineTo(22, 0)
      ctx.lineTo(40, 0)
      ctx.lineTo(12, 75)
      ctx.closePath()
      ctx.fill()
      // Palo vertical derecho
      ctx.fillRect(30, 0, 15, 84)
      ctx.restore()
  
      // Texto "Decoración" => "Decor" en blanco, "ación" en verde
      ctx.save()
      ctx.translate(30 + animProps.text.offsetX, 150 + animProps.text.offsetY)
      ctx.scale(animProps.text.scale, animProps.text.scale)
      ctx.font = 'bold 20px Arial'
      ctx.fillStyle = 'white'
      ctx.fillText('Decor', 0, 0)
      const decorWidth = ctx.measureText('Decor').width
      ctx.fillStyle = '#06AA51'
      ctx.fillText('ación', decorWidth, 0)
      ctx.restore()
    }
  
    // Animación (base ↔ activo)
    function animateTo(targetState, duration) {
      const startTime = performance.now()
      const startState = JSON.parse(JSON.stringify(animProps))
  
      function animateFrame(now) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = easeOutBack(progress)
  
        for (let part in animProps) {
          animProps[part].scale =
            startState[part].scale +
            (targetState[part].scale - startState[part].scale) * easeProgress
          animProps[part].offsetX =
            startState[part].offsetX +
            (targetState[part].offsetX - startState[part].offsetX) * easeProgress
          animProps[part].offsetY =
            startState[part].offsetY +
            (targetState[part].offsetY - startState[part].offsetY) * easeProgress
        }
  
        drawLogo()
  
        if (progress < 1) {
          requestAnimationFrame(animateFrame)
        } else {
          // Fijamos estado final
          animProps = JSON.parse(JSON.stringify(targetState))
          drawLogo()
        }
      }
  
      requestAnimationFrame(animateFrame) // Llamamos a animateFrame, no a animateTo(...)
    }
  
    // Bounding box en coords internas (0,0)-(185,210)
    const boundingBox = { x: 0, y: 0, width: 185, height: 210 }
    let isOverLogo = false
  
    canvas.addEventListener('mousemove', (e) => {
      // 1) Rect del canvas en la pantalla
      const rect = canvas.getBoundingClientRect()
      // 2) Escala de coords (porque lo mostramos con CSS)
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      // 3) Mouse en coords "internas" del canvas
      const mouseX = (e.clientX - rect.left) * scaleX
      const mouseY = (e.clientY - rect.top) * scaleY
  
      // Comprobamos si está dentro del bounding box
      const inArea =
        mouseX >= boundingBox.x &&
        mouseX <= boundingBox.x + boundingBox.width &&
        mouseY >= boundingBox.y &&
        mouseY <= boundingBox.y + boundingBox.height
  
      if (inArea && !isOverLogo) {
        isOverLogo = true
        animateTo(activeState, 800)
      } else if (!inArea && isOverLogo) {
        isOverLogo = false
        animateTo(baseState, 800)
      }
    })
  
    canvas.addEventListener('mouseleave', () => {
      if (isOverLogo) {
        isOverLogo = false
        animateTo(baseState, 800)
      }
    })
  
    drawLogo()
  })
  </script>
  
  <style scoped>
.footer__logo-img[data-v-4896eafd] {
    height: 90px;
    margin-bottom: 8px;
}
  </style>
  