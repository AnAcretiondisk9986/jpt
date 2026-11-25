const tripDays = window.TRIP_DATA.days;
const overview = document.querySelector(".overview-button");
const dayTabs = document.querySelector("#day-tabs");
const itineraryContent = document.querySelector("#itinerary-content");
const mapLabel = document.querySelector("#map-label");
const mapStamp = document.querySelector("#map-day-stamp");
const mapTitle = document.querySelector("#map-day-title");
const mapSubtitle = document.querySelector("#map-day-subtitle");
const mapWatermark = document.querySelector("#map-watermark");
const mapFocusButton = document.querySelector("#map-focus");
const notesDialog = document.querySelector("#notes-dialog");

let selectedDay = "all";
let map;
let mapReady = false;
let activePopup;
const markers = [];

const modeIcons = { rail: "train", walk: "walk", flight: "plane", bus: "bus" };
const modeNames = { rail: "铁路", walk: "步行", flight: "航班", bus: "巴士" };

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

function renderDayTabs() {
  dayTabs.innerHTML = tripDays.map((day) => `
    <button
      class="day-tab"
      data-day="${day.id}"
      type="button"
      style="--day-color:${day.color}"
      aria-label="第 ${day.id} 天，${escapeHtml(day.shortTitle)}"
    >
      <span class="day-tab-number">${String(day.id).padStart(2, "0")}</span>
      <span class="day-tab-copy"><strong>${day.date}</strong><small>${day.weekday} · ${day.city.split(" · ")[0]}</small></span>
    </button>
  `).join("");
}

function renderTransfer(transfer, color) {
  if (!transfer) return "";
  return `
    <div class="transfer" style="--day-color:${color}">
      <svg aria-hidden="true"><use href="#icon-${modeIcons[transfer.mode]}"></use></svg>
      <div class="transfer-copy">
        <strong>${escapeHtml(transfer.method)} · ${escapeHtml(transfer.duration)}</strong>
        <span>${escapeHtml(transfer.detail)}</span>
      </div>
    </div>
  `;
}

function renderStops(day) {
  return day.stops.map((stop, index) => `
    <article class="stop" style="--day-color:${day.color}">
      <span class="stop-marker">${index + 1}</span>
      <button class="stop-card" data-stop-day="${day.id}" data-stop-index="${index}" type="button">
        <div class="stop-heading">
          <h3 class="stop-name">${escapeHtml(stop.name)}</h3>
          <span class="stop-time">${escapeHtml(stop.time)}</span>
        </div>
        <span class="stop-jp">${escapeHtml(stop.jp)}</span>
        <span class="stop-category">${escapeHtml(stop.category)}</span>
        <p>${escapeHtml(stop.description)}</p>
        ${stop.address ? `<span class="stop-address"><svg><use href="#icon-location"></use></svg>${escapeHtml(stop.address)}</span>` : ""}
      </button>
      <div></div>
      <div>${renderTransfer(stop.toNext, day.color)}</div>
    </article>
  `).join("");
}

function renderDay(day) {
  return `
    <section class="day-overview" style="--day-color:${day.color}" data-day-number="${String(day.id).padStart(2, "0")}">
      <div class="day-kicker">DAY ${String(day.id).padStart(2, "0")} · ${day.date} ${day.weekday}</div>
      <h2>${escapeHtml(day.title)}</h2>
      <p class="day-description">${escapeHtml(day.summary)}</p>
      <div class="day-tags">
        <span class="day-tag lodging">住宿 / ${escapeHtml(day.lodging)}</span>
        <span class="day-tag">${day.stops.length} 个停留点</span>
      </div>
    </section>
    <div class="timeline">${renderStops(day)}</div>
  `;
}

function renderOverview() {
  const stopCount = tripDays.reduce((count, day) => count + day.stops.length, 0);
  return `
    <section class="trip-summary">
      <p class="eyebrow">THE COMPLETE JOURNEY</p>
      <h2>八天，两种风景。</h2>
      <p>从东京街巷到关西山河，保留自然、人文与三场作品巡礼。点击任意一天，查看对应的地图和详细路线。</p>
      <div class="trip-stats">
        <div class="trip-stat"><strong>8</strong><span>旅行天数</span></div>
        <div class="trip-stat"><strong>5</strong><span>城市与周边</span></div>
        <div class="trip-stat"><strong>${stopCount}</strong><span>路线节点</span></div>
      </div>
    </section>
    <div class="overview-list">
      ${tripDays.map((day) => `
        <button class="overview-day" data-overview-day="${day.id}" style="--day-color:${day.color}" type="button">
          <span class="overview-day-number">${String(day.id).padStart(2, "0")}</span>
          <span><strong>${escapeHtml(day.shortTitle)}</strong><small>${day.date} ${day.weekday} · ${escapeHtml(day.city)}</small></span>
          <svg><use href="#icon-chevron"></use></svg>
        </button>
      `).join("")}
    </div>
  `;
}

function setMapText(dayId) {
  const day = tripDays.find((item) => item.id === Number(dayId));
  document.documentElement.style.setProperty("--accent", day ? day.color : "#ed3b23");
  if (!day) {
    mapLabel.textContent = "8 日路线总览";
    mapStamp.textContent = "ALL";
    mapTitle.textContent = "东京 → 大阪";
    mapSubtitle.textContent = "5 座城市周边 · 自然、街巷与圣地巡礼";
    mapWatermark.textContent = "08";
    return;
  }
  mapLabel.textContent = `DAY ${String(day.id).padStart(2, "0")} · ${day.city}`;
  mapStamp.textContent = String(day.id).padStart(2, "0");
  mapTitle.textContent = day.shortTitle;
  mapSubtitle.textContent = day.transport;
  mapWatermark.textContent = String(day.id).padStart(2, "0");
}

function selectDay(dayId, fit = true) {
  selectedDay = dayId === "all" ? "all" : Number(dayId);
  document.querySelectorAll("[data-day]").forEach((button) => {
    const isActive = button.dataset.day === String(selectedDay);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  const day = tripDays.find((item) => item.id === selectedDay);
  const selectedTab = document.querySelector(`.day-tab[data-day="${selectedDay}"]`);
  if (selectedTab && window.innerWidth <= 900) {
    const navigation = document.querySelector(".day-navigation");
    navigation.scrollTo({ left: selectedTab.offsetLeft - navigation.clientWidth + selectedTab.clientWidth, behavior: "smooth" });
  }
  itineraryContent.innerHTML = day ? renderDay(day) : renderOverview();
  itineraryContent.scrollTop = 0;
  setMapText(selectedDay);
  if (mapReady) {
    updateMapVisibility();
    if (fit) fitMap(selectedDay);
  }
}

function getVisibleDays() {
  return selectedDay === "all" ? tripDays : tripDays.filter((day) => day.id === selectedDay);
}

function fitMap(dayId) {
  const days = dayId === "all" ? tripDays : tripDays.filter((day) => day.id === Number(dayId));
  const coordinates = days.flatMap((day) => day.stops.map((stop) => stop.coords));
  const bounds = coordinates.reduce((box, coords) => box.extend(coords), new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
  const mapWidth = document.querySelector(".map-section").clientWidth;
  const horizontalPadding = Math.min(75, mapWidth * .12);
  map.fitBounds(bounds, {
    padding: { top: 90, right: horizontalPadding, bottom: 120, left: horizontalPadding },
    maxZoom: dayId === "all" ? (mapWidth < 500 ? 4.3 : 7.8) : 12.8,
    duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1100
  });
}

function updateMapVisibility() {
  markers.forEach(({ element, dayId }) => {
    element.classList.toggle("is-dimmed", selectedDay !== "all" && selectedDay !== dayId);
    element.style.display = selectedDay === "all" || selectedDay === dayId ? "grid" : "none";
  });
  tripDays.forEach((day) => {
    const visible = selectedDay === "all" || selectedDay === day.id;
    map.setLayoutProperty(`route-${day.id}`, "visibility", visible ? "visible" : "none");
    map.setLayoutProperty(`route-halo-${day.id}`, "visibility", visible ? "visible" : "none");
  });
}

function showStop(dayId, stopIndex, flyToStop = true) {
  const day = tripDays.find((item) => item.id === Number(dayId));
  const stop = day.stops[stopIndex];
  markers.forEach(({ element, dayId: markerDay, stopIndex: markerIndex }) => {
    element.classList.toggle("is-active", markerDay === day.id && markerIndex === stopIndex);
  });
  if (activePopup) activePopup.remove();
  activePopup = new maplibregl.Popup({ offset: 22, closeButton: true })
    .setLngLat(stop.coords)
    .setHTML(`
      <div style="--popup-color:${day.color}">
        <span class="popup-kicker">DAY ${day.id} · ${escapeHtml(stop.time)} · ${escapeHtml(stop.category)}</span>
        <h3 class="popup-title">${escapeHtml(stop.name)}</h3>
        <p class="popup-jp">${escapeHtml(stop.jp)}</p>
        <p class="popup-description">${escapeHtml(stop.description)}</p>
      </div>
    `)
    .addTo(map);
  if (flyToStop) map.flyTo({ center: stop.coords, zoom: Math.max(map.getZoom(), 12.5), duration: 900, essential: false });
}

function routeFeature(day) {
  return {
    type: "Feature",
    properties: { color: day.color },
    geometry: { type: "LineString", coordinates: day.stops.map((stop) => stop.coords) }
  };
}

function initializeMap() {
  map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/positron",
    center: [137.5, 35.7],
    zoom: 5,
    minZoom: 4,
    maxZoom: 18,
    attributionControl: { compact: true },
    cooperativeGestures: false
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  map.addControl(new maplibregl.ScaleControl({ maxWidth: 90, unit: "metric" }), "bottom-right");

  map.on("load", () => {
    tripDays.forEach((day) => {
      map.addSource(`route-${day.id}`, { type: "geojson", data: routeFeature(day) });
      map.addLayer({
        id: `route-halo-${day.id}`,
        type: "line",
        source: `route-${day.id}`,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#f8f7f1", "line-width": 7, "line-opacity": .9 }
      });
      map.addLayer({
        id: `route-${day.id}`,
        type: "line",
        source: `route-${day.id}`,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": day.color, "line-width": 3.5, "line-opacity": .95 }
      });
    });

    tripDays.forEach((day) => {
      day.stops.forEach((stop, stopIndex) => {
        const element = document.createElement("button");
        element.type = "button";
        element.className = "trip-marker";
        element.style.setProperty("--marker-color", day.color);
        element.textContent = stopIndex === 0 ? String(day.id) : `${day.id}.${stopIndex + 1}`;
        element.setAttribute("aria-label", `第 ${day.id} 天：${stop.name}`);
        element.title = stop.name;
        element.addEventListener("click", () => showStop(day.id, stopIndex));
        const offset = selectedDay === "all" && day.id === 5 && stopIndex === 0 ? [18, -18] : [0, 0];
        const marker = new maplibregl.Marker({ element, offset }).setLngLat(stop.coords).addTo(map);
        markers.push({ marker, element, dayId: day.id, stopIndex });
      });
    });

    mapReady = true;
    document.querySelector("#map-loading").classList.add("is-hidden");
    updateMapVisibility();
    fitMap(selectedDay);
  });

  map.on("error", (event) => {
    if (mapReady) return;
    console.error("Map loading error", event.error);
    const loading = document.querySelector("#map-loading");
    loading.innerHTML = "<strong>地图暂时未能载入</strong><span>请检查网络后刷新页面</span>";
  });
}

document.addEventListener("click", (event) => {
  const dayButton = event.target.closest("[data-day]");
  if (dayButton) {
    selectDay(dayButton.dataset.day);
    if (window.innerWidth <= 900) document.querySelector(".map-section").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const overviewDay = event.target.closest("[data-overview-day]");
  if (overviewDay) selectDay(overviewDay.dataset.overviewDay);
  const stopButton = event.target.closest("[data-stop-day]");
  if (stopButton && mapReady) showStop(Number(stopButton.dataset.stopDay), Number(stopButton.dataset.stopIndex));
});

document.querySelector("#fit-route").addEventListener("click", () => fitMap(selectedDay));
mapFocusButton.addEventListener("click", () => {
  const focusMode = document.body.classList.toggle("map-focus-mode");
  mapFocusButton.querySelector("span").textContent = focusMode ? "退出" : "全屏";
  mapFocusButton.setAttribute("aria-pressed", String(focusMode));
  map.resize();
  fitMap(selectedDay);
});
document.querySelector("#next-day").addEventListener("click", () => {
  const nextDay = selectedDay === "all" || selectedDay === tripDays.length ? 1 : selectedDay + 1;
  selectDay(nextDay);
});
document.querySelector("#open-notes").addEventListener("click", () => notesDialog.showModal());
document.querySelector("#close-notes").addEventListener("click", () => notesDialog.close());
notesDialog.addEventListener("click", (event) => {
  if (event.target === notesDialog) {
    const rect = notesDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) notesDialog.close();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("map-focus-mode")) mapFocusButton.click();
});

renderDayTabs();
selectDay("all", false);
initializeMap();
