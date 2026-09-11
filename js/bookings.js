/* =========================================================
   BOOKINGS.JS
   Mock data + rendering for Bookings, Customers, Guests,
   and Payments.

   Relationships modelled (mock only, for future SQL schema):
     Customer 1---N Bookings
     Booking  1---N Guests   (booking.guests = [ids])
     Booking  1---N Rooms    (booking.rooms  = [ids])
     Booking  1---N Payments
   ========================================================= */

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
function fmtDate(date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
function shortDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ---------- CUSTOMERS (future table: Customers) ---------- */
const mockCustomers = [
  { id: 1, name: "John Smith", email: "john.smith@mail.com", phone: "+63 917 555 0101" },
  { id: 2, name: "Amara Reyes", email: "amara.reyes@mail.com", phone: "+63 917 555 0142" },
  { id: 3, name: "Michael Tan", email: "michael.tan@mail.com", phone: "+63 917 555 0193" },
  { id: 4, name: "Grace Villanueva", email: "grace.v@mail.com", phone: "+63 917 555 0207" },
  { id: 5, name: "Diego Santos", email: "diego.santos@mail.com", phone: "+63 917 555 0288" },
];

/* ---------- GUESTS (future table: Guests) ----------
   A guest is NOT necessarily the customer who booked.
------------------------------------------------------ */
const mockGuests = [
  { id: 1, name: "John Smith", contact: "+63 917 555 0101" },
  { id: 2, name: "Maria Smith", contact: "+63 917 555 0102" },
  { id: 3, name: "Amara Reyes", contact: "+63 917 555 0142" },
  { id: 4, name: "Michael Tan", contact: "+63 917 555 0193" },
  { id: 5, name: "Grace Villanueva", contact: "+63 917 555 0207" },
  { id: 6, name: "Peter Villanueva", contact: "+63 917 555 0208" },
  { id: 7, name: "Anna Villanueva", contact: "+63 917 555 0209" },
  { id: 8, name: "Diego Santos", contact: "+63 917 555 0288" },
  { id: 9, name: "Elena Cruz", contact: "+63 917 555 0311" },
  { id: 10, name: "Rico Fernandez", contact: "+63 917 555 0345" },
];

/* ---------- BOOKINGS (future table: Bookings) ---------- */
const mockBookings = [
  {
    id: "BK-1001", customerId: 1, guests: [1, 2], rooms: [205, 206],
    checkIn: addDays(5), checkOut: addDays(8), bookingDate: addDays(-10),
    totalPrice: 3200 * 3 + 3200 * 3, status: "future",
  },
  {
    id: "BK-1002", customerId: 2, guests: [3], rooms: [201],
    checkIn: addDays(12), checkOut: addDays(15), bookingDate: addDays(-3),
    totalPrice: 2400 * 3, status: "future",
  },
  {
    id: "BK-1003", customerId: 3, guests: [4], rooms: [401],
    checkIn: addDays(1), checkOut: addDays(6), bookingDate: addDays(-20),
    totalPrice: 4200 * 5, status: "future",
  },
  {
    id: "BK-1004", customerId: 4, guests: [5, 6, 7], rooms: [402],
    checkIn: addDays(-1), checkOut: addDays(2), bookingDate: addDays(-15),
    totalPrice: 4000 * 3, status: "current",
  },
  {
    id: "BK-1005", customerId: 5, guests: [8], rooms: [501],
    checkIn: addDays(-2), checkOut: addDays(3), bookingDate: addDays(-18),
    totalPrice: 6800 * 5, status: "current",
  },
  {
    id: "BK-1006", customerId: 1, guests: [9], rooms: [301],
    checkIn: addDays(0), checkOut: addDays(4), bookingDate: addDays(-9),
    totalPrice: 2500 * 4, status: "current",
  },
  {
    id: "BK-0994", customerId: 2, guests: [10], rooms: [101],
    checkIn: addDays(-25), checkOut: addDays(-22), bookingDate: addDays(-40),
    totalPrice: 1800 * 3, status: "archived",
  },
  {
    id: "BK-0987", customerId: 3, guests: [4], rooms: [202],
    checkIn: addDays(-40), checkOut: addDays(-36), bookingDate: addDays(-55),
    totalPrice: 2400 * 4, status: "archived",
  },
  {
    id: "BK-0980", customerId: 5, guests: [8], rooms: [502],
    checkIn: addDays(-60), checkOut: addDays(-55), bookingDate: addDays(-70),
    totalPrice: 6500 * 5, status: "archived",
  },
];

/* ---------- PAYMENTS (future table: Payments) ---------- */
const mockPayments = [
  { id: "PM-501", bookingId: "BK-1001", customerId: 1, amount: 19200, date: addDays(-9), method: "Credit Card", status: "Paid" },
  { id: "PM-502", bookingId: "BK-1002", customerId: 2, amount: 7200, date: addDays(-2), method: "GCash", status: "Pending" },
  { id: "PM-503", bookingId: "BK-1003", customerId: 3, amount: 21000, date: addDays(-19), method: "Bank Transfer", status: "Paid" },
  { id: "PM-504", bookingId: "BK-1004", customerId: 4, amount: 6000, date: addDays(-14), method: "Credit Card", status: "Partial" },
  { id: "PM-505", bookingId: "BK-1005", customerId: 5, amount: 34000, date: addDays(-17), method: "Credit Card", status: "Paid" },
  { id: "PM-506", bookingId: "BK-1006", customerId: 1, amount: 10000, date: addDays(-8), method: "GCash", status: "Paid" },
  { id: "PM-490", bookingId: "BK-0994", customerId: 2, amount: 5400, date: addDays(-39), method: "Cash", status: "Refunded" },
];

/* ---------- Data access (swap for fetch() later) ---------- */
async function getCustomers() { return mockCustomers; }
async function getGuests() { return mockGuests; }
async function getBookings() { return mockBookings; }
async function getPayments() { return mockPayments; }

function customerName(id) { return mockCustomers.find((c) => c.id === id)?.name ?? "Unknown"; }
function guestName(id) { return mockGuests.find((g) => g.id === id)?.name ?? "Unknown"; }

/* ---------- Rendering: Bookings tabs ---------- */
function bookingCardHTML(booking) {
  const statusClass = { future: "status-future", current: "status-current", archived: "status-archived" }[booking.status];
  const statusLabel = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);

  return `
    <article class="card booking-card">
      <p class="booking-id">Booking #${booking.id}</p>
      <div class="booking-row"><span>Customer</span><strong>${customerName(booking.customerId)}</strong></div>
      <div class="booking-row"><span>Guests</span><strong>${booking.guests.map(guestName).join(", ")}</strong></div>
      <div class="booking-row"><span>Rooms</span><strong>${booking.rooms.map((r) => "Room " + r).join(", ")}</strong></div>
      <div class="booking-row"><span>Check-in</span><strong>${fmtDate(booking.checkIn)}</strong></div>
      <div class="booking-row"><span>Check-out</span><strong>${fmtDate(booking.checkOut)}</strong></div>
      <div class="booking-row"><span>Total</span><strong>${formatPHP(booking.totalPrice)}</strong></div>
      <span class="booking-status ${statusClass}">${statusLabel}</span>
    </article>
  `;
}

async function renderBookings(tab = "future") {
  const grid = document.getElementById("bookingGrid");
  if (!grid) return;
  const bookings = await getBookings();
  const filtered = bookings.filter((b) => b.status === tab);

  grid.innerHTML = filtered.length
    ? filtered.map(bookingCardHTML).join("")
    : `<div class="empty-state">No ${tab} bookings right now.</div>`;
}

/* ---------- Rendering: This Week's Guests ---------- */
async function renderWeekGuests() {
  const tbody = document.querySelector("#weekGuestsTable tbody");
  const summaryEl = document.getElementById("weekSummary");
  if (!tbody || !summaryEl) return;

  const bookings = await getBookings();
  const today = new Date();
  const weekEnd = addDays(7);

  const rows = [];
  bookings.forEach((b) => {
    const overlapsWeek = b.checkIn <= weekEnd && b.checkOut >= today && b.status !== "archived";
    if (!overlapsWeek) return;
    b.guests.forEach((gid) => {
      rows.push({
        guest: guestName(gid),
        bookingId: b.id,
        room: b.rooms[0],
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        status: b.status,
      });
    });
  });

  const currentCount = rows.filter((r) => r.status === "current").length;
  const upcomingCount = rows.filter((r) => r.status === "future").length;

  summaryEl.innerHTML = `
    <div class="stat-pill"><span class="stat-num">${rows.length}</span><span class="stat-label">Guests This Week</span></div>
    <div class="stat-pill"><span class="stat-num">${currentCount}</span><span class="stat-label">Current Guests</span></div>
    <div class="stat-pill"><span class="stat-num">${upcomingCount}</span><span class="stat-label">Upcoming Check-ins</span></div>
  `;

  tbody.innerHTML = rows.length
    ? rows.map((r) => `
      <tr>
        <td>${r.guest}</td>
        <td>${r.bookingId}</td>
        <td>Room ${r.room}</td>
        <td>${shortDate(r.checkIn)}</td>
        <td>${shortDate(r.checkOut)}</td>
        <td><span class="badge ${r.status === "current" ? "badge-current" : "badge-upcoming"}">${r.status === "current" ? "Staying now" : "Upcoming"}</span></td>
      </tr>
    `).join("")
    : `<tr><td colspan="6" style="text-align:center;color:#6B7A72;">No guests staying this week.</td></tr>`;
}

/* ---------- Rendering: Guest Directory ---------- */
async function renderGuestDirectory() {
  const tbody = document.querySelector("#guestDirectoryTable tbody");
  if (!tbody) return;
  const bookings = await getBookings();
  const guests = await getGuests();

  const rows = guests.map((g) => {
    const booking = bookings.find((b) => b.guests.includes(g.id));
    return {
      ...g,
      bookingId: booking ? booking.id : "\u2014",
      room: booking ? booking.rooms[0] : "\u2014",
      checkIn: booking ? shortDate(booking.checkIn) : "\u2014",
      checkOut: booking ? shortDate(booking.checkOut) : "\u2014",
    };
  });

  tbody.innerHTML = rows.map((g) => `
    <tr>
      <td>G-${String(g.id).padStart(3, "0")}</td>
      <td>${g.name}</td>
      <td>${g.contact}</td>
      <td>${g.bookingId}</td>
      <td>${g.room !== "\u2014" ? "Room " + g.room : "\u2014"}</td>
      <td>${g.checkIn} &rarr; ${g.checkOut}</td>
    </tr>
  `).join("");
}

/* ---------- Rendering: Customers ---------- */
async function renderCustomers() {
  const tbody = document.querySelector("#customerTable tbody");
  if (!tbody) return;
  const customers = await getCustomers();
  const bookings = await getBookings();

  tbody.innerHTML = customers.map((c) => {
    const count = bookings.filter((b) => b.customerId === c.id).length;
    return `
      <tr>
        <td>C-${String(c.id).padStart(3, "0")}</td>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td>${count}</td>
        <td class="row-actions">
          <button class="btn-view-customer" data-id="${c.id}">View</button>
          <button class="btn-edit-customer" data-id="${c.id}">Edit</button>
        </td>
      </tr>
    `;
  }).join("");
}

/* ---------- Rendering: Payments ---------- */
async function renderPayments() {
  const tbody = document.querySelector("#paymentTable tbody");
  if (!tbody) return;
  const payments = await getPayments();

  const badgeClass = {
    Paid: "badge-paid", Pending: "badge-pending", Partial: "badge-partial", Refunded: "badge-refunded",
  };

  tbody.innerHTML = payments.map((p) => `
    <tr>
      <td>${p.id}</td>
      <td>${p.bookingId}</td>
      <td>${customerName(p.customerId)}</td>
      <td>${formatPHP(p.amount)}</td>
      <td>${shortDate(p.date)}</td>
      <td>${p.method}</td>
      <td><span class="badge ${badgeClass[p.status]}">${p.status}</span></td>
    </tr>
  `).join("");
}

/* ---------- Rendering: Admin Dashboard ---------- */
async function renderDashboard() {
  const cardsEl = document.getElementById("dashCards");
  const recentEl = document.getElementById("dashRecentBookings");
  const checkinsEl = document.getElementById("dashCheckins");
  const checkoutsEl = document.getElementById("dashCheckouts");
  const fillEl = document.getElementById("occupancyFill");
  const legendEl = document.getElementById("occupancyLegend");
  if (!cardsEl) return;

  const rooms = await getRooms();
  const bookings = await getBookings();
  const today = new Date();
  const isSameDay = (a, b) => a.toDateString() === b.toDateString();

  const totalRooms = rooms.length;
  const availableNow = rooms.filter((r) => r.status === "available").length;
  const occupied = totalRooms - availableNow;
  const currentGuests = bookings.filter((b) => b.status === "current").reduce((sum, b) => sum + b.guests.length, 0);
  const upcomingBookings = bookings.filter((b) => b.status === "future").length;

  cardsEl.innerHTML = `
    <div class="dash-card"><span class="dash-num">${totalRooms}</span><span class="dash-label">Total Rooms</span></div>
    <div class="dash-card"><span class="dash-num">${availableNow}</span><span class="dash-label">Available Now</span></div>
    <div class="dash-card"><span class="dash-num">${currentGuests}</span><span class="dash-label">Current Guests</span></div>
    <div class="dash-card"><span class="dash-num">${upcomingBookings}</span><span class="dash-label">Upcoming Bookings</span></div>
  `;

  const recent = [...bookings].sort((a, b) => b.bookingDate - a.bookingDate).slice(0, 4);
  recentEl.innerHTML = recent.map((b) => `
    <div class="dash-item"><span>${b.id} &middot; ${customerName(b.customerId)}</span><span>${formatPHP(b.totalPrice)}</span></div>
  `).join("");

  const checkinsToday = bookings.filter((b) => isSameDay(b.checkIn, today));
  checkinsEl.innerHTML = checkinsToday.length
    ? checkinsToday.map((b) => `<div class="dash-item"><span>${b.guests.map(guestName).join(", ")}</span><span>Room ${b.rooms.join(", ")}</span></div>`).join("")
    : `<div class="dash-item"><span>No check-ins today</span></div>`;

  const checkoutsToday = bookings.filter((b) => isSameDay(b.checkOut, today));
  checkoutsEl.innerHTML = checkoutsToday.length
    ? checkoutsToday.map((b) => `<div class="dash-item"><span>${b.guests.map(guestName).join(", ")}</span><span>Room ${b.rooms.join(", ")}</span></div>`).join("")
    : `<div class="dash-item"><span>No check-outs today</span></div>`;

  const pct = Math.round((occupied / totalRooms) * 100);
  fillEl.style.width = pct + "%";
  legendEl.textContent = `Occupied: ${occupied}  \u00B7  Available: ${availableNow}  \u00B7  Total: ${totalRooms}`;
}
