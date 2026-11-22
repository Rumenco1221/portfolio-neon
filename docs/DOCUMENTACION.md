# Documentación técnica — Portfolio Neón

## Objetivo
Portfolio personal con estética neón: texto que se escribe solo, partículas que esquivan el mouse, proyectos filtrables y barras de habilidades animadas.

## Arquitectura
Sitio estático de una sola página, sin dependencias:

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Estructura y contenido semántico |
| `assets/css/styles.css` | Estilos, paleta en variables CSS, responsive y animaciones |
| `assets/js/main.js` | Interactividad. Los datos viven en arrays/objetos y se pintan en el DOM con funciones |

### Patrón usado en el JavaScript
1. **Datos** en arrays de objetos (como si vinieran de una API).
2. **Funciones de render** que convierten datos en HTML con template literals.
3. **Eventos** que modifican los datos y vuelven a llamar al render.

Separar datos, render y eventos es la misma idea que después usan React y Vue.

## Decisiones de diseño
- Paleta: Índigo `#1B1036`, rosa `#FF2E88`, cian `#00E5FF`, amarillo `#FFE14D`
- Tipografía: Unbounded + DM Sans
- Se respeta `prefers-reduced-motion` para personas sensibles al movimiento.
- Todos los controles se pueden usar con teclado y tienen foco visible.

## Accesibilidad
- `lang="es"`, un solo `<h1>`, landmarks `<header>`, `<main>`, `<footer>`.
- Botones reales (`<button>`) para acciones, enlaces (`<a>`) para navegar.
- `aria-label`, `aria-pressed` o `aria-live` donde el estado cambia sin recargar.

## Pruebas
`node --test tests/test_estructura.mjs` revisa SEO básico, semántica, `alt` en imágenes y que existan los recursos enlazados.

## Publicación
GitHub Pages: Settings → Pages → Branch `main` / carpeta `/ (root)` → Save.
