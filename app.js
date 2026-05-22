const msCities = [
  "Campo Grande",
  "Dourados",
  "Três Lagoas",
  "Corumbá",
  "Ponta Porã",
  "Aquidauana",
  "Naviraí",
  "Nova Andradina",
  "Coxim",
  "Maracaju",
  "Jardim",
  "Paranaíba",
  "Sidrolândia",
  "Bonito",
  "Amambai",
];

const seedPitches = [
  {
    id: "pauta-1",
    title: "Temporal causa pontos de alagamento em Campo Grande",
    description:
      "Moradores relatam vias bloqueadas e semáforos apagados. Defesa Civil ainda não divulgou balanço. Pode render serviço sobre trânsito e áreas de risco.",
    city: "Campo Grande",
    category: "Clima",
    urgency: "Alta",
    status: "Em checagem",
    source: "Moradores e vídeos enviados à redação",
    author: "Marina Alves",
    organization: "Freelancer",
    role: "repórter",
    tags: ["chuva", "trânsito", "defesa civil"],
    helps: 7,
    checking: 3,
    followers: 8,
    createdAt: "Hoje, 08:42",
    updatedAt: "Atualizado há 6 min",
    updates: [
      {
        author: "Marina Alves",
        text: "Defesa Civil foi acionada. Aguardando retorno sobre pontos interditados.",
        createdAt: "há 6 min",
      },
    ],
  },
  {
    id: "pauta-2",
    title: "Fila para exames especializados vira queixa recorrente",
    description:
      "Pacientes relatam demora para cardiologia e ortopedia. Secretaria municipal pode ser procurada para confirmar dados e fila atual.",
    city: "Dourados",
    category: "Saúde",
    urgency: "Média",
    status: "Pista",
    source: "Pacientes e servidores da rede",
    author: "Rafael Costa",
    organization: "Rádio local",
    role: "produtor",
    tags: ["sus", "fila", "saúde pública"],
    helps: 4,
    checking: 1,
    followers: 3,
    createdAt: "Hoje, 07:15",
    updatedAt: "Atualizado há 45 min",
    updates: [],
  },
  {
    id: "pauta-3",
    title: "Câmara vota projeto que muda regras para ambulantes",
    description:
      "Projeto entra na pauta da sessão desta tarde. Comerciantes ambulantes prometem acompanhar a votação.",
    city: "Corumbá",
    category: "Política",
    urgency: "Alta",
    status: "Confirmado",
    source: "Pauta oficial da Câmara",
    author: "João Ferraz",
    organization: "Portal regional",
    role: "repórter",
    tags: ["câmara", "ambulantes", "votação"],
    helps: 11,
    checking: 5,
    followers: 12,
    createdAt: "Ontem, 18:30",
    updatedAt: "Atualizado há 1 h",
    updates: [
      {
        author: "João Ferraz",
        text: "Sessão confirmada para 14h. Lideranças dos ambulantes disseram que irão acompanhar.",
        createdAt: "há 1 h",
      },
    ],
  },
];

const pitchStorageKey = "radarMS.posts.v2";
const profileStorageKey = "radarMS.profile";

const state = {
  pitches: loadPitches(),
  profile: loadProfile(),
  selectedPitchId: null,
  filters: {
    search: "",
    city: "",
    category: "",
    urgency: "",
    status: "",
  },
};

const navItems = document.querySelectorAll(".nav-item");
const viewButtons = document.querySelectorAll("[data-view]");
const views = document.querySelectorAll(".view");
const form = document.querySelector("#pitch-form");
const profileForm = document.querySelector("#profile-form");
const feedList = document.querySelector("#feed-list");
const detailCard = document.querySelector("#detail-card");
const detailSide = document.querySelector("#detail-side");
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
    return Array.isArray(parsed) ? parsed.map(normalizePitch) : seedPitches;
  } catch {
    return seedPitches;
  }
}

function normalizePitch(pitch) {
  return {
    followers: 0,
    role: "",
    updatedAt: pitch.createdAt || "Agora",
    updates: [],
    ...pitch,
    status: pitch.status === "Em apuração" ? "Em checagem" : pitch.status,
    urgency: pitch.urgency === "Media" ? "Média" : pitch.urgency,
    tags: Array.isArray(pitch.tags) ? pitch.tags : [],
    helps: Number(pitch.helps || 0),
    checking: Number(pitch.checking || 0),
  };
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

function slug(text) {
  return normalize(text).replace(/\s+/g, "-");
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
  document.querySelector("#checking-count").textContent = state.pitches.filter((pitch) => pitch.status === "Em checagem").length;
  document.querySelector("#member-count").textContent = uniqueSorted(state.pitches.map((pitch) => pitch.author)).length + (state.profile ? 1 : 0);
}

function renderProfile() {
  const chip = document.querySelector("#user-chip");
  const quickAvatar = document.querySelector("#quick-avatar");
  const banner = document.querySelector("#onboarding-banner");
  const preview = document.querySelector("#profile-preview");

  if (!state.profile) {
    chip.innerHTML = `
      <span class="avatar">?</span>
      <div>
        <strong>Visitante</strong>
        <small>Complete seu cadastro</small>
      </div>
    `;
    quickAvatar.textContent = "?";
    banner.classList.remove("is-hidden");
    return;
  }

  const userInitials = initials(state.profile.name);
  quickAvatar.textContent = userInitials;
  banner.classList.add("is-hidden");
  chip.innerHTML = `
    <span class="avatar">${escapeHtml(userInitials)}</span>
    <div>
      <strong>${escapeHtml(state.profile.name)}</strong>
      <small>${escapeHtml(state.profile.city)} - ${escapeHtml(state.profile.organization)}</small>
    </div>
  `;

  preview.innerHTML = `
    <span class="avatar large">${escapeHtml(userInitials)}</span>
    <h2>${escapeHtml(state.profile.name)}</h2>
    <p>${escapeHtml(state.profile.role || "Jornalista")} em ${escapeHtml(state.profile.organization)} - ${escapeHtml(state.profile.city)}</p>
    <div class="tag-row">
      ${String(state.profile.beats || "")
        .split(",")
        .map((beat) => beat.trim())
        .filter(Boolean)
        .map((beat) => `<span class="pill">#${escapeHtml(beat)}</span>`)
        .join("")}
    </div>
    <p><strong>Contato:</strong> ${escapeHtml(state.profile.contact || "Não informado")}</p>
  `;

  document.querySelector("#profile-name").value = state.profile.name || "";
  document.querySelector("#profile-organization").value = state.profile.organization || "";
  document.querySelector("#profile-city").value = state.profile.city || "Campo Grande";
  document.querySelector("#profile-role").value = state.profile.role || "";
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
    card.className = `pitch-card urgency-${slug(pitch.urgency)}`;
    card.dataset.id = pitch.id;
    card.innerHTML = `
      <header>
        <div>
          <div class="author-row">
            <span class="mini-avatar">${escapeHtml(initials(pitch.author))}</span>
            <span>${escapeHtml(pitch.author)} - ${escapeHtml(pitch.organization || "Jornalista")}</span>
          </div>
          <h3>${escapeHtml(pitch.title)}</h3>
        </div>
        <span class="pill urgency-${slug(pitch.urgency)}">${escapeHtml(pitch.urgency)}</span>
      </header>
      <div class="meta-row">
        <span class="pill">${escapeHtml(pitch.city)} - MS</span>
        <span class="pill">${escapeHtml(pitch.category)}</span>
        <span class="pill status-${slug(pitch.status)}">${escapeHtml(pitch.status)}</span>
        <span class="pill">${escapeHtml(pitch.updatedAt)}</span>
      </div>
      <p>${escapeHtml(pitch.description)}</p>
      <div class="meta-row">
        <span><strong>Fonte inicial:</strong> ${escapeHtml(pitch.source || "Não informada")}</span>
      </div>
      <div class="tag-row">
        ${pitch.tags.map((tag) => `<span class="pill">#${escapeHtml(tag)}</span>`).join("")}
      </div>
      <div class="card-actions">
        <button type="button" data-action="follow" data-id="${pitch.id}">Acompanhar (${pitch.followers})</button>
        <button type="button" data-action="checking" data-id="${pitch.id}">Estou apurando (${pitch.checking})</button>
        <button type="button" data-action="detail" data-id="${pitch.id}">Abrir pauta</button>
      </div>
    `;
    feedList.appendChild(card);
  });

  renderStats();
}

function renderDetail() {
  const pitch = state.pitches.find((item) => item.id === state.selectedPitchId);
  if (!pitch) {
    switchView("feed");
    return;
  }

  detailCard.className = `detail-card urgency-${slug(pitch.urgency)}`;
  detailCard.innerHTML = `
    <div class="detail-header">
      <div>
        <div class="author-row">
          <span class="mini-avatar">${escapeHtml(initials(pitch.author))}</span>
          <span>${escapeHtml(pitch.author)} - ${escapeHtml(pitch.organization || "Jornalista")}</span>
        </div>
        <h2>${escapeHtml(pitch.title)}</h2>
      </div>
      <span class="pill urgency-${slug(pitch.urgency)}">${escapeHtml(pitch.urgency)}</span>
    </div>
    <div class="meta-row">
      <span class="pill">${escapeHtml(pitch.city)} - MS</span>
      <span class="pill">${escapeHtml(pitch.category)}</span>
      <span class="pill status-${slug(pitch.status)}">${escapeHtml(pitch.status)}</span>
      <span class="pill">${escapeHtml(pitch.updatedAt)}</span>
    </div>
    <p class="detail-body">${escapeHtml(pitch.description)}</p>
    <div class="detail-section">
      <h3>Colaboração</h3>
      <div class="detail-actions">
        <button class="button primary" type="button" data-action="follow" data-id="${pitch.id}">Acompanhar apuração (${pitch.followers})</button>
        <button type="button" data-action="checking" data-id="${pitch.id}">Estou apurando (${pitch.checking})</button>
        <button type="button" data-action="confirm" data-id="${pitch.id}">Confirmar</button>
        <button type="button" data-action="discard" data-id="${pitch.id}">Descartar</button>
      </div>
    </div>
    <div class="detail-section">
      <h3>Atualizações</h3>
      <form class="update-form" id="update-form">
        <textarea id="update-text" rows="3" placeholder="Adicione informação, fonte, confirmação ou contexto de apuração." required></textarea>
        <button class="button primary" type="submit">Adicionar atualização</button>
      </form>
      <div class="updates-list">
        ${renderUpdates(pitch)}
      </div>
    </div>
  `;

  detailSide.innerHTML = `
    <h2>Dados da pauta</h2>
    <p><strong>Fonte inicial:</strong> ${escapeHtml(pitch.source || "Não informada")}</p>
    <p><strong>Criada:</strong> ${escapeHtml(pitch.createdAt)}</p>
    <p><strong>Última atualização:</strong> ${escapeHtml(pitch.updatedAt)}</p>
    <p><strong>Jornalistas acompanhando:</strong> ${pitch.followers}</p>
    <div class="tag-row">
      ${pitch.tags.map((tag) => `<span class="pill">#${escapeHtml(tag)}</span>`).join("")}
    </div>
  `;

  document.querySelector("#update-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const textarea = document.querySelector("#update-text");
    addUpdate(pitch.id, textarea.value);
  });
}

function renderUpdates(pitch) {
  if (!pitch.updates.length) {
    return '<div class="empty-state">Ainda não há atualizações nesta pauta.</div>';
  }

  return pitch.updates
    .map(
      (update) => `
        <article class="update-item">
          <strong>${escapeHtml(update.author)} - ${escapeHtml(update.createdAt)}</strong>
          <p>${escapeHtml(update.text)}</p>
        </article>
      `
    )
    .join("");
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
  const description = formData.get("description").trim();
  const title = formData.get("title").trim() || description.slice(0, 82) + (description.length > 82 ? "..." : "");

  return {
    id: `pauta-${Date.now()}`,
    title,
    description,
    city: formData.get("city"),
    category: formData.get("category"),
    urgency: formData.get("urgency"),
    status: formData.get("status"),
    source: formData.get("source").trim(),
    author: state.profile?.name || "Jornalista sem cadastro",
    organization: state.profile?.organization || "Perfil incompleto",
    role: state.profile?.role || "",
    tags,
    helps: 0,
    checking: 0,
    followers: 1,
    createdAt: "Agora",
    updatedAt: "Atualizado agora",
    updates: [],
  };
}

function updatePitch(id, updater) {
  state.pitches = state.pitches.map((pitch) => (pitch.id === id ? normalizePitch(updater(pitch)) : pitch));
  savePitches();
  renderFeed();
  if (state.selectedPitchId === id) renderDetail();
}

function addUpdate(id, text) {
  const cleanText = text.trim();
  if (!cleanText) return;

  updatePitch(id, (pitch) => ({
    ...pitch,
    status: pitch.status === "Pista" ? "Em checagem" : pitch.status,
    updatedAt: "Atualizado agora",
    updates: [
      {
        author: state.profile?.name || "Jornalista sem cadastro",
        text: cleanText,
        createdAt: "agora",
      },
      ...pitch.updates,
    ],
  }));
}

viewButtons.forEach((item) => {
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
    role: formData.get("role").trim(),
    beats: formData.get("beats").trim(),
    contact: formData.get("contact").trim(),
  };
  saveProfile();
  renderProfile();
  renderStats();
  citySelect.value = state.profile.city;
  switchView("feed");
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  const card = event.target.closest(".pitch-card");

  if (actionButton) {
    const id = actionButton.dataset.id;
    const action = actionButton.dataset.action;

    if (action === "detail") {
      state.selectedPitchId = id;
      renderDetail();
      switchView("detail");
      return;
    }

    if (action === "follow") {
      updatePitch(id, (pitch) => ({ ...pitch, followers: pitch.followers + 1 }));
    }

    if (action === "checking") {
      updatePitch(id, (pitch) => ({ ...pitch, checking: pitch.checking + 1, status: "Em checagem", updatedAt: "Atualizado agora" }));
    }

    if (action === "confirm") {
      updatePitch(id, (pitch) => ({ ...pitch, status: "Confirmado", updatedAt: "Atualizado agora" }));
    }

    if (action === "discard") {
      updatePitch(id, (pitch) => ({ ...pitch, status: "Descartado", updatedAt: "Atualizado agora" }));
    }

    return;
  }

  if (card) {
    state.selectedPitchId = card.dataset.id;
    renderDetail();
    switchView("detail");
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

if (window.lucide) {
  window.lucide.createIcons();
}
