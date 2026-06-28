# Patrón Visual: Glassmorphism

El proyecto Intipa Churin utiliza ampliamente el *glassmorphism* (efecto de vidrio esmerilado) para dar una apariencia urbana premium, especialmente en modales, tooltips y botones flotantes superpuestos en imágenes.

## Ejemplo Representativo (Botón Flotante)

```jsx
<button
  className="w-9 h-9 rounded-full flex items-center justify-center shadow-md transform transition-all duration-500 text-white border border-white/10 backdrop-blur-md"
  style={{ backgroundColor: 'rgba(9, 9, 11, 0.4)' }}
>
  <Icon />
</button>
```

**Clases Clave en Tailwind v4:**
* `backdrop-blur-md`: Esencial para el efecto de desenfoque del fondo.
* `border border-white/10` (o `dark:border-white/10`): Añade un borde sutil semi-transparente que simula el grosor del cristal.
* `bg-white/10` o colores semi-transparentes con opacidad baja (ej. `bg-black/40` para overlays).
* Transiciones suaves: `transition-all duration-300` o `duration-500` para que el hover se sienta orgánico.
