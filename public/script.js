
let allJobs = [];
let currentView = "all";
const jobsContainer = document.getElementById("jobs");

/* LOADER */
function showLoader() {
  jobsContainer.innerHTML = `<div class="loader">Loading jobs...</div>`;
}

/* FORMAT DATE */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* LOAD JOBS */
const API = "https://job-portal-1-r80m.onrender.com";
async function loadJobs() {
  try {
    showLoader();
    const response = await fetch(API + "/jobs");
    const data = await response.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Remove expired jobs automatically
    allJobs = data.filter((job) => {
      const lastDate = new Date(job.last_date);
      lastDate.setHours(0, 0, 0, 0);
      return lastDate >= today;
    });

    render(allJobs);
  } catch (error) {
    jobsContainer.innerHTML =
      "<div class='loader'>Failed to load jobs</div>";
  }
}

/* RENDER JOBS */
function render(list) {
  jobsContainer.innerHTML = "";

  if (!list || list.length === 0) {
    jobsContainer.innerHTML =
      "<div class='loader'>No jobs available</div>";
    return;
  }

  const savedJobs =
    JSON.parse(localStorage.getItem("savedJobs")) || [];

  list.forEach((j) => {
    const isSaved = savedJobs.includes(j.id);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${j.title}</h3>
      <p><b>${j.company}</b> • ${j.location}</p>
      <div class="salary-tag">${j.salary || "Not Disclosed"}</div>
      <p><b>Apply Before:</b> ${formatDate(j.last_date)}</p>

      <div style="margin-top:15px;display:flex;gap:10px;flex-wrap:wrap;">
        
        <a href="${j.apply_link || '#'}" target="_blank">
          <button class="btn-job">Apply ╰┈➤</button>
        </a>

        <button class="btn-job" onclick="saveJob(${j.id})">
          ${isSaved ? "Saved ⛊" : "Save ⛉"}
        </button>

      </div>
    `;

    jobsContainer.appendChild(card);
  });
}

/* SAVE JOB */
function saveJob(id) {
  let savedJobs =
    JSON.parse(localStorage.getItem("savedJobs")) || [];

  if (savedJobs.includes(id)) {
    savedJobs = savedJobs.filter((j) => j !== id);
  } else {
    savedJobs.push(id);
  }

  localStorage.setItem("savedJobs", JSON.stringify(savedJobs));

  if (currentView === "saved") {
    showSavedJobs();
  } else {
    render(allJobs);
  }
}

/* SHOW ALL JOBS */
function showAllJobs() {
  currentView = "all";
  render(allJobs);
}

/* SHOW SAVED JOBS */
function showSavedJobs() {
  currentView = "saved";

  const savedJobs =
    JSON.parse(localStorage.getItem("savedJobs")) || [];

  const filtered = allJobs.filter((job) =>
    savedJobs.includes(job.id)
  );

  render(filtered);
}

/* FILTERS */
function applyFilters() {
  const titleValue = document.getElementById("search").value.toLowerCase().trim();
  const locationValue = document.getElementById("locationFilter").value.toLowerCase().trim();

  const filtered = allJobs.filter(job => {
    const titleMatch =
      job.title.toLowerCase().includes(titleValue) ||
      job.company.toLowerCase().includes(titleValue);

    const locationMatch =
      locationValue === "" ||
      job.location.toLowerCase().includes(locationValue);

    return titleMatch && locationMatch;
  });

  render(filtered);
}

/* RESET FILTERS */
function resetFilters() {
  document.getElementById("search").value = "";
  document.getElementById("locationFilter").value = "";
  render(allJobs);
}

/* LIVE SEARCH */
document
  .getElementById("search")
  .addEventListener("input", applyFilters);

/* INITIAL LOAD */
loadJobs();