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
const locale = window.TRIP_DATA.locale;

let selectedDay = "all";
let map;
let mapReady = false;
let activePopup;
let appEntered = false;
let mapTileMode = "online";
const markers = [];

const modeIcons = { rail: "train", walk: "walk", flight: "plane", bus: "bus" };
function localize(field, value) {
  return locale[field]?.[value] || value;
}

function localizeTransport(value) {
  return value
    .replaceAll("步行", "徒歩")
    .replaceAll("高铁", "高速鉄道")
    .replaceAll("飞机", "飛行機")
    .replaceAll("市域机场线", "空港連絡線")
    .replaceAll("京急机场线", "京急空港線")
    .replaceAll("东京单轨电车", "東京モノレール")
    .replaceAll("巴士", "バス")
    .replaceAll("地铁", "地下鉄")
    .replaceAll("秩父铁道", "秩父鉄道")
    .replaceAll("东海道新干线", "東海道新幹線")
    .replaceAll("江之电", "江ノ電")
    .replaceAll("西武线", "西武線")
    .replaceAll("南海电铁", "南海電鉄");
}

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
      aria-label="${day.id}日目 ${escapeHtml(localize("shortTitle", day.shortTitle))}"
    >
      <span class="day-tab-number">${String(day.id).padStart(2, "0")}</span>
      <span class="day-tab-copy"><strong>${day.date}</strong><small>${day.weekday} · ${localize("city", day.city).split("・")[0]}</small></span>
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
      <button class="stop-card" id="stop-${day.id}-${index}" data-stop-day="${day.id}" data-stop-index="${index}" type="button" aria-pressed="false">
        <div class="stop-heading">
          <h3 class="stop-name">${escapeHtml(stop.jp)}</h3>
          <span class="stop-time">${escapeHtml(stop.time)}</span>
        </div>
        <span class="stop-jp" lang="zh-CN">${escapeHtml(stop.name)}</span>
        <span class="stop-category" lang="zh-CN">${escapeHtml(stop.category)}</span>
        <p lang="zh-CN">${escapeHtml(stop.description)}</p>
        ${stop.address ? `<span class="stop-address" lang="zh-CN"><svg><use href="#icon-location"></use></svg>${escapeHtml(stop.address)}</span>` : ""}
      </button>
      <div></div>
      <div>${renderTransfer(stop.toNext, day.color)}</div>
    </article>
  `).join("");
}

function renderDay(day) {
  return `
    <section class="day-overview" style="--day-color:${day.color}" data-day-number="${String(day.id).padStart(2, "0")}">
      <div class="day-kicker">DAY ${String(day.id).padStart(2, "0")} · ${day.date} ${day.weekday}曜日</div>
      <h2>${escapeHtml(localize("title", day.title))}</h2>
      <p class="day-description" lang="zh-CN">${escapeHtml(day.summary)}</p>
      <div class="day-tags">
        <span class="day-tag lodging" lang="zh-CN">宿泊 / ${escapeHtml(day.lodging)}</span>
        <span class="day-tag">${day.stops.length} か所</span>
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
      <h2>八日間、二つの風景。</h2>
      <p lang="zh-CN">从东京街巷到关西山河，保留自然、人文与三场作品巡礼。点击任意一天，查看对应的地图和详细路线。</p>
      <div class="trip-stats">
        <div class="trip-stat"><strong>8</strong><span>日間</span></div>
        <div class="trip-stat"><strong>5</strong><span>街と周辺</span></div>
        <div class="trip-stat"><strong>${stopCount}</strong><span>スポット</span></div>
      </div>
    </section>
    <div class="overview-list">
      ${tripDays.map((day) => `
        <button class="overview-day" data-overview-day="${day.id}" style="--day-color:${day.color}" type="button">
          <span class="overview-day-number">${String(day.id).padStart(2, "0")}</span>
          <span><strong>${escapeHtml(localize("shortTitle", day.shortTitle))}</strong><small>${day.date} ${day.weekday} · ${escapeHtml(localize("city", day.city))}</small></span>
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
    mapLabel.textContent = "8日間のルート";
    mapStamp.textContent = "ALL";
    mapTitle.textContent = "東京 → 大阪";
    mapSubtitle.textContent = "5つの街と自然、聖地を巡る";
    mapWatermark.textContent = "08";
    return;
  }
  mapLabel.textContent = `DAY ${String(day.id).padStart(2, "0")} · ${localize("city", day.city)}`;
  mapStamp.textContent = String(day.id).padStart(2, "0");
  mapTitle.textContent = localize("shortTitle", day.shortTitle);
  mapSubtitle.textContent = localizeTransport(day.transport);
  mapWatermark.textContent = String(day.id).padStart(2, "0");
}

function selectDay(dayId, fit = true) {
  selectedDay = dayId === "all" ? "all" : Number(dayId);
  if (activePopup) activePopup.remove();
  activePopup = null;
  document.querySelectorAll("[data-day]").forEach((button) => {
    const isActive = button.dataset.day === String(selectedDay);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  const day = tripDays.find((item) => item.id === selectedDay);
  const selectedTab = document.querySelector(`.day-tab[data-day="${selectedDay}"]`);
  if (selectedTab && window.innerWidth <= 900) {
    const navigation = document.querySelector(".day-navigation");
    navigation.scrollTo({ left: selectedTab.offsetLeft - navigation.clientWidth + selectedTab.clientWidth, behavior: "instant" });
  }
  itineraryContent.innerHTML = day ? renderDay(day) : renderOverview();
  itineraryContent.scrollTo({ top: 0, behavior: "instant" });
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

function showStop(dayId, stopIndex, flyToStop = true, scrollToCard = false) {
  const day = tripDays.find((item) => item.id === Number(dayId));
  const stop = day.stops[stopIndex];
  markers.forEach(({ element, dayId: markerDay, stopIndex: markerIndex }) => {
    element.classList.toggle("is-active", markerDay === day.id && markerIndex === stopIndex);
  });
  if (mapReady) {
    if (activePopup) activePopup.remove();
    activePopup = new maplibregl.Popup({ offset: 22, closeButton: true })
      .setLngLat(stop.coords)
      .setHTML(`
        <div style="--popup-color:${day.color}">
          <span class="popup-kicker">DAY ${day.id} · ${escapeHtml(stop.time)} · ${escapeHtml(stop.category)}</span>
          <h3 class="popup-title">${escapeHtml(stop.jp)}</h3>
          <p class="popup-jp" lang="zh-CN">${escapeHtml(stop.name)}</p>
          <p class="popup-description" lang="zh-CN">${escapeHtml(stop.description)}</p>
        </div>
      `)
      .addTo(map);
    if (flyToStop) map.flyTo({ center: stop.coords, zoom: Math.max(map.getZoom(), 12.5), duration: 900, essential: false });
  }
  document.querySelectorAll(".stop-card").forEach((card) => {
    const active = Number(card.dataset.stopDay) === day.id && Number(card.dataset.stopIndex) === stopIndex;
    card.classList.toggle("is-selected", active);
    card.setAttribute("aria-pressed", String(active));
  });
  if (scrollToCard) {
    const card = document.querySelector(`#stop-${day.id}-${stopIndex}`);
    const cardTop = card.getBoundingClientRect().top - itineraryContent.getBoundingClientRect().top + itineraryContent.scrollTop;
    const target = cardTop - itineraryContent.clientHeight * .2;
    itineraryContent.scrollTo({ top: Math.max(0, target), behavior: "instant" });
  }
}

function revealStop(dayId, stopIndex) {
  if (selectedDay !== dayId) selectDay(dayId, false);
  showStop(dayId, stopIndex, false, true);
}

function routeFeature(day) {
  return {
    type: "Feature",
    properties: { color: day.color },
    geometry: { type: "LineString", coordinates: day.stops.map((stop) => stop.coords) }
  };
}

async function initializeMap() {
  const localTiles = `${new URL("./assets/map/tiles/", document.baseURI).href}{z}/{x}/{y}.pbf`;
  const styleResponse = await fetch(new URL("./assets/map/positron.json", document.baseURI));
  if (!styleResponse.ok) throw new Error(`Local map style request failed: ${styleResponse.status}`);
  const mapStyle = await styleResponse.json();
  const remoteTiles = "https://tiles.openfreemap.org/planet/20261122_124456_pt/{z}/{x}/{y}.pbf";
  mapStyle.sources.openmaptiles.tiles = [remoteTiles];
  mapStyle.sources.openmaptiles.minzoom = 0;
  mapStyle.sprite = new URL("./assets/map/sprites/ofm", document.baseURI).href;
  mapStyle.glyphs = `${new URL("./assets/map/fonts/", document.baseURI).href}{fontstack}/{range}.pbf`;
  mapStyle.sources = Object.fromEntries(Object.entries(mapStyle.sources)
    .filter(([id]) => id === "openmaptiles"));
  mapStyle.layers = mapStyle.layers.filter((layer) => layer.source !== "ne2_shaded");

  map = new maplibregl.Map({
    container: "map",
    style: mapStyle,
    center: [136.2, 35.6],
    zoom: 5,
    minZoom: 4,
    maxZoom: 18,
    attributionControl: { compact: true },
    cooperativeGestures: false,
    scrollZoom: true,
    dragRotate: false,
    touchPitch: false
  });
  const resizeMap = () => {
    if (mapReady && appEntered) map.resize();
  };
  new ResizeObserver(resizeMap).observe(document.querySelector("#journey-app"));
  window.addEventListener("resize", resizeMap);
  map.touchZoomRotate.disableRotation();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  map.addControl(new maplibregl.ScaleControl({ maxWidth: 90, unit: "metric" }), "bottom-right");

  function activateLocalTiles() {
    if (mapTileMode === "local") return;
    mapTileMode = "local";
    const fallbackStyle = map.getStyle();
    fallbackStyle.sources.openmaptiles.tiles = [localTiles];
    map.setStyle(fallbackStyle, { diff: true });
    document.querySelector("#map-source-label").textContent = "LOCAL MAP";
    document.querySelector("#map-source-label").title = "在线地图连接失败，已使用随网页托管的本地地图。";
  }

  function addTripLayers() {
    if (mapReady) return;
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
        const anchor = document.createElement("div");
        anchor.className = "trip-marker-anchor";
        anchor.removeAttribute("role");
        anchor.removeAttribute("aria-label");
        const element = document.createElement("button");
        element.type = "button";
        element.className = "trip-marker";
        element.style.setProperty("--marker-color", day.color);
        element.textContent = stopIndex === 0 ? String(day.id) : `${day.id}.${stopIndex + 1}`;
        element.setAttribute("aria-label", `${day.id}日目 ${stop.jp}`);
        element.title = stop.name;
        element.addEventListener("click", (event) => {
          event.stopPropagation();
          revealStop(day.id, stopIndex);
        });
        anchor.appendChild(element);
        const marker = new maplibregl.Marker({ element: anchor, anchor: "center" }).setLngLat(stop.coords).addTo(map);
        markers.push({ marker, element, dayId: day.id, stopIndex });
      });
    });

    mapReady = true;
    window.dispatchEvent(new Event("jpt-map-ready"));
    document.querySelector("#map-loading").classList.add("is-hidden");
    updateMapVisibility();
    fitMap(selectedDay);
  }

  const mapSection = document.querySelector(".map-section");
  const mapCanvas = map.getCanvas();
  mapSection.addEventListener("wheel", (event) => {
    if (event.target.closest(".maplibregl-ctrl, .map-topbar, .map-bottom-card")) return;
    event.preventDefault();
  }, { passive: false });
  mapCanvas.setAttribute("tabindex", "0");

  map.on("load", addTripLayers);
  map.on("style.load", addTripLayers);

  map.on("error", (event) => {
    console.warn("Map resource fallback", event.error);
    if (mapTileMode === "online") activateLocalTiles();
  });
}

document.addEventListener("click", (event) => {
  const dayButton = event.target.closest("[data-day]");
  if (dayButton) {
    selectDay(dayButton.dataset.day);
    return;
  }
  const overviewDay = event.target.closest("[data-overview-day]");
  if (overviewDay) {
    selectDay(overviewDay.dataset.overviewDay);
    return;
  }
  const stopButton = event.target.closest("[data-stop-day]");
  if (stopButton) revealStop(Number(stopButton.dataset.stopDay), Number(stopButton.dataset.stopIndex));
});

function enterJourney() {
  if (appEntered) return;
  appEntered = true;
  document.querySelector("#welcome").hidden = true;
  document.querySelector("#journey-app").hidden = false;
  document.body.classList.add("journey-open");
  history.replaceState(null, "", `${location.pathname}${location.search}#journey`);
  if (mapReady) {
    map.resize();
    fitMap(selectedDay);
  } else if (!map) {
    map = true;
    initializeMap().catch(showMapError);
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}

function showWelcome() {
  appEntered = false;
  document.body.classList.remove("journey-open");
  document.querySelector("#journey-app").hidden = true;
  document.querySelector("#welcome").hidden = false;
  history.replaceState(null, "", `${location.pathname}${location.search}`);
  window.scrollTo({ top: 0, behavior: "instant" });
}

document.querySelector("#welcome").addEventListener("click", (event) => {
  if (!event.target.closest("a")) enterJourney();
});
document.querySelector("#welcome").addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    enterJourney();
  }
});
document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  showWelcome();
});
document.addEventListener("gesturestart", (event) => {
  if (!event.target.closest("#map")) event.preventDefault();
}, { passive: false });
document.addEventListener("touchmove", (event) => {
  if (event.touches.length > 1 && !event.target.closest("#map")) event.preventDefault();
}, { passive: false });

document.querySelector("#fit-route").addEventListener("click", () => fitMap(selectedDay));
mapFocusButton.addEventListener("click", () => {
  const focusMode = document.body.classList.toggle("map-focus-mode");
  mapFocusButton.querySelector("span").textContent = focusMode ? "戻る" : "全画面";
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
if (location.hash === "#journey") enterJourney();

function showMapError(error) {
  console.error("Map initialization failed", error);
  map = null;
  document.querySelector("#map-loading").innerHTML = "<strong>地図を読み込めませんでした</strong><span>通信状態を確認し、ページを再読込みしてください</span>";
}
