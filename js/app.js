/* =========================================================
   APP.JS
   Navigation, hero slideshow, toasts, modals, availability
   search, filters/tabs, and app initialisation.
   ========================================================= */

/* ---------- Toasts ---------- */
function showToast(message, type = "success") {
  const stack = document.getElementById("toastStack");
  if (!stack) return;
  const toast = document.createElement("div");
  toast.className = "toast" + (type === "error" ? " toast-error" : "");
  toast.textContent = message;
  stack.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = "opacity .3s ease";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Scroll-spy active nav link ---------- */
function initScrollSpy() {
  const sections = document.querySelectorAll("main > section[id], .intro[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ---------- Hero slideshow ---------- */
function initSlideshow() {
  const slidesEl = document.getElementById("slides");
  if (!slidesEl) return;
  const slides = Array.from(slidesEl.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("slideDots");
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");
  let current = 0;
  let timer;

  dotsWrap.innerHTML = slides.map((_, i) => `<button class="slide-dot${i === 0 ? " is-active" : ""}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`).join("");
  const dots = Array.from(dotsWrap.querySelectorAll(".slide-dot"));

  function goTo(index) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() { timer = setInterval(next, 5500); }
  function stopTimer() { clearInterval(timer); }

  nextBtn.addEventListener("click", () => { next(); stopTimer(); startTimer(); });
  prevBtn.addEventListener("click", () => { prev(); stopTimer(); startTimer(); });
  dots.forEach((dot) => dot.addEventListener("click", () => { goTo(Number(dot.dataset.index)); stopTimer(); startTimer(); }));

  const slideshowEl = document.getElementById("slideshow");
  slideshowEl.addEventListener("mouseenter", stopTimer);
  slideshowEl.addEventListener("mouseleave", startTimer);

  startTimer();
}

/* ---------- Modals ---------- */
function openModal(backdropId) { document.getElementById(backdropId).classList.add("is-open"); }
function closeModal(backdropId) { document.getElementById(backdropId).classList.remove("is-open"); }

function initModals() {
  document.querySelectorAll("[data-close-modal]").forEach((btn) => btn.addEventListener("click", () => closeModal("modalBackdrop")));
  document.querySelectorAll("[data-close-booking-modal]").forEach((btn) => btn.addEventListener("click", () => closeModal("bookingModalBackdrop")));
  document.querySelectorAll("[data-close-customer-modal]").forEach((btn) => btn.addEventListener("click", () => closeModal("customerModalBackdrop")));

  [["modalBackdrop"], ["bookingModalBackdrop"], ["customerModalBackdrop"]].forEach(([id]) => {
    document.getElementById(id).addEventListener("click", (e) => {
      if (e.target.id === id) closeModal(id);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal("modalBackdrop");
      closeModal("bookingModalBackdrop");
      closeModal("customerModalBackdrop");
    }
  });
}

/* Delegate room view / book buttons anywhere in the document */
function initRoomActionDelegation() {
  document.addEventListener("click", async (e) => {
    const viewBtn = e.target.closest(".btn-view-room");
    if (viewBtn) {
      const roomId = viewBtn.dataset.roomId;
      document.getElementById("roomDetailContent").innerHTML = await getRoomDetailHTML(roomId);
      openModal("modalBackdrop");
      return;
    }

    const bookBtn = e.target.closest(".btn-book-room");
    if (bookBtn) {
      if (bookBtn.hasAttribute("disabled")) return;
      document.getElementById("bookRoomId").value = bookBtn.dataset.roomId;
      closeModal("modalBackdrop");
      openModal("bookingModalBackdrop");
      return;
    }

    const typeBtn = e.target.closest(".btn-view-type");
    if (typeBtn) {
      const typeName = typeBtn.dataset.type;
      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.toggle("active", c.dataset.filter === typeName));
      renderRooms(typeName);
      document.getElementById("rooms").scrollIntoView({ behavior: "smooth" });
    }
  });
}

/* ---------- Booking form ---------- */
function initBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("bookName").value.trim();
    const email = document.getElementById("bookEmail").value.trim();
    const checkIn = document.getElementById("bookCheckIn").value;
    const checkOut = document.getElementById("bookCheckOut").value;

    if (!name || !email || !checkIn || !checkOut) {
      showToast("Please fill in every field before confirming.", "error");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      showToast("Check-out must be after check-in.", "error");
      return;
    }

    // Later: POST to /api/bookings with { roomId, name, email, checkIn, checkOut, guests }
    closeModal("bookingModalBackdrop");
    form.reset();
    showToast(`Booking request received for ${name}. Our team will confirm shortly.`);
  });
}

/* ---------- Customer form ---------- */
function initCustomerForm() {
  const addBtn = document.getElementById("addCustomerBtn");
  const form = document.getElementById("customerForm");
  if (addBtn) addBtn.addEventListener("click", () => openModal("customerModalBackdrop"));

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("custName").value.trim();
      const email = document.getElementById("custEmail").value.trim();
      const phone = document.getElementById("custPhone").value.trim();
      if (!name || !email || !phone) {
        showToast("Please complete all customer details.", "error");
        return;
      }

      // Later: POST to /api/customers
      const newId = Math.max(...mockCustomers.map((c) => c.id)) + 1;
      mockCustomers.push({ id: newId, name, email, phone });
      renderCustomers();
      closeModal("customerModalBackdrop");
      form.reset();
      showToast(`${name} added to Customers.`);
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest(".btn-view-customer")) {
      const id = Number(e.target.closest(".btn-view-customer").dataset.id);
      const c = mockCustomers.find((x) => x.id === id);
      showToast(`${c.name} \u00B7 ${c.email} \u00B7 ${c.phone}`);
    }
    if (e.target.closest(".btn-edit-customer")) {
      showToast("Editing customers will be available once the backend is connected.");
    }
  });
}

/* ---------- Availability search ---------- */
function initAvailabilityForm() {
  const form = document.getElementById("availabilityForm");
  const resultsEl = document.getElementById("availabilityResults");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const guestCount = Number(document.getElementById("guestCount").value.replace("+", ""));

    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      showToast("Check-out must be after check-in.", "error");
      return;
    }

    const rooms = await getRooms();
    const suitable = rooms.filter((r) => r.maxGuests >= guestCount);
    const available = suitable.filter((r) => r.status === "available");

    resultsEl.innerHTML = `
      <p class="availability-summary"><strong>${available.length}</strong> of ${suitable.length} matching rooms available for ${guestCount} guest${guestCount > 1 ? "s" : ""}.</p>
      <div class="room-grid">${suitable.length ? suitable.map(roomCardHTML).join("") : `<div class="empty-state">No rooms fit that guest count yet.</div>`}</div>
    `;
    showToast("Availability updated.");
  });
}

/* ---------- Room filter chips ---------- */
function initRoomFilters() {
  const bar = document.getElementById("roomFilterBar");
  if (!bar) return;
  bar.addEventListener("click", (e) => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;
    bar.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    renderRooms(chip.dataset.filter);
  });
}

/* ---------- Booking tabs ---------- */
function initBookingTabs() {
  const bar = document.getElementById("bookingTabs");
  if (!bar) return;
  bar.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab) return;
    bar.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    renderBookings(tab.dataset.tab);
  });
}

/* ---------- Recommendation form ---------- */
function initRecommendForm() {
  const form = document.getElementById("recommendForm");
  if (form) form.addEventListener("submit", handleRecommendSubmit);
}

/* ---------- Default date inputs ---------- */
function setDefaultDates() {
  const today = new Date();
  const inThree = new Date(); inThree.setDate(today.getDate() + 3);
  const inSix = new Date(); inSix.setDate(today.getDate() + 6);
  const iso = (d) => d.toISOString().split("T")[0];

  const ci = document.getElementById("checkIn");
  const co = document.getElementById("checkOut");
  if (ci) ci.value = iso(inThree);
  if (co) co.value = iso(inSix);
  if (ci) ci.min = iso(today);
  if (co) co.min = iso(inThree);

  const bci = document.getElementById("bookCheckIn");
  const bco = document.getElementById("bookCheckOut");
  if (bci) bci.value = iso(inThree);
  if (bco) bco.value = iso(inSix);
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollSpy();
  initSlideshow();
  initModals();
  initRoomActionDelegation();
  initBookingForm();
  initCustomerForm();
  initAvailabilityForm();
  initRoomFilters();
  initBookingTabs();
  initRecommendForm();
  setDefaultDates();

  renderRooms();
  renderRoomTypes();
  renderFacilities();
  renderFacilityLookup();
  renderRecommendationChecks();
  renderBookings("future");
  renderWeekGuests();
  renderGuestDirectory();
  renderCustomers();
  renderPayments();
  renderDashboard();
});
