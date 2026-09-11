/* =========================================================
   ROOMS.JS
   Mock data + rendering for Rooms, Room Types, Price Bands,
   and Room Facilities.

   NOTE ON FUTURE BACKEND:
   Every "get" function below returns mock data now, but is
   written so the body can later be swapped for a fetch() call
   to the C++ API, e.g.:
     async function getRooms() {
       return fetch('/api/rooms').then(r => r.json());
     }
   ========================================================= */

const IMG = {
  single: "images/room-single.jpg",
  double: "images/room-double.jpg",
  twin: "images/room-twin.jpg",
  deluxe: "images/room-deluxe.jpg",
  family: "images/room-family.jpg",
  suite: "images/room-suite.jpg",
};

/* ---------- ROOM TYPES (future table: RoomTypes) ---------- */
const mockRoomTypes = [
  { id: 1, name: "Single Room", description: "A cosy room built for the solo traveller who still wants a little comfort.", maxOccupancy: 1, startingPrice: 1800, image: IMG.single },
  { id: 2, name: "Double Room", description: "One generous bed, warm tones, and enough space for two to settle in.", maxOccupancy: 2, startingPrice: 2400, image: IMG.double },
  { id: 3, name: "Twin Room", description: "Two separate beds, ideal for friends or colleagues travelling together.", maxOccupancy: 2, startingPrice: 2400, image: IMG.twin },
  { id: 4, name: "Deluxe Room", description: "Extra square footage, garden views, and upgraded in-room finishes.", maxOccupancy: 3, startingPrice: 3200, image: IMG.deluxe },
  { id: 5, name: "Family Room", description: "Connecting sleeping areas built around families and small groups.", maxOccupancy: 5, startingPrice: 4200, image: IMG.family },
  { id: 6, name: "Suite", description: "A separate living area, premium furnishings, and our quietest corners.", maxOccupancy: 4, startingPrice: 6500, image: IMG.suite },
];

/* ---------- PRICE BANDS (future table: PriceBands) ---------- */
const mockPriceBands = [
  { id: 1, name: "Standard", multiplier: 1.0 },
  { id: 2, name: "Premium", multiplier: 1.15 },
  { id: 3, name: "Peak Season", multiplier: 1.3 },
];

/* ---------- ROOM FACILITIES (future table: RoomFacilities) ---------- */
const mockFacilities = [
  { id: 1, name: "Wi-Fi", icon: "\uD83D\uDCF6" },
  { id: 2, name: "Air Conditioning", icon: "\u2744\uFE0F" },
  { id: 3, name: "Smart TV", icon: "\uD83D\uDCFA" },
  { id: 4, name: "Mini-bar", icon: "\uD83C\uDF77" },
  { id: 5, name: "Private Bathroom", icon: "\uD83D\uDEBF" },
  { id: 6, name: "Bathtub", icon: "\uD83D\uDEC1" },
  { id: 7, name: "Balcony", icon: "\uD83C\uDF07" },
  { id: 8, name: "Room Service", icon: "\uD83D\uDECE\uFE0F" },
  { id: 9, name: "Refrigerator", icon: "\uD83E\uDDCA" },
  { id: 10, name: "Workspace", icon: "\uD83D\uDCBB" },
];

function facilityNames(idList) {
  return idList.map((id) => mockFacilities.find((f) => f.id === id)?.name).filter(Boolean);
}

/* ---------- ROOMS (future table: Rooms) ----------
   status: "available" | "booked" | "unavailable"
   roomTypeId -> RoomTypes.id
   priceBandId -> PriceBands.id
   facilityIds -> RoomFacilities.id (many-to-many)
------------------------------------------------------ */
const mockRooms = [
  { id: 101, number: "101", roomTypeId: 1, priceBandId: 1, basePrice: 1800, maxGuests: 1, facilityIds: [1, 2, 5], status: "available", image: IMG.single },
  { id: 102, number: "102", roomTypeId: 1, priceBandId: 1, basePrice: 1800, maxGuests: 1, facilityIds: [1, 2, 5, 9], status: "booked", image: IMG.single },
  { id: 201, number: "201", roomTypeId: 2, priceBandId: 2, basePrice: 2400, maxGuests: 2, facilityIds: [1, 2, 3, 5], status: "available", image: IMG.double },
  { id: 202, number: "202", roomTypeId: 2, priceBandId: 1, basePrice: 2400, maxGuests: 2, facilityIds: [1, 2, 3, 5, 9], status: "available", image: IMG.double },
  { id: 301, number: "301", roomTypeId: 3, priceBandId: 2, basePrice: 2500, maxGuests: 2, facilityIds: [1, 2, 3, 5, 10], status: "available", image: IMG.twin },
  { id: 302, number: "302", roomTypeId: 3, priceBandId: 1, basePrice: 2400, maxGuests: 2, facilityIds: [1, 2, 3, 5], status: "unavailable", image: IMG.twin },
  { id: 205, number: "205", roomTypeId: 4, priceBandId: 2, basePrice: 3200, maxGuests: 3, facilityIds: [1, 2, 3, 4, 5, 7], status: "available", image: IMG.deluxe },
  { id: 206, number: "206", roomTypeId: 4, priceBandId: 2, basePrice: 3200, maxGuests: 3, facilityIds: [1, 2, 3, 4, 5], status: "available", image: IMG.deluxe },
  { id: 210, number: "210", roomTypeId: 4, priceBandId: 3, basePrice: 3600, maxGuests: 3, facilityIds: [1, 2, 3, 4, 5, 6, 7], status: "booked", image: IMG.deluxe },
  { id: 401, number: "401", roomTypeId: 5, priceBandId: 2, basePrice: 4200, maxGuests: 5, facilityIds: [1, 2, 3, 4, 5, 9], status: "available", image: IMG.family },
  { id: 402, number: "402", roomTypeId: 5, priceBandId: 1, basePrice: 4000, maxGuests: 5, facilityIds: [1, 2, 3, 5, 9], status: "available", image: IMG.family },
  { id: 501, number: "501", roomTypeId: 6, priceBandId: 3, basePrice: 6800, maxGuests: 4, facilityIds: [1, 2, 3, 4, 5, 6, 7, 8, 10], status: "available", image: IMG.suite },
  { id: 502, number: "502", roomTypeId: 6, priceBandId: 2, basePrice: 6500, maxGuests: 4, facilityIds: [1, 2, 3, 4, 5, 6, 8], status: "booked", image: IMG.suite },
];

/* ---------- Data access (swap for fetch() later) ---------- */
async function getRooms() {
  // Later: return fetch('/api/rooms').then(r => r.json());
  return mockRooms;
}
async function getRoomTypes() {
  // Later: return fetch('/api/room-types').then(r => r.json());
  return mockRoomTypes;
}
async function getFacilities() {
  // Later: return fetch('/api/facilities').then(r => r.json());
  return mockFacilities;
}
async function getPriceBands() {
  // Later: return fetch('/api/price-bands').then(r => r.json());
  return mockPriceBands;
}

function roomTypeOf(room) { return mockRoomTypes.find((t) => t.id === room.roomTypeId); }
function priceBandOf(room) { return mockPriceBands.find((b) => b.id === room.priceBandId); }
function formatPHP(amount) { return "\u20B1" + Math.round(amount).toLocaleString("en-PH"); }

/* ---------- Rendering: Room cards ---------- */
function roomCardHTML(room) {
  const type = roomTypeOf(room);
  const band = priceBandOf(room);
  const facilities = facilityNames(room.facilityIds).slice(0, 4);
  const statusLabel = { available: "Available", booked: "Fully Booked", unavailable: "Unavailable" }[room.status];
  const statusClass = { available: "status-available", booked: "status-booked", unavailable: "status-unavailable" }[room.status];

  return `
    <article class="card room-card" data-room-id="${room.id}" data-type="${type.name.split(" ")[0]}">
      <div class="card-media" style="background-image:url('${room.image}')">
        <span class="status-badge ${statusClass}">${statusLabel}</span>
      </div>
      <div class="card-body">
        <div class="card-top-row">
          <div>
            <p class="card-room-no">Room ${room.number}</p>
            <h3 class="card-title">${type.name}</h3>
          </div>
          <p class="card-price">${formatPHP(room.basePrice)}<span> /night</span></p>
        </div>
        <p class="card-meta">Up to ${room.maxGuests} guest${room.maxGuests > 1 ? "s" : ""}</p>
        <div class="tag-row">
          ${facilities.map((f) => `<span class="tag">${f}</span>`).join("")}
          <span class="tag tag-band">${band.name}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-ghost btn-view-room" data-room-id="${room.id}">View Details</button>
          <button class="btn btn-primary btn-book-room" data-room-id="${room.id}" ${room.status !== "available" ? "disabled style='opacity:.5;cursor:not-allowed'" : ""}>Book Now</button>
        </div>
      </div>
    </article>
  `;
}

async function renderRooms(filter = "all") {
  const grid = document.getElementById("roomGrid");
  if (!grid) return;
  const rooms = await getRooms();
  const filtered = filter === "all" ? rooms : rooms.filter((r) => roomTypeOf(r).name.startsWith(filter));

  grid.innerHTML = filtered.length
    ? filtered.map(roomCardHTML).join("")
    : `<div class="empty-state">No rooms match this filter yet.</div>`;
}

/* ---------- Rendering: Room Types ---------- */
async function renderRoomTypes() {
  const grid = document.getElementById("typeGrid");
  if (!grid) return;
  const types = await getRoomTypes();

  grid.innerHTML = types.map((t) => `
    <article class="type-card">
      <div class="card-media" style="background-image:url('${t.image}')"></div>
      <div class="card-body">
        <h3>${t.name}</h3>
        <p>${t.description}</p>
        <p class="type-meta">Up to ${t.maxOccupancy} guests &middot; from ${formatPHP(t.startingPrice)}/night</p>
        <button class="btn btn-outline btn-view-type" data-type="${t.name.split(" ")[0]}" style="color:var(--cream);border-color:rgba(245,235,221,.5);margin-top:.4rem;align-self:flex-start;">View Rooms</button>
      </div>
    </article>
  `).join("");
}

/* ---------- Rendering: Facilities ---------- */
async function renderFacilities() {
  const grid = document.getElementById("facilityGrid");
  if (!grid) return;
  const facilities = await getFacilities();

  grid.innerHTML = facilities.map((f) => `
    <div class="facility-card">
      <div class="facility-icon">${f.icon}</div>
      <p class="facility-name">${f.name}</p>
    </div>
  `).join("");
}

async function renderFacilityLookup() {
  const select = document.getElementById("facilityRoomSelect");
  const result = document.getElementById("facilityLookupResult");
  if (!select || !result) return;
  const rooms = await getRooms();

  select.innerHTML = rooms.map((r) => `<option value="${r.id}">Room ${r.number} \u2014 ${roomTypeOf(r).name}</option>`).join("");

  function showFacilities(roomId) {
    const room = rooms.find((r) => r.id === Number(roomId));
    if (!room) return;
    const names = facilityNames(room.facilityIds);
    result.innerHTML = `
      <p style="font-weight:500;margin-bottom:.6rem;color:var(--midnight);">Room ${room.number} Facilities</p>
      <ul>${names.map((n) => `<li>${n}</li>`).join("")}</ul>
    `;
  }

  select.addEventListener("change", (e) => showFacilities(e.target.value));
  showFacilities(select.value);
}

/* ---------- Room detail modal content ---------- */
async function getRoomDetailHTML(roomId) {
  const rooms = await getRooms();
  const room = rooms.find((r) => r.id === Number(roomId));
  if (!room) return "<p>Room not found.</p>";
  const type = roomTypeOf(room);
  const band = priceBandOf(room);
  const names = facilityNames(room.facilityIds);
  const statusLabel = { available: "Available", booked: "Fully Booked", unavailable: "Unavailable" }[room.status];

  return `
    <div class="detail-media" style="background-image:url('${room.image}')"></div>
    <p class="card-room-no">Room ${room.number} &middot; ${type.name}</p>
    <h3 style="margin:.3rem 0 .5rem;">${type.name}</h3>
    <p class="detail-price">${formatPHP(room.basePrice)} <span style="font-size:.85rem;color:#6B7A72;font-family:var(--font-body);">/ night</span></p>
    <p class="card-meta">Up to ${room.maxGuests} guests &middot; Price band: ${band.name} &middot; Status: ${statusLabel}</p>
    <ul class="detail-list">${names.map((n) => `<li>${n}</li>`).join("")}</ul>
    <button class="btn btn-primary field-submit btn-book-room" data-room-id="${room.id}" ${room.status !== "available" ? "disabled style='opacity:.5;cursor:not-allowed'" : ""}>Book This Room</button>
  `;
}
