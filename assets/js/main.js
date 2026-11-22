/* =========================================================
   Portfolio Neón — Lógica
   1. Texto que se escribe solo (efecto máquina de escribir)
   2. Proyectos generados desde un array + filtros
   3. Barras de habilidades animadas con IntersectionObserver
   4. Partículas en canvas que siguen al mouse
   5. Copiar email al portapapeles
   ========================================================= */

// ---------- 1. Efecto máquina de escribir ----------
const frases = ["sitios web", "APIs con Python", "dashboards de datos", "experiencias únicas"];
const rotador = document.getElementById("rotador");
let indiceFrase = 0;
let indiceLetra = 0;
let borrando = false;

function escribir() {
  const frase = frases[indiceFrase];
  // Si estamos borrando restamos una letra, si no sumamos una
  indiceLetra += borrando ? -1 : 1;
  rotador.textContent = frase.slice(0, indiceLetra);

  let espera = borrando ? 45 : 95;
  if (!borrando && indiceLetra === frase.length) { borrando = true; espera = 1600; }
  else if (borrando && indiceLetra === 0) {
    borrando = false;
    indiceFrase = (indiceFrase + 1) % frases.length; // vuelve a 0 al llegar al final
    espera = 300;
  }
  setTimeout(escribir, espera);
}
escribir();

// ---------- 2. Proyectos ----------
const proyectos = [
  { titulo: "Sabores Latinos", desc: "Landing de restaurante con menú filtrable y carrito.", cat: "web", tags: ["HTML", "CSS", "JS"], color: "#FFB000" },
  { titulo: "Galaxia Explorer", desc: "Viaje interactivo por el sistema solar en canvas.", cat: "web", tags: ["Canvas", "JS"], color: "#00E5FF" },
  { titulo: "Pixel Arcade", desc: "Snake clásico con récord guardado en el navegador.", cat: "juegos", tags: ["JS", "localStorage"], color: "#FF2E88" },
  { titulo: "Ventas Analytics", desc: "Análisis de ventas con SQL: CTE y funciones de ventana.", cat: "datos", tags: ["SQL", "SQLite"], color: "#FFE14D" },
  { titulo: "Clima Vibes", desc: "Clima en tiempo real consumiendo una API pública.", cat: "web", tags: ["Fetch", "API"], color: "#7CFFCB" },
  { titulo: "Beat Studio", desc: "Caja de ritmos de 16 pasos con Web Audio API.", cat: "juegos", tags: ["Web Audio", "JS"], color: "#FF7A00" }
];
const grilla = document.getElementById("grilla");

function pintarProyectos(filtro) {
  // filter devuelve solo los que cumplen la condición; map los convierte en HTML
  grilla.innerHTML = proyectos
    .filter(p => filtro === "todos" || p.cat === filtro)
    .map(p => `
      <article class="proyecto" style="--color:${p.color}">
        <h3>${p.titulo}</h3>
        <p>${p.desc}</p>
        <div class="etiquetas">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
      </article>`)
    .join("");
}
pintarProyectos("todos");

document.querySelectorAll(".filtro").forEach(boton => {
  boton.addEventListener("click", () => {
    document.querySelector(".filtro.activo").classList.remove("activo");
    boton.classList.add("activo");
    pintarProyectos(boton.dataset.filtro);
  });
});

// ---------- 3. Habilidades ----------
const habilidades = [["HTML y CSS", 85], ["JavaScript", 70], ["Python", 60], ["SQL", 65], ["Git y GitHub", 75]];
const barras = document.getElementById("barras");
barras.innerHTML = habilidades.map(([nombre, nivel]) => `
  <li>
    <span>${nombre} <small>${nivel}%</small></span>
    <div class="pista"><div class="relleno" data-nivel="${nivel}"></div></div>
  </li>`).join("");

// Cuando la sección aparece en pantalla, llenamos cada barra
const observador = new IntersectionObserver(entradas => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.querySelectorAll(".relleno").forEach(r => r.style.width = r.dataset.nivel + "%");
      observador.disconnect();
    }
  });
}, { threshold: 0.3 });
observador.observe(barras);

// ---------- 4. Partículas ----------
const canvas = document.getElementById("particulas");
const ctx = canvas.getContext("2d");
const colores = ["#FF2E88", "#00E5FF", "#FFE14D"];
const mouse = { x: -999, y: -999 };
let puntos = [];

function ajustarCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const cantidad = Math.min(90, Math.floor(innerWidth / 14));
  puntos = Array.from({ length: cantidad }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .6,
    vy: (Math.random() - .5) * .6,
    r: Math.random() * 2 + 1,
    c: colores[Math.floor(Math.random() * colores.length)]
  }));
}

function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of puntos) {
    p.x += p.vx; p.y += p.vy;
    // Rebote contra los bordes
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    // Si el mouse está cerca, el punto se aleja
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 120) { p.x += dx / dist * 2; p.y += dy / dist * 2; }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.c;
    ctx.fill();
  }
  requestAnimationFrame(animar);
}

addEventListener("resize", ajustarCanvas);
addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
ajustarCanvas();
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) animar();

// ---------- 5. Copiar email ----------
document.getElementById("copiarEmail").addEventListener("click", async () => {
  const email = "tu-email@ejemplo.com"; // 👉 Cambia esto por tu email real
  const aviso = document.getElementById("aviso");
  try {
    await navigator.clipboard.writeText(email);
    aviso.textContent = `Copiado: ${email}`;
  } catch {
    aviso.textContent = `Mi email es ${email}`;
  }
});

document.getElementById("anio").textContent = new Date().getFullYear();
