/* =========================================================
   RECOMMENDATIONS.JS
   Compares guest preferences against mock room data and
   returns ranked matches with a match percentage.
   ========================================================= */

/**
 * @param {Object} prefs
 * @param {number} prefs.guests       - number of guests needed
 * @param {number} prefs.budget       - max nightly budget (PHP)
 * @param {string} prefs.roomType     - "Any" or a room type family, e.g. "Deluxe"
 * @param {number[]} prefs.facilityIds - preferred facility ids
 */
async function recommendRooms(prefs) {
  const rooms = await getRooms();
  const scored = [];

  for (const room of rooms) {
    if (room.status !== "available") continue;

    const type = roomTypeOf(room);
    const reasons = [];
    let points = 0;
    let maxPoints = 0;

    // Guest capacity — hard requirement, but weighted too
    maxPoints += 35;
    if (room.maxGuests >= prefs.guests) {
      points += 35;
      reasons.push(`Fits ${prefs.guests} guest${prefs.guests > 1 ? "s" : ""}`);
    } else {
      continue; // capacity is a hard filter
    }

    // Budget
    maxPoints += 30;
    if (room.basePrice <= prefs.budget) {
      points += 30;
      reasons.push("Within your budget");
    } else {
      const overBy = room.basePrice - prefs.budget;
      // partial credit if only slightly over budget
      if (overBy <= prefs.budget * 0.1) {
        points += 12;
        reasons.push("Slightly above budget");
      }
    }

    // Room type
    maxPoints += 15;
    if (prefs.roomType === "Any" || type.name.startsWith(prefs.roomType)) {
      points += 15;
      if (prefs.roomType !== "Any") reasons.push(`${prefs.roomType} room type`);
    }

    // Facilities
    maxPoints += 20;
    if (prefs.facilityIds.length) {
      const matchedFacilities = prefs.facilityIds.filter((id) => room.facilityIds.includes(id));
      const facilityScore = (matchedFacilities.length / prefs.facilityIds.length) * 20;
      points += facilityScore;
      matchedFacilities.forEach((id) => {
        const name = mockFacilities.find((f) => f.id === id)?.name;
        if (name) reasons.push(name);
      });
    } else {
      points += 20; // no facility preference stated
    }

    const matchPercent = Math.round((points / maxPoints) * 100);
    scored.push({ room, type, matchPercent, reasons });
  }

  return scored.sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 5);
}

function matchCardHTML(entry) {
  const { room, type, matchPercent, reasons } = entry;
  return `
    <article class="match-card">
      <div class="match-media" style="background-image:url('${room.image}')"></div>
      <div class="match-body">
        <div class="match-top">
          <div>
            <p class="card-room-no">Room ${room.number}</p>
            <h3 class="card-title" style="font-size:1.1rem;">${type.name}</h3>
            <p class="card-price" style="margin-top:.2rem;">${formatPHP(room.basePrice)}<span> /night</span></p>
          </div>
          <span class="match-score">Match: ${matchPercent}%</span>
        </div>
        <ul class="match-reasons">${reasons.map((r) => `<li>${r}</li>`).join("")}</ul>
        <div class="match-actions">
          <button class="btn btn-ghost btn-view-room" data-room-id="${room.id}">View Room</button>
          <button class="btn btn-primary btn-book-room" data-room-id="${room.id}">Book Now</button>
        </div>
      </div>
    </article>
  `;
}

async function renderRecommendationChecks() {
  const container = document.getElementById("recFacilityChecks");
  if (!container) return;
  const facilities = await getFacilities();
  // Only show the facilities mentioned in the brief's preference list
  const preferredSubset = ["Wi-Fi", "Air Conditioning", "Smart TV", "Mini-bar", "Bathtub", "Balcony", "Refrigerator", "Workspace"];
  const list = facilities.filter((f) => preferredSubset.includes(f.name));

  container.innerHTML = list.map((f) => `
    <label>
      <input type="checkbox" name="recFacility" value="${f.id}">
      ${f.name}
    </label>
  `).join("");
}

async function handleRecommendSubmit(e) {
  e.preventDefault();
  const guests = Number(document.getElementById("recGuests").value.replace("+", ""));
  const budget = Number(document.getElementById("recBudget").value);
  const roomType = document.getElementById("recType").value;
  const facilityIds = Array.from(document.querySelectorAll('input[name="recFacility"]:checked')).map((el) => Number(el.value));

  const results = await recommendRooms({ guests, budget, roomType, facilityIds });
  const resultsEl = document.getElementById("recommendResults");

  if (!results.length) {
    resultsEl.innerHTML = `<p class="recommend-placeholder">No available rooms match those preferences yet. Try widening your budget or facilities.</p>`;
    return;
  }

  resultsEl.innerHTML = `<p class="section-lead" style="margin-bottom:0;">Recommended for You</p>` + results.map(matchCardHTML).join("");
}
