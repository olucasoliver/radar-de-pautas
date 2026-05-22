const msCities = [
  "Campo Grande",
  "Dourados",
  "Tres Lagoas",
  "Corumba",
  "Ponta Pora",
  "Aquidauana",
  "Navirai",
  "Nova Andradina",
  "Coxim",
  "Maracaju",
  "Jardim",
  "Paranaiba",
  "Sidrolandia",
  "Bonito",
  "Amambai",
];

const seedPitches = [
  {
    id: "pauta-1",
    title: "Temporal causa pontos de alagamento em Campo Grande",
    description:
      "Moradores relatam vias bloqueadas e semaforos apagados. Defesa Civil ainda nao divulgou balanco. Pode render servico sobre transito e areas de risco.",
    city: "Campo Grande",
    category: "Clima",
    urgency: "Alta",
    status: "Em apuracao",
    source: "Moradores e videos enviados a redacao",
    author: "Marina Alves",
    organization: "Freelancer",
    tags: ["chuva", "transito", "defesa civil"],
    helps: 7,
    checking: 3,
    createdAt: "Hoje, 08:42",
  },
  {
    id: "pauta-2",
    title: "Fila para exames especializados vira queixa recorrente",
    description:
      "Pacientes relatam demora para cardiologia e ortopedia. Secretaria municipal pode ser procurada para confirmar dados e fila atual.",
    city: "Dourados",
    category: "Saude",
    urgency: "Media",
    status: "Pista",
    source: "Pacientes e servidores da rede",
    author: "Rafael Costa",
    organization: "Radio local",
    tags: ["sus", "fila", "saude publica"],
    helps: 4,
    checking: 1,
    createdAt: "Hoje, 07:15",
  },
  {
    id: "pauta-3",
    title: "Camara vota projeto que muda regras para ambulantes",
    description:
      "Projeto entra na pauta da sessao desta tarde. Comerciantes ambulantes prometem acompanhar a votacao.",
    city: "Corumba",
    category: "Politica",
    urgency: "Alta",
    status: "Confirmado",
    source: "Pauta oficial da Camara",
    author: "Joao Ferraz",
    organization: "Portal regional",
    tags: ["camara", "ambulantes", "votacao"],
    helps: 11,
    checking: 5,
    createdAt: "Ontem, 18:30",
  },
];

const pitchStorageKey = "radarMS.posts";
const profileStorageKey = "radarMS.profile";

const state = {
  pitches: loadPitches(),
  profile: loadProfile(),
  filters: {
    search: "",
    city: "",
    category: "",
    urgency: "",
    status: "",
  },
};

const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const form = document.querySelector("#pitch-form");
const profileForm = document.querySelector("#profile-form");
const feedList = document.querySelector("#feed-list");
const searchInput = document.querySelector("#search");
const cityFilter = document.querySelector("#filter-city");
const categoryFilter = document.querySelector("#filter-category");
const urgencyFilter = document.querySelector("#filter-urgency");
const statusFilter = document.querySelector("#filter-status");
const citySelect = document.querySelector("#city");
const profileCitySelect = document.querySelector("#profile-city");

function loadPitches() {
  const saved = localStorage.getItem(pitchStorageKey);
  if (!saved) return seedPitches;

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : seedPitches;
  } catch {
    return seedPitches;
  }
}

function loadProfile() {
  const saved = localStorage.getItem(profileStorageKey);
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function savePitches() {
  localStorage.setItem(pitchStorageKey, JSON.stringify(state.pitches));
}

function saveProfile() {
  localStorage.setItem(profileStorageKey, JSON.stringify(state.profile));
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function initials(name) {
  const parts = String(name || "?").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function uniqueSorted(items) {
  return [...new Set(items)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function fillCityOptions(select, includeAll) {
  select.innerHTML = includeAll ? '<option value="">Todas as cidades</option>' : "";
  msCities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    select.appendChild(option);
  });
}

function fillFilterOptions() {
  const categories = uniqueSorted(state.pitches.map((pitch) => pitch.category));
  categoryFilter.innerHTML = '<option value="">Todas as editorias</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function switchView(viewName) {
  views.forEach((view) => view.classList.toggle("active", view.id === `view-${viewName}`));
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === viewName));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getFilteredPitches() {
  return state.pitches.filter((pitch) => {
    const searchTarget = normalize(
      [pitch.title, pitch.description, pitch.city, pitch.category, pitch.source, pitch.author, pitch.organization, pitch.tags.join(" ")].join(" ")
    );

    const matchesSearch = !state.filters.search || searchTarget.includes(normalize(state.filters.search));
    const matchesCity = !state.filters.city || pitch.city === state.filters.city;
    const matchesCategory = !state.filters.category || pitch.category === state.filters.category;
    const matchesUrgency = !state.filters.urgency || pitch.urgency === state.filters.urgency;
    const matchesStatus = !state.filters.status || pitch.status === state.filters.status;

    return matchesSearch && matchesCity && matchesCategory && matchesUrgency && matchesStatus;
  });
}

function renderStats() {
  document.querySelector("#total-count").textContent = state.pitches.length;
  document.querySelector("#urgent-count").textContent = state.pitches.filter((pitch) => pitch.urgency === "Alta").length;
  document.querySelector("#checking-count").textContent = state.pitches.filter((pitch) => pitch.status === "Em apuracao").length;
  document.querySelector("#member-count").textContent = uniqueSorted(state.pitches.map((pitch) => pitch.author)).length + (state.profile ? 1 : 0);
}

function renderProfile() {
  const chip = document.querySelector("#user-chip");
  const preview = document.querySelector("#profile-preview");

  if (!state.profile) {
    chip.innerHTML = `
      <span class="avatar">?</span>
      <div>
        <strong>Visitante</strong>
        <small>Complete seu cadastro</small>
      </div>
    `;
    return;
  }

  chip.innerHTML = `
    <span class="avatar">${escapeHtml(initials(state.profile.name))}</span>
    <div>
      <strong>${escapeHtml(state.profile.name)}</strong>
      <small>${escapeHtml(state.profile.city)} - ${escapeHtml(state.profile.organization)}</small>
    </div>
  `;

  preview.innerHTML = `
    <span class="avatar large">${escapeHtml(initials(state.profile.name))}</span>
    <h2>${escapeHtml(state.profile.name)}</h2>
    <p>${escapeHtml(state.profile.organization)} em ${escapeHtml(state.profile.city)}</p>
    <div class="tag-row">
      ${String(state.profile.beats || "")
        .split(",")
        .map((beat) => beat.trim())
        .filter(Boolean)
        .map((beat) => `<span class="pill">#${escapeHtml(beat)}</span>`)
        .join("")}
    </div>
    <p><strong>Contato:</strong> ${escapeHtml(state.profile.contact || "Nao informado")}</p>
  `;

  document.querySelector("#profile-name").value = state.profile.name || "";
  document.querySelector("#profile-organization").value = state.profile.organization || "";
  document.querySelector("#profile-city").value = state.profile.city || "Campo Grande";
  document.querySelector("#profile-beats").value = state.profile.beats || "";
  document.querySelector("#profile-contact").value = state.profile.contact || "";
}

function renderFeed() {
  const pitches = getFilteredPitches();
  feedList.innerHTML = "";

  if (!pitches.length) {
    feedList.innerHTML = '<div class="empty-state">Nenhum factual encontrado com os filtros atuais.</div>';
    renderStats();
    return;
  }

  pitches.forEach((pitch) => {
    const card = document.createElement("article");
    card.className = "pitch-card";
    card.innerHTML = `
      <header>
        <div>
          <div class="author-row">
            <span class="mini-avatar">${escapeHtml(initials(pitch.author))}</span>
            <span>${escapeHtml(pitch.author)} - ${escapeHtml(pitch.organization || "Jornalista")}</span>
          </div>
          <h3>${escapeHtml(pitch.title)}</h3>
        </div>
        <span class="pill">${escapeHtml(pitch.createdAt)}</span>
      </header>
      <div class="meta-row">
        <span class="pill">${escapeHtml(pitch.city)} - MS</span>
        <span class="pill">${escapeHtml(pitch.category)}</span>
        <span class="pill urgency-${normalize(pitch.urgency)}">${escapeHtml(pitch.urgency)}</span>
        <span class="pill status-${normalize(pitch.status).replace(/\s+/g, "-")}">${escapeHtml(pitch.status)}</span>
      </div>
      <p>${escapeHtml(pitch.description)}</p>
      <div class="meta-row">
        <span><strong>Fonte inicial:</strong> ${escapeHtml(pitch.source || "Nao informada")}</span>
      </div>
      <div class="tag-row">
        ${pitch.tags.map((tag) => `<span class="pill">#${escapeHtml(tag)}</span>`).join("")}
      </div>
      <div class="card-actions">
        <button type="button" data-action="help" data-id="${pitch.id}">Tenho informacao (${pitch.helps})</button>
        <button type="button" data-action="checking" data-id="${pitch.id}">Estou apurando (${pitch.checking})</button>
        <button type="button" data-action="confirm" data-id="${pitch.id}">Confirmar</button>
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
    city: formData.get("city"),
    category: formData.get("category"),
    urgency: formData.get("urgency"),
    status: formData.get("status"),
    source: formData.get("source").trim(),
    author: state.profile?.name || "Jornalista sem cadastro",
    organization: state.profile?.organization || "Perfil incompleto",
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

navItems.forEach((item) => {
  item.addEventListener("click", () => switchView(item.dataset.view));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!state.profile) {
    switchView("profile");
    document.querySelector("#profile-name").focus();
    return;
  }

  const formData = new FormData(form);
  const pitch = createPitch(formData);
  state.pitches = [pitch, ...state.pitches];
  savePitches();
  fillFilterOptions();
  renderFeed();
  form.reset();
  citySelect.value = state.profile.city || "Campo Grande";
  switchView("feed");
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(profileForm);
  state.profile = {
    name: formData.get("name").trim(),
    organization: formData.get("organization").trim(),
    city: formData.get("city"),
    beats: formData.get("beats").trim(),
    contact: formData.get("contact").trim(),
  };
  saveProfile();
  renderProfile();
  citySelect.value = state.profile.city;
  switchView("feed");
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
    updatePitch(id, (pitch) => ({ ...pitch, checking: pitch.checking + 1, status: "Em apuracao" }));
  }

  if (action === "confirm") {
    updatePitch(id, (pitch) => ({ ...pitch, status: "Confirmado" }));
  }
});

searchInput.addEventListener("input", (event) => {
  state.filters.search = event.target.value;
  renderFeed();
});

[cityFilter, categoryFilter, urgencyFilter, statusFilter].forEach((select) => {
  select.addEventListener("change", (event) => {
    const key = event.target.id.replace("filter-", "");
    state.filters[key] = event.target.value;
    renderFeed();
  });
});

fillCityOptions(citySelect, false);
fillCityOptions(profileCitySelect, false);
fillCityOptions(cityFilter, true);
fillFilterOptions();
renderProfile();
renderFeed();

if (state.profile) {
  citySelect.value = state.profile.city;
} else {
  switchView("profile");
}
