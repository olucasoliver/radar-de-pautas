const seedPitches = [
  {
    id: "pauta-1",
    title: "Temporal causa alagamentos em avenidas centrais",
    description:
      "Moradores relatam pontos de alagamento e bloqueios parciais. Defesa Civil ainda não divulgou balanço. Pode render serviço sobre trânsito e áreas de risco.",
    city: "Cuiabá",
    state: "MT",
    category: "Clima",
    urgency: "Alta",
    status: "Em apuração",
    source: "Moradores e vídeos enviados à redação",
    author: "Marina Alves",
    tags: ["chuva", "trânsito", "defesa civil"],
    helps: 7,
    checking: 3,
    createdAt: "Hoje, 08:42",
  },
  {
    id: "pauta-2",
    title: "Fila para consultas especializadas passa de seis meses",
    description:
      "Pacientes relatam demora para cardiologia e ortopedia. Secretaria municipal pode ser procurada para confirmar dados e fila atual.",
    city: "Várzea Grande",
    state: "MT",
    category: "Saúde",
    urgency: "Média",
    status: "Sugestão",
    source: "Pacientes e servidores da rede",
    author: "Rafael Costa",
    tags: ["sus", "fila", "saúde pública"],
    helps: 4,
    checking: 1,
    createdAt: "Hoje, 07:15",
  },
  {
    id: "pauta-3",
    title: "Câmara vota projeto que muda regras para ambulantes",
    description:
      "Projeto entra na pauta da sessão desta tarde. Comerciantes ambulantes prometem acompanhar a votação.",
    city: "Campo Grande",
    state: "MS",
    category: "Política",
    urgency: "Alta",
    status: "Confirmada",
    source: "Pauta oficial da Câmara",
    author: "João Ferraz",
    tags: ["câmara", "ambulantes", "votação"],
    helps: 11,
    checking: 5,
    createdAt: "Ontem, 18:30",
  },
];

const storageKey = "radarDePautas.posts";
const state = {
  pitches: loadPitches(),
  filters: {
    search: "",
    category: "",
    urgency: "",
    status: "",
    state: "",
  },
};

const form = document.querySelector("#pitch-form");
const feedList = document.querySelector("#feed-list");
const searchInput = document.querySelector("#search");
const categoryFilter = document.querySelector("#filter-category");
const urgencyFilter = document.querySelector("#filter-urgency");
const statusFilter = document.querySelector("#filter-status");
const stateFilter = document.querySelector("#filter-state");

function loadPitches() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return seedPitches;

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : seedPitches;
  } catch {
    return seedPitches;
  }
}

function savePitches() {
  localStorage.setItem(storageKey, JSON.stringify(state.pitches));
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getFilteredPitches() {
  return state.pitches.filter((pitch) => {
    const searchTarget = normalize(
      [pitch.title, pitch.description, pitch.city, pitch.state, pitch.category, pitch.source, pitch.author, pitch.tags.join(" ")].join(" ")
    );

    const matchesSearch = !state.filters.search || searchTarget.includes(normalize(state.filters.search));
    const matchesCategory = !state.filters.category || pitch.category === state.filters.category;
    const matchesUrgency = !state.filters.urgency || pitch.urgency === state.filters.urgency;
    const matchesStatus = !state.filters.status || pitch.status === state.filters.status;
    const matchesState = !state.filters.state || pitch.state === state.filters.state;

    return matchesSearch && matchesCategory && matchesUrgency && matchesStatus && matchesState;
  });
}

function uniqueSorted(items) {
  return [...new Set(items)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function fillFilterOptions() {
  const categories = uniqueSorted(state.pitches.map((pitch) => pitch.category));
  const states = uniqueSorted(state.pitches.map((pitch) => pitch.state));

  categoryFilter.innerHTML = '<option value="">Todas as categorias</option>';
  stateFilter.innerHTML = '<option value="">Todos os estados</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  states.forEach((stateName) => {
    const option = document.createElement("option");
    option.value = stateName;
    option.textContent = stateName;
    stateFilter.appendChild(option);
  });
}

function renderStats() {
  document.querySelector("#total-count").textContent = state.pitches.length;
  document.querySelector("#urgent-count").textContent = state.pitches.filter((pitch) => pitch.urgency === "Alta").length;
  document.querySelector("#checking-count").textContent = state.pitches.filter((pitch) => pitch.status === "Em apuração").length;
}

function renderFeed() {
  const pitches = getFilteredPitches();
  feedList.innerHTML = "";

  if (!pitches.length) {
    feedList.innerHTML = '<div class="empty-state">Nenhuma pauta encontrada com os filtros atuais.</div>';
    renderStats();
    return;
  }

  pitches.forEach((pitch) => {
    const card = document.createElement("article");
    card.className = "pitch-card";
    card.innerHTML = `
      <header>
        <div>
          <h3>${escapeHtml(pitch.title)}</h3>
          <div class="meta-row">
            <span class="pill">${escapeHtml(pitch.city)} - ${escapeHtml(pitch.state)}</span>
            <span class="pill">${escapeHtml(pitch.category)}</span>
            <span class="pill urgency-${normalize(pitch.urgency)}">${escapeHtml(pitch.urgency)}</span>
            <span class="pill status-${normalize(pitch.status).replace(" ", "-")}">${escapeHtml(pitch.status)}</span>
          </div>
        </div>
        <span class="pill">${escapeHtml(pitch.createdAt)}</span>
      </header>
      <p>${escapeHtml(pitch.description)}</p>
      <div class="meta-row">
        <span><strong>Fonte inicial:</strong> ${escapeHtml(pitch.source || "Não informada")}</span>
        <span><strong>Publicado por:</strong> ${escapeHtml(pitch.author)}</span>
      </div>
      <div class="tag-row">
        ${pitch.tags.map((tag) => `<span class="pill">#${escapeHtml(tag)}</span>`).join("")}
      </div>
      <div class="card-actions">
        <button type="button" data-action="help" data-id="${pitch.id}">Tenho informação (${pitch.helps})</button>
        <button type="button" data-action="checking" data-id="${pitch.id}">Estou apurando (${pitch.checking})</button>
        <button type="button" data-action="confirm" data-id="${pitch.id}">Marcar confirmada</button>
      </div>
    `;
    feedList.appendChild(card);
  });

  renderStats();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createPitch(formData) {
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    id: `pauta-${Date.now()}`,
    title: formData.get("title").trim(),
    description: formData.get("description").trim(),
    city: formData.get("city").trim(),
    state: formData.get("state"),
    category: formData.get("category"),
    urgency: formData.get("urgency"),
    status: formData.get("status"),
    source: formData.get("source").trim(),
    author: formData.get("author").trim(),
    tags,
    helps: 0,
    checking: 0,
    createdAt: "Agora",
  };
}

function updatePitch(id, updater) {
  state.pitches = state.pitches.map((pitch) => (pitch.id === id ? updater(pitch) : pitch));
  savePitches();
  renderFeed();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const pitch = createPitch(formData);
  state.pitches = [pitch, ...state.pitches];
  savePitches();
  fillFilterOptions();
  renderFeed();
  form.reset();
  document.querySelector("#feed").scrollIntoView({ behavior: "smooth" });
});

feedList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "help") {
    updatePitch(id, (pitch) => ({ ...pitch, helps: pitch.helps + 1 }));
  }

  if (action === "checking") {
    updatePitch(id, (pitch) => ({ ...pitch, checking: pitch.checking + 1, status: "Em apuração" }));
  }

  if (action === "confirm") {
    updatePitch(id, (pitch) => ({ ...pitch, status: "Confirmada" }));
  }
});

searchInput.addEventListener("input", (event) => {
  state.filters.search = event.target.value;
  renderFeed();
});

[categoryFilter, urgencyFilter, statusFilter, stateFilter].forEach((select) => {
  select.addEventListener("change", (event) => {
    const key = event.target.id.replace("filter-", "");
    state.filters[key] = event.target.value;
    renderFeed();
  });
});

fillFilterOptions();
renderFeed();
