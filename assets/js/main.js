/* =========================================================
   Portfolio Neón — Lógica
   1. Texto que se escribe solo (efecto máquina de escribir)
   2. Proyectos generados desde un array + filtros
   3. Habilidades agrupadas por área
   4. Partículas en canvas que siguen al mouse
   ========================================================= */

const GITHUB = "https://github.com/Rumenco1221/";
const PAGES = "https://rumenco1221.github.io/";

// ---------- 1. Efecto máquina de escribir ----------
const frases = ["sitios web", "dashboards en Power BI", "consultas SQL", "automatizaciones con Python"];
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
// repo = nombre del repositorio en GitHub · demo = true si está publicado en GitHub Pages
const proyectos = [
  { titulo: "ElectroHogar Dashboard", desc: "Ventas de 22.000 transacciones: limpieza de datos, KPIs en DAX y pronóstico a 12 meses.", cat: "datos", tags: ["Power BI", "DAX", "Python"], color: "#FFE14D", repo: "ElectroHogar-Dashboard-Ventas" },
  { titulo: "SQL Revenue Intelligence", desc: "Cohortes, segmentación RFM y LTV con funciones de ventana.", cat: "datos", tags: ["SQL", "CTE", "pytest"], color: "#00E5FF", repo: "sql-revenue-intelligence-cohorts-rfm" },
  { titulo: "Excel Report Autopilot", desc: "Consolida los Excel de sucursales, valida los datos y arma el reporte solo.", cat: "datos", tags: ["Python", "pandas", "Excel"], color: "#7CFFCB", repo: "excel-report-autopilot-python" },
  { titulo: "AI Data Analyst Agent", desc: "Preguntas en español convertidas en SQL seguro, con guardrails y evaluaciones.", cat: "datos", tags: ["IA", "SQL", "Python"], color: "#FF2E88", repo: "ai-data-analyst-agent-text-to-sql" },
  { titulo: "Fuga Neón", desc: "Juego arcade con ciudad procedural, pathfinding (BFS) y 30 tests.", cat: "juegos", tags: ["JS", "Canvas", "Testing"], color: "#FF2E88", repo: "fuga-neon", demo: true },
  { titulo: "Sabores Latinos", desc: "Landing de restaurante con menú filtrable, carrito y reservas.", cat: "web", tags: ["HTML", "CSS", "JS"], color: "#FFB000", repo: "sabores-latinos", demo: true },
  { titulo: "Tasky Kanban", desc: "Tablero Kanban con drag and drop, prioridades y guardado automático.", cat: "web", tags: ["JS", "Drag & Drop"], color: "#7CFFCB", repo: "tasky-kanban", demo: true },
  { titulo: "Clima Vibes", desc: "Clima en tiempo real consumiendo una API pública.", cat: "web", tags: ["Fetch", "API"], color: "#00E5FF", repo: "clima-vibes", demo: true },
  { titulo: "Galaxia Explorer", desc: "Viaje interactivo por el sistema solar en canvas.", cat: "web", tags: ["Canvas", "JS"], color: "#00E5FF", repo: "galaxia-explorer", demo: true },
  { titulo: "Pixel Arcade", desc: "Snake clásico con récord guardado en el navegador.", cat: "juegos", tags: ["JS", "localStorage"], color: "#FF2E88", repo: "pixel-arcade", demo: true },
  { titulo: "Beat Studio", desc: "Caja de ritmos de 16 pasos con Web Audio API.", cat: "juegos", tags: ["Web Audio", "JS"], color: "#FF7A00", repo: "beat-studio", demo: true },
  { titulo: "API de Tareas", desc: "API REST con login JWT, SQLite y tests automatizados.", cat: "web", tags: ["Python", "FastAPI", "JWT"], color: "#FFE14D", repo: "api-tareas-fastapi" }
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
        <div class="enlaces">
          ${p.demo ? `<a href="${PAGES}${p.repo}/" target="_blank" rel="noopener">Ver demo →</a>` : ""}
          <a href="${GITHUB}${p.repo}" target="_blank" rel="noopener">Código →</a>
        </div>
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
const habilidades = {
  "Desarrollo web": ["HTML5", "CSS3", "JavaScript", "Diseño responsive", "Canvas", "Consumo de APIs"],
  "Datos y BI": ["Power BI", "DAX", "Power Query", "SQL", "Excel", "Modelado de datos", "KPIs"],
  "Python y automatización": ["Python", "pandas", "FastAPI", "pytest", "Automatización de reportes"],
  "Herramientas": ["Git", "GitHub", "GitHub Actions", "GitHub Pages", "IA (Claude, ChatGPT)"]
};
document.getElementById("grupos").innerHTML = Object.entries(habilidades).map(([grupo, lista]) => `
  <li>
    <h3>${grupo}</h3>
    <div class="chips">${lista.map(h => `<span>${h}</span>`).join("")}</div>
  </li>`).join("");

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

document.getElementById("anio").textContent = new Date().getFullYear();
