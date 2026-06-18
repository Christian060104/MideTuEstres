
// Global Variables
let currentUser = null;
let stressMeasurements = [];

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  // Load user data from localStorage
  loadUserData();
   if (currentUser) {
  loadWellnessData();
  actualizarResumenActual();
   }
  // Check authentication and show appropriate screen
  checkAuthenticationStatus();

  // Setup event listeners
  setupEventListeners();

  // Update UI based on authentication state
  updateAuthUI();

  // Load stress measurements (only if authenticated)
  if (currentUser) {
    loadStressMeasurements();
    // Initialize chart
    initializeChart();
  }
}

// Event Listeners Setup
function setupEventListeners() {
  // Navigation smooth scrolling with authentication check
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Check if user is authenticated
      if (!currentUser) {
        showMessage(
          "error",
          "Debes registrarte o iniciar sesión para acceder a esta sección",
        );
        showRegisterModal();
        return;
      }

      const targetId = this.getAttribute("href").substring(1);
      scrollToSection(targetId);
    });
  });

  // Login form
  document.getElementById("loginForm").addEventListener("submit", handleLogin);

  // Register form
  document
    .getElementById("registerForm")
    .addEventListener("submit", handleRegister);

  // Stress measurement form
  document
    .getElementById("stressForm")
    .addEventListener("submit", handleStressMeasurement);

  // Close modals when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target.classList.contains("modal")) {
      closeModal(event.target.id);
    }
  });
}

// Authentication Functions
// ===============================
// AUTHENTICATION FUNCTIONS
// ===============================

// Abrir modal login
function showLoginModal() {
  const modal = document.getElementById("loginModal");

  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

// Abrir modal registro
function showRegisterModal() {
  const modal = document.getElementById("registerModal");

  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

// Compatibilidad con botones de bienvenida
function showLogin() {
  showLoginModal();
}

function showRegister() {
  showRegisterModal();
}

// Cerrar modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);

  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// Cambiar login -> registro
function switchToRegister() {
  closeModal("loginModal");
  showRegisterModal();
}

// Cambiar registro -> login
function switchToLogin() {
  closeModal("registerModal");
  showLoginModal();
}
async function handleLogin(e) {
  e.preventDefault();


  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email.endsWith("@tehuacan.tecnm.mx")) {
    showMessage("error", "Debe usar un correo institucional");
    return;
  }

  try {
    const response = await fetch("/api/auth.php?action=login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();

    if (result.success) {
      currentUser = result.user;
      loadWellnessData();
      updateWellnessUI();
      resetStressFormUI();
actualizarResumenActual();
      document.getElementById("measurementForm").style.display = "block";
document.getElementById("resultContainer").style.display = "none";
actualizarResumenActual();

      localStorage.setItem("currentUser", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);

      updateAuthUI();

      closeModal("loginModal");

      showMessage("success", result.message);

      loadStressMeasurements();

      initializeChart();

      document.getElementById("loginForm").reset();
    } else {
      showMessage("error", result.message);
    }
  } catch (error) {
    console.error(error);

    showMessage("error", "Error al conectar con el servidor");
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById("regName").value,
    email: document.getElementById("regEmail").value,
    matricula: document.getElementById("regMatricula").value,
    carrera: document.getElementById("regCarrera").value,
    semestre: document.getElementById("regSemestre").value,
    password: document.getElementById("regPassword").value,
    confirmPassword: document.getElementById("regConfirmPassword").value,
  };

  if (!formData.email.endsWith("@tehuacan.tecnm.mx")) {
    showMessage("error", "Debe usar un correo institucional");
    return;
  }

  if (formData.password.length < 8) {
    showMessage("error", "La contraseña debe tener al menos 8 caracteres");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    showMessage("error", "Las contraseñas no coinciden");
    return;
  }

  try {
    const response = await fetch("/api/auth.php?action=register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      showMessage("success", result.message);

      closeModal("registerModal");

      document.getElementById("registerForm").reset();

      showLoginModal();
    } else {
      showMessage("error", result.message);
    }
  } catch (error) {
    console.error(error);

    showMessage("error", "Error al registrar usuario");
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateAuthUI();
  showMessage("success", "Sesión cerrada correctamente");
resetStressFormUI();
  // Clear user-specific data
  stressMeasurements = [];
  document.getElementById("totalMeasurements").textContent = "0";
  document.getElementById("averageScore").textContent = "0";
  document.getElementById("improvement").textContent = "0%";
  document.getElementById("measurementForm").style.display = "block";
document.getElementById("resultContainer").style.display = "none";

document.getElementById("scoreValue").textContent = "0";
document.getElementById("levelTitle").textContent = "";
document.getElementById("levelDescription").textContent = "";
document.getElementById("aiAnalysis").textContent = "";
  initializeChart();
}

function updateAuthUI() {
  const loginBtn = document.getElementById("loginBtn");
  const welcomeScreen = document.getElementById("welcomeScreen");
  const mainContent = document.getElementById("mainContent");
  const mainNav = document.getElementById("mainNav");

  if (currentUser) {
    // Show main content, hide welcome screen
    if (welcomeScreen) welcomeScreen.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
    if (mainNav) mainNav.style.display = "flex";

    // Update login button
    if (loginBtn) {
      loginBtn.textContent = `Hola, ${currentUser.name.split(" ")[0]}`;
      loginBtn.onclick = logout;
    }
  } else {
    // Show welcome screen, hide main content
    if (welcomeScreen) welcomeScreen.style.display = "flex";
    if (mainContent) mainContent.style.display = "none";
    if (mainNav) mainNav.style.display = "none";

    // Update login button
    if (loginBtn) {
      loginBtn.textContent = "Iniciar Sesión";
      loginBtn.onclick = showLoginModal;
    }
  }
}

// New function to check authentication status
function checkAuthenticationStatus() {
  const welcomeScreen = document.getElementById("welcomeScreen");
  const mainContent = document.getElementById("mainContent");

  if (currentUser) {
    // User is authenticated, show main content
    if (welcomeScreen) welcomeScreen.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
  } else {
    // User is not authenticated, show welcome screen
    if (welcomeScreen) welcomeScreen.style.display = "flex";
    if (mainContent) mainContent.style.display = "none";
  }
}

// Stress Measurement Functions
async function handleStressMeasurement(e) {
  e.preventDefault();

  if (!currentUser) {
    showMessage("error", "Debes iniciar sesión");
    return;
  }

  const formData = new FormData(e.target);

  const data = {
    q1: formData.get("q1"),
    q2: formData.get("q2"),
    q3: formData.get("q3"),
    q4: formData.get("q4"),
    q5: formData.get("q5"),
  };

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("/api/measurements.php?action=create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      showStressResults(result.score);

      showMessage("success", result.message);

      loadStressMeasurements();
    } else {
      showMessage("error", result.message);
    }
  } catch (error) {
    console.error(error);

    showMessage("error", "Error al guardar medición");
  }
}
function showStressResults(score) {
  // Hide form, show results
  document.getElementById("measurementForm").style.display = "none";
  document.getElementById("resultContainer").style.display = "block";
  // Calculate score percentage
  const maxScore = 20; // 5 questions * 4 points max
  const percentage = (score / maxScore) * 100;
  // Update score display
  document.getElementById("scoreValue").textContent = score;
  // Determine stress level and recommendations
  let level, description, recommendations;
  if (score <= 8) {
    level = "Nivel de Estrés Bajo";
    description = "Tienes un buen manejo del estrés académico. Sigue así!";
    recommendations = [
      "Mantén tus hábitos saludables",
      "Continúa con tus técnicas de relajación",
      "Comparte tus estrategias con compañeros",
      "Sigue monitoreando tu bienestar regularmente",
    ];
  } else if (score <= 14) {
    level = "Nivel de Estrés Moderado";
    description = "Estás experimentando algo de estrés, pero es manejable.";
    recommendations = [
      "Practica técnicas de respiración profunda",
      "Establece horarios regulares de estudio",
      "Haz pausas activas cada 30 minutos",
      "Habla con amigos o familiares sobre tus preocupaciones",
      "Considera actividades físicas ligeras",
    ];
  } else {
    level = "Nivel de Estrés Alto";
    description = "Tu nivel de estrés es elevado. Es importante tomar acción.";
    recommendations = [
      "Busca apoyo del departamento de bienestar estudiantil",
      "Practica meditación diaria (10-15 minutos)",
      "Revisa y ajusta tu carga académica si es posible",
      "Establece límites claros entre estudio y descanso",
      "Considera hablar con un consejero profesional",
      "Prioriza el sueño y la alimentación saludable",
    ];
  }

  // Update UI
  document.getElementById("levelTitle").textContent = level;
  document.getElementById("levelDescription").textContent = description;
  let aiAnalysis = "";

  if (score <= 8) {
    aiAnalysis =
      "Tus respuestas muestran un nivel bajo de estrés. Mantienes un equilibrio saludable entre tus actividades académicas y tu bienestar emocional.";
  } else if (score <= 14) {
    aiAnalysis =
      "Se detectan señales moderadas de estrés académico. Conviene prestar atención a la organización del tiempo, el descanso y las pausas activas.";
  } else {
    aiAnalysis =
      "Se observa un nivel elevado de estrés. Es recomendable aplicar estrategias de manejo emocional y buscar apoyo si esta situación continúa.";
  }

  document.getElementById("aiAnalysis").textContent = aiAnalysis;

  // Update recommendations
  const recommendationsList = document.getElementById("recommendationsList");
  recommendationsList.innerHTML = "";
  recommendations.forEach((rec) => {
    const li = document.createElement("li");
    li.textContent = rec;
    recommendationsList.appendChild(li);
  });

  // Update score circle color based on level
  const scoreCircle = document.querySelector(".score-circle");
  if (score <= 8) {
    scoreCircle.style.background =
      "linear-gradient(135deg, #28a745 0%, #20c997 100%)";
  } else if (score <= 14) {
    scoreCircle.style.background =
      "linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)";
  } else {
    scoreCircle.style.background =
      "linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)";
  }
  const historialKey = `historialEstres_${getCurrentUserKey()}`;

const historial =
  JSON.parse(localStorage.getItem(historialKey)) || [];

historial.push({
  nivel: level,
  fecha: new Date().toLocaleDateString("es-MX"),
  puntaje: score
});

localStorage.setItem(
  historialKey,
  JSON.stringify(historial)
);

actualizarResumenActual();
}

function resetMeasurement() {
  // Reset form
  document.getElementById("stressForm").reset();

  // Show form, hide results
  document.getElementById("measurementForm").style.display = "block";
  document.getElementById("resultContainer").style.display = "none";

  // Scroll to measurement section
  scrollToSection("medicion");
}

// Tracking Functions
async function loadStressMeasurements() {
  if (!currentUser) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("/api/measurements.php?action=list", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const result = await response.json();

    if (result.success) {
      stressMeasurements = result.measurements;

      updateTrackingStats(stressMeasurements);
    } else {
      showMessage("error", result.message);
    }
  } catch (error) {
    console.error(error);

    showMessage("error", "Error al cargar mediciones");
  }
}

function updateTrackingStats(userMeasurements = null) {
  const measurements =
    userMeasurements ||
    stressMeasurements.filter((m) => m.userId === currentUser.id);

  // Analizar tendencia de estrés
  const trendElement = document.getElementById("stressTrend");

  if (trendElement) {
    if (measurements.length < 2) {
      trendElement.textContent =
        "Necesitas al menos 2 mediciones para analizar una tendencia.";
    } else {
      const recentMeasurements = measurements.slice(0, 3);

      const latestScore = recentMeasurements[0].score;
      const oldestScore =
        recentMeasurements[recentMeasurements.length - 1].score;

      if (latestScore < oldestScore) {
        trendElement.textContent =
          "📈 Mejorando: tus niveles de estrés han disminuido en las últimas mediciones.";
      } else if (latestScore > oldestScore) {
        trendElement.textContent =
          "📉 Empeorando: tus niveles de estrés han aumentado recientemente.";
      } else {
        trendElement.textContent =
          "➖ Estable: tus niveles de estrés se mantienen constantes.";
      }
    }
  }

  console.log("Measurements:", measurements);

  if (measurements.length === 0) {
    document.getElementById("totalMeasurements").textContent = "0";
    document.getElementById("averageScore").textContent = "0";
    document.getElementById("improvement").textContent = "0%";
    return;
  }

  // Total measurements
  document.getElementById("totalMeasurements").textContent =
    measurements.length;

  // Average score
  const avgScore =
    measurements.reduce((sum, m) => sum + m.score, 0) / measurements.length;
  document.getElementById("averageScore").textContent = avgScore.toFixed(1);

  // Improvement (compare first vs last measurements)
  if (measurements.length >= 2) {
    const firstScore = measurements[0].score;
    const lastScore = measurements[measurements.length - 1].score;
    const improvement = ((firstScore - lastScore) / firstScore) * 100;
    document.getElementById("improvement").textContent =
      improvement.toFixed(1) + "%";
  } else {
    document.getElementById("improvement").textContent = "N/A";
  }

  // Update chart
  updateChart(measurements);
}

let stressChart = null;

function initializeChart() {
  const chartContainer = document.querySelector(".chart-container");

  chartContainer.innerHTML = `
      <canvas id="stressChart" height="250"></canvas>
  `;
}

function updateChart(measurements) {
  const chartContainer = document.querySelector(".chart-container");

  if (measurements.length === 0) {
    initializeChart();
    return;
  }

  chartContainer.innerHTML = `
      <canvas id="stressChart" height="250"></canvas>
  `;

  const labels = measurements.map((m) =>
    new Date(m.measurement_date).toLocaleDateString("es-MX"),
  );

  const scores = measurements.map((m) => m.score);

  const ctx = document.getElementById("stressChart").getContext("2d");

  if (stressChart) {
    stressChart.destroy();
  }

  stressChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Nivel de Estrés",
          data: scores,
          borderColor: "#667eea",
          backgroundColor: "rgba(102,126,234,0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Historial de Estrés",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 20,
        },
      },
    },
  });
}

// Resource Functions
function playVideo(videoType) {
  const videos = {
    relajacion: "https://www.youtube.com/embed/tYwnSBkc_To",
    tiempo: "https://www.youtube.com/embed/Ctd3gH4O4Bc",
    motivacion: "https://www.youtube.com/embed/_zmDAFZV6fk"
  };

  if (videos[videoType]) {
    openVideoModal(videos[videoType]);
  }
}

function openVideoModal(videoUrl) {
  document.getElementById("videoModal").style.display = "flex";
  document.getElementById("videoFrame").src = videoUrl;
}

function closeVideoModal() {
  document.getElementById("videoModal").style.display = "none";
  document.getElementById("videoFrame").src = "";
}
// Utility Functions
function scrollToSection(sectionId) {
  // Check authentication before allowing navigation
  if (!currentUser && sectionId !== "inicio") {
    showMessage("error", "Debes registrarte para acceder a esta sección");
    showRegisterModal();
    return;
  }

  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

function showMessage(type, message) {
  // Create message element
  const messageDiv = document.createElement("div");
  messageDiv.className = `${type}-message`;
  messageDiv.textContent = message;

  // Add to page
  document.body.appendChild(messageDiv);

  // Position at top
  messageDiv.style.position = "fixed";
  messageDiv.style.top = "20px";
  messageDiv.style.left = "50%";
  messageDiv.style.transform = "translateX(-50%)";
  messageDiv.style.zIndex = "3000";
  messageDiv.style.maxWidth = "400px";
  messageDiv.style.textAlign = "center";
  messageDiv.style.padding = "1rem 1.5rem";
  messageDiv.style.borderRadius = "8px";
  messageDiv.style.fontWeight = "500";
  messageDiv.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";

  // Set colors based on type
  if (type === "success") {
    messageDiv.style.background = "#d4edda";
    messageDiv.style.color = "#155724";
    messageDiv.style.border = "1px solid #c3e6cb";
  } else if (type === "error") {
    messageDiv.style.background = "#f8d7da";
    messageDiv.style.color = "#721c24";
    messageDiv.style.border = "1px solid #f5c6cb";
  } else if (type === "info") {
    messageDiv.style.background = "#d1ecf1";
    messageDiv.style.color = "#0c5460";
    messageDiv.style.border = "1px solid #bee5eb";
  }

  // Auto remove after 4 seconds
  setTimeout(() => {
    messageDiv.style.opacity = "0";
    messageDiv.style.transition = "opacity 0.3s ease";
    setTimeout(() => {
      messageDiv.remove();
    }, 300);
  }, 4000);
}

function loadUserData() {
  const userData = localStorage.getItem("currentUser");
  if (userData) {
    currentUser = JSON.parse(userData);
  }
}

// Data Management Functions
function exportUserData() {
  if (!currentUser) {
    showMessage("error", "Debes iniciar sesión para exportar datos");
    return;
  }

  const userMeasurements = stressMeasurements.filter(
    (m) => m.userId === currentUser.id,
  );
  const exportData = {
    user: {
      name: currentUser.name,
      email: currentUser.email,
      matricula: currentUser.matricula,
      carrera: currentUser.carrera,
      semestre: currentUser.semestre,
    },
    measurements: userMeasurements,
    exportDate: new Date().toISOString(),
  };

  // Create and download file
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = `stress_data_${currentUser.matricula}_${new Date().toISOString().split("T")[0]}.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();

  showMessage("success", "Datos exportados correctamente");
}

function clearUserData() {
  if (!currentUser) {
    showMessage("error", "Debes iniciar sesión para eliminar datos");
    return;
  }

  if (
    confirm(
      "¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.",
    )
  ) {
    // Remove user measurements
    stressMeasurements = stressMeasurements.filter(
      (m) => m.userId !== currentUser.id,
    );
    /*
    localStorage.setItem(
      "stressMeasurements",
      JSON.stringify(stressMeasurements),
    );
*/
    // Logout
    logout();

    showMessage("success", "Todos tus datos han sido eliminados");
  }
}

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + E: Export data
  if ((e.ctrlKey || e.metaKey) && e.key === "e") {
    e.preventDefault();
    exportUserData();
  }

  // Escape: Close modals
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach((modal) => {
      if (modal.style.display === "block") {
        modal.style.display = "none";
      }
    });
  }
});

// Form validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateMatricula(matricula) {
  // Basic validation for Mexican student ID format
  const re = /^[0-9]{8,10}$/;
  return re.test(matricula);
}

// Performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const icon = button.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}
// Mobile-specific functions
function checkMobileView() {
  return window.innerWidth <= 768;
}

function optimizeForMobile() {
  if (checkMobileView()) {
    // Add mobile-specific optimizations
    document.body.classList.add("mobile-view");
  } else {
    document.body.classList.remove("mobile-view");
  }
}
// Mood selector
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".mood-btn");

  if (!btn) return;

  document.querySelectorAll(".mood-btn").forEach((b) => {
    b.classList.remove("active");
  });

  btn.classList.add("active");
});
// Carrusel ¿Sabías que?
let dykIndex = 0;

function updateDykCarousel() {
  const track = document.getElementById("dykTrack");
  const dots = document.querySelectorAll(".dyk-dot");

  if (!track) return;

  track.style.transform = `translateX(-${dykIndex * 100}%)`;

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === dykIndex);
  });
}

function moveDykSlide(direction) {
  const totalSlides = document.querySelectorAll(".dyk-card").length;

  dykIndex += direction;

  if (dykIndex < 0) {
    dykIndex = totalSlides - 1;
  }

  if (dykIndex >= totalSlides) {
    dykIndex = 0;
  }

  updateDykCarousel();
}

function goToDykSlide(index) {
  dykIndex = index;
  updateDykCarousel();
}

window.addEventListener("resize", debounce(optimizeForMobile, 250));

// Initialize mobile optimizations
optimizeForMobile();

// Generar PDF
async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const nivel = document.getElementById("levelTitle")?.textContent || "";
  if (nivel.includes("Bajo")) {
    doc.setFillColor(40, 167, 69);
  } else if (nivel.includes("Moderado")) {
    doc.setFillColor(255, 193, 7);
  } else {
    doc.setFillColor(220, 53, 69);
  }
  // Encabezado
  doc.rect(0, 0, 210, 25, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("MideTuEstrés", 20, 15);
  doc.setFontSize(12);
  doc.text("Reporte de Estrés Académico", 20, 22);
  // Información general
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-MX")}`, 20, 35);
  doc.text(`Usuario: ${currentUser?.name || "Estudiante"}`, 20, 45);
  doc.text(`Nivel actual: ${nivel}`, 20, 55);
  // Tendencia
  let trendText = document.getElementById("stressTrend")?.textContent || "";
  trendText = trendText
    .replace(/📈|📉|➡️/g, "")
    .replace(/[^\x20-\x7EáéíóúÁÉÍÓÚñÑüÜ]/g, "")
    .trim();
  const trendLines = doc.splitTextToSize(`Tendencia: ${trendText}`, 170);
  doc.text(trendLines, 20, 70);
  let currentY = 70 + trendLines.length * 7;
  // Análisis Inteligente
  const analysisText = document.getElementById("aiAnalysis")?.textContent || "";
  const analysisLines = doc.splitTextToSize(`Análisis: ${analysisText}`, 170);
  doc.text(analysisLines, 20, currentY);
  currentY += analysisLines.length * 7 + 10;
  // Estado actual
  doc.setFontSize(14);
  if (nivel.includes("Bajo")) {
    doc.setTextColor(40, 167, 69);
  } else if (nivel.includes("Moderado")) {
    doc.setTextColor(255, 140, 0);
  } else {
    doc.setTextColor(220, 53, 69);
  }
  doc.text(`Estado actual: ${nivel}`, 20, currentY);
  doc.setTextColor(0, 0, 0);
  currentY += 15;
  // Gráfica
  const chartCanvas = document.getElementById("stressChart");
  if (chartCanvas) {
    const chartImage = chartCanvas.toDataURL("image/png");
    doc.setFontSize(14);
    doc.text("Gráfica de Evolución del Estrés", 20, currentY);
    doc.addImage(chartImage, "PNG", 15, currentY + 10, 180, 80);
    currentY += 100;
  }
  // Historial
  let y = currentY;
  doc.setFontSize(12);
  doc.text("Historial de Mediciones:", 20, y);
  stressMeasurements.forEach((m, index) => {
    y += 10;
    if (y > 260) return;
    doc.text(`${index + 1}. ${m.measurement_date} - ${m.score} puntos`, 25, y);
  });
  doc.text(
    `Total de mediciones registradas: ${stressMeasurements.length}`,
    20,
    y + 15,
  );
  // Pie de página
  doc.setFontSize(10);
  doc.text("Generado automáticamente por MideTuEstrés", 20, 285);
  doc.text(new Date().toLocaleString("es-MX"), 145, 285);
  doc.save("Reporte_MideTuEstres.pdf");
}

// Activar botón PDF
document.addEventListener("click", (e) => {
  if (e.target.id === "downloadPdfBtn") {
    generatePDF();
  }
});

// ==========================
// MODO OSCURO / CLARO
// ==========================

const themeToggle = document.getElementById("themeToggle");

// Cargar tema guardado
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️";
}

// Cambiar tema
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  }
});

let wellnessData = {};

function loadWellnessData() {
  const key = `wellnessData_${getCurrentUserKey()}`;

  wellnessData = JSON.parse(localStorage.getItem(key)) || {
    points: 0,
    streak: 0,
    activitiesCompleted: 0,
    lastCompletedDate: null,
    achievement: "Aún no tienes logros"
  };
}
const dailyChallenges = [
  { icon: "🧘", text: "Respira profundamente durante 1 minuto." },
  { icon: "🌬️", text: "Realiza 5 respiraciones lentas." },
  { icon: "🚶", text: "Camina durante 5 minutos." },
  { icon: "🤸", text: "Haz 10 estiramientos." },
  { icon: "💧", text: "Bebe un vaso de agua." },
  { icon: "🎧", text: "Escucha una canción relajante." },
  { icon: "📵", text: "Aléjate del celular durante 10 minutos." },
  { icon: "🧹", text: "Organiza tu espacio de estudio." },
  { icon: "🍅", text: "Completa un Pomodoro." },
  { icon: "👀", text: "Descansa la vista durante 2 minutos." },
  { icon: "🗣️", text: "Habla con un amigo o familiar." },
  { icon: "📝", text: "Escribe 3 cosas positivas de tu día." },
  { icon: "🍎", text: "Come una fruta hoy." },
  { icon: "🌿", text: "Sal a tomar aire fresco." },
  { icon: "🙂", text: "Sonríe y toma un descanso breve." }
];
function loadDailyChallenge() {
  const challengeIcon = document.getElementById("dailyChallengeIcon");
  const challengeText = document.getElementById("dailyChallengeText");

  const today = new Date().getDate();
  const challenge = dailyChallenges[today % dailyChallenges.length];

document.getElementById("dailyChallengeIcon").textContent =
  challenge.icon;

document.getElementById("dailyChallengeText").textContent =
  challenge.text;
}
function saveWellnessData() {
  const key = `wellnessData_${getCurrentUserKey()}`;
  localStorage.setItem(key, JSON.stringify(wellnessData));
}

function addGardenProgress(points = 5) {
  wellnessData.activitiesCompleted = Math.min(
  wellnessData.activitiesCompleted + 1,
  30
);
  wellnessData.points += points;

  if (wellnessData.activitiesCompleted >= 30) {
    wellnessData.achievement = "🌳 Jardín completamente florecido";
  } else if (wellnessData.activitiesCompleted >= 20) {
    wellnessData.achievement = "🌸 Árbol con flores";
  } else if (wellnessData.activitiesCompleted >= 10) {
    wellnessData.achievement = "🌳 Árbol saludable";
  } else if (wellnessData.activitiesCompleted >= 5) {
    wellnessData.achievement = "🌿 Planta en crecimiento";
  } else if (wellnessData.activitiesCompleted >= 3) {
    wellnessData.achievement = "🌱 Primer brote";
  } else {
    wellnessData.achievement = "✨ Primer paso completado";
  }

  saveWellnessData();
  updateWellnessUI();
}

function updateWellnessUI() {
  checkGardenReset();
  const streakDays = document.getElementById("streakDays");
  const wellnessPoints = document.getElementById("wellnessPoints");
  const currentAchievement = document.getElementById("currentAchievement");
  const virtualGarden = document.getElementById("virtualGarden");
  const gardenMessage = document.getElementById("gardenMessage");
  const activitiesCounter = document.getElementById("activitiesCounter");
  const gardenProgressFill = document.getElementById("gardenProgressFill");
  if (!streakDays) return;
  streakDays.textContent = wellnessData.streak;
  wellnessPoints.textContent = wellnessData.points;
  currentAchievement.textContent = wellnessData.achievement;
  const completed = wellnessData.activitiesCompleted;
  if (completed >= 30) {
    virtualGarden.innerHTML = "🌳🌷🌼";
    gardenMessage.textContent = "Tu jardín está completamente florecido.";
  } else if (completed >= 20) {
    virtualGarden.innerHTML = "🌳🌸";
    gardenMessage.textContent = "Tu árbol ya tiene flores.";
  } else if (completed >= 10) {
    virtualGarden.innerHTML = "🌳";
    gardenMessage.textContent = "Tu árbol ha crecido.";
  } else if (completed >= 5) {
    virtualGarden.innerHTML = "🌿🌿";
    gardenMessage.textContent = "Tu planta sigue creciendo.";
  } else if (completed >= 3) {
    virtualGarden.innerHTML = "🌱🌿";
    gardenMessage.textContent = "Tu semilla comenzó a brotar.";
  } else {
    virtualGarden.innerHTML = "🌱";
    gardenMessage.textContent = "Completa actividades para hacer crecer tu jardín.";
  }

  virtualGarden.classList.add("garden-grow");
  setTimeout(() => virtualGarden.classList.remove("garden-grow"), 700);

  if (activitiesCounter) {
    activitiesCounter.textContent = Math.min(completed, 30);
  }

  if (gardenProgressFill) {
    const progress = Math.min((completed / 30) * 100, 100);
    gardenProgressFill.style.width = progress + "%";
  }
  loadDailyChallenge();
}
function checkGardenReset() {
  const today = new Date();
  const resetKey = `gardenResetDate_${getCurrentUserKey()}`;
  const resetDate = localStorage.getItem(resetKey);

  if (!resetDate) {
    localStorage.setItem(resetKey, today.toISOString());
    return;
  }

  const lastReset = new Date(resetDate);
  const daysPassed = Math.floor((today - lastReset) / (1000 * 60 * 60 * 24));

  if (daysPassed >= 10) {
    wellnessData.activitiesCompleted = 0;
    wellnessData.achievement = "Aún no tienes logros";
    localStorage.setItem(resetKey, today.toISOString());
    saveWellnessData();
  }
}

function completeDailyChallenge() {
  const today = new Date().toISOString().split("T")[0];

  if (wellnessData.lastCompletedDate === today) {
showMessage(
  "info",
  "💜 Ya completaste el reto del día de hoy. Regresa mañana para un nuevo desafío."
);
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split("T")[0];

  if (wellnessData.lastCompletedDate === yesterdayString) {
    wellnessData.streak++;
  } else {
    wellnessData.streak = 1;
  }

  wellnessData.lastCompletedDate = today;

  addGardenProgress(15);

  showMessage(
  "success",
  "🎯 Reto completado correctamente. Tu jardín ha crecido 🌱"
);
}

let breathingRunning = false;

function startBreathingExercise() {
  const person = document.getElementById("breathingPerson");
  const phaseText = document.getElementById("breathingPhaseText");
  const instruction = document.getElementById("breathingInstruction");
  const timer = document.getElementById("breathingTimer");
  const progressFill = document.getElementById("breathingProgressFill");

  let totalTime = 12;
  let timeLeft = totalTime;

  person.classList.add("breathe-active");
  progressFill.style.width = "0%";

  const breathingInterval = setInterval(() => {
    timeLeft--;

    timer.textContent = `00:${timeLeft.toString().padStart(2, "0")}`;

    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    progressFill.style.width = `${progress}%`;

    if (timeLeft > 8) {
      phaseText.textContent = "Inhala";
      instruction.textContent = "Respira profundo y llena tus pulmones.";
    } else if (timeLeft > 4) {
      phaseText.textContent = "Mantén";
      instruction.textContent = "Mantén la respiración con calma.";
    } else if (timeLeft > 0) {
      phaseText.textContent = "Exhala";
      instruction.textContent = "Suelta el aire lentamente.";
    } else {
      clearInterval(breathingInterval);

      person.classList.remove("breathe-active");
      phaseText.textContent = "Ejercicio completado ";
      instruction.textContent = "Muy bien, acabas de tomar una pausa saludable.";
      timer.textContent = "00:00";
      progressFill.style.width = "100%";

      if (typeof completeWellnessActivity === "function") {
        completeWellnessActivity();
      }
    }
  }, 1000);
}
let pomodoroRunning = false;
let pomodoroInterval;
let pomodoroSeconds = 25 * 60;
let completedPomodoros = 0;
let pomodoroPaused = false;

function startPomodoro() {
 if (pomodoroInterval) return;
  const status = document.getElementById("pomodoroStatus");
  const timeDisplay = document.getElementById("pomodoroTime");
  const progressFill = document.getElementById("pomodoroProgressFill");
  pomodoroRunning = true;
  pomodoroPaused = false;
  status.textContent = "🍅 Concentración activa";
  const totalSeconds = 25 * 60;
  pomodoroInterval = setInterval(() => {
    pomodoroSeconds--;
    const minutes = Math.floor(pomodoroSeconds / 60);
    const seconds = pomodoroSeconds % 60;
    timeDisplay.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
    const progress = ((totalSeconds - pomodoroSeconds) / totalSeconds) * 100;
    progressFill.style.width = `${progress}%`;
    if (pomodoroSeconds <= 0) {
      clearInterval(pomodoroInterval);
      pomodoroRunning = false;
      completedPomodoros++;
      document.getElementById("completedPomodoros").textContent =
        completedPomodoros;
   minutesDisplay.textContent = "1500";
      status.textContent = "✅ Pomodoro completado";
      timeDisplay.textContent = "25:00";
      progressFill.style.width = "100%";
      pomodoroSeconds = 25 * 60;
      if (typeof completeWellnessActivity === "function") {
        completeWellnessActivity();
      }
    }
  }, 1000);
}

function pausePomodoro() {
  if (!pomodoroInterval) return;

  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
  pomodoroRunning = false;
  pomodoroPaused = true;

  document.getElementById("pomodoroStatus").textContent = "⏸️ Pomodoro pausado";
}

function resetPomodoro() {
  clearInterval(pomodoroInterval);

  pomodoroRunning = false;
  pomodoroPaused = false;
  pomodoroSeconds = 25 * 60;

  document.getElementById("pomodoroTime").textContent = "25:00";
  document.getElementById("pomodoroStatus").textContent = "Listo para comenzar";
  document.getElementById("pomodoroProgressFill").style.width = "0%";

}
/* Ruleta real con canvas */
const wheelActivities = ["Respira", "Camina", "Agua", "Música", "Estira", "Ordena"];

const wheelResults = [
  "🌿 Respira profundamente durante 1 minuto",
  "🚶 Camina durante 5 minutos",
  "💧 Toma un vaso de agua",
  "🎵 Escucha una canción relajante",
  "🧘 Haz estiramientos rápidos",
  "📚 Ordena tu espacio de estudio"
];

let wheelAngle = 0;
let isWheelSpinning = false;
function drawStressWheel() {
  const canvas = document.getElementById("stressWheelCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 12;
  const slice = (2 * Math.PI) / wheelActivities.length;

  const colors = [
    "#8b5cf6",
    "#facc15",
    "#c4b5fd",
    "#fde68a",
    "#a78bfa",
    "#f3e8ff"
  ];

  ctx.clearRect(0, 0, size, size);

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(wheelAngle);

  for (let i = 0; i < wheelActivities.length; i++) {
    const start = i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.save();
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = i === 0 || i === 4 ? "#ffffff" : "#333333";
    ctx.font = "bold 14px Arial";
    ctx.fillText(wheelActivities[i], radius * 0.62, 5);
    ctx.restore();
  }

  ctx.restore();

  ctx.beginPath();
  ctx.arc(center, center, 36, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(center, center, 22, 0, Math.PI * 2);
  ctx.fillStyle = "#8b5cf6";
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("💜", center, center + 6);
}

function spinStressWheel() {
  if (isWheelSpinning) return;

  const result = document.getElementById("activityResult");
  const randomIndex = Math.floor(Math.random() * wheelActivities.length);

  let spins = 0;
  const totalSpins = 90 + randomIndex * 12;

  isWheelSpinning = true;
  result.textContent = "Girando...";

  const interval = setInterval(() => {
    wheelAngle += 0.25;
    spins++;
    drawStressWheel();

    if (spins >= totalSpins) {
      clearInterval(interval);

      result.textContent = wheelResults[randomIndex];

      addGardenProgress(5);

      isWheelSpinning = false;
    }
  }, 20);
}

document.addEventListener("DOMContentLoaded", function () {
  updateWellnessUI();
  drawStressWheel();
});

document.addEventListener("keydown", function(e){
  if(e.key === "Escape"){
    closeVideoModal();
  }
});
function openPsychChat() {
  document.getElementById("psychChatModal").style.display = "block";
}

function closePsychChat() {
  document.getElementById("psychChatModal").style.display = "none";
}

function schedulePsychAppointment() {
  const name = document.getElementById("psychName").value;
  const email = document.getElementById("psychEmail").value;
  const date = document.getElementById("psychDate").value;
  const time = document.getElementById("psychTime").value;
  const reason = document.getElementById("psychReason").value;

  if (!name || !email || !date || !time || !reason) {
    alert("Por favor completa todos los campos.");
    return;
  }

 showMessage(
  "success",
  "💜 Solicitud enviada. Tu cita ha sido registrada. Espera la confirmación del área de orientación psicológica."
);

  document.getElementById("psychName").value = "";
  document.getElementById("psychEmail").value = "";
  document.getElementById("psychDate").value = "";
  document.getElementById("psychTime").value = "";
  document.getElementById("psychReason").value = "";

  closePsychChat();
}
function actualizarResumenActual() {

  const key = `historialEstres_${getCurrentUserKey()}`;

  const historial =
    JSON.parse(localStorage.getItem(key)) || [];

  const nivel = document.getElementById("summaryNivel");
  const fecha = document.getElementById("summaryFecha");
  const total = document.getElementById("summaryTotal");

  if (!nivel || !fecha || !total) return;

  if (historial.length === 0) {
    nivel.textContent = "Sin registros";
    fecha.textContent = "Sin registros";
    total.textContent = "0";
    return;
  }

  const ultima = historial[historial.length - 1];

  nivel.textContent = ultima.nivel || "Sin dato";
  fecha.textContent = ultima.fecha || "Sin fecha";
  total.textContent = historial.length;
}

document.addEventListener("DOMContentLoaded", actualizarResumenActual);
actualizarResumenActual();
let bubbleCanvas, bubbleCtx;
let bubbles = [];
let liberated = 0;
let mistakes = 0;
let bubbleAnimation;

const badBubbles = ["Estrés", "Ansiedad", "Desvelo", "Presión", "Examen", "Tarea"];
const goodBubbles = ["Respirar", "Descansar", "Agua", "Dormir", "Calma", "Organizarse"];

function openBubbleGame() {
  liberated = 0;
  mistakes = 0;
  bubbles = [];
  window.bubbleRewardGiven = false;

  document.getElementById("bubbleGameModal").classList.add("active");
}

function closeBubbleGame() {
  document.getElementById("bubbleGameModal").classList.remove("active");
  cancelAnimationFrame(bubbleAnimation);

  liberated = 0;
  mistakes = 0;
  bubbles = [];
  window.bubbleRewardGiven = false;
}

function startBubbleGame() {
  bubbleCanvas = document.getElementById("bubbleCanvas");
  bubbleCtx = bubbleCanvas.getContext("2d");

liberated = 0;
mistakes = 0;
bubbles = [];
window.bubbleRewardGiven = false;
  for (let i = 0; i < 14; i++) {
    createBubble();
  }
  animateBubbles();
}

function createBubble() {
  const isBad = Math.random() < 0.65;
  const list = isBad ? badBubbles : goodBubbles;

  bubbles.push({
    x: Math.random() * 620 + 40,
    y: Math.random() * 360 + 60,
    radius: 42,
    text: list[Math.floor(Math.random() * list.length)],
    type: isBad ? "bad" : "good",
    speed: Math.random() * 1.2 + 0.5,
    wrong: false,
    wrongTime: 0
  });
}

function animateBubbles() {
  bubbleCtx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);

  bubbles.forEach((bubble) => {
    bubble.y -= bubble.speed;

    if (bubble.y < -60) {
      resetBubble(bubble);
    }

    bubbleCtx.beginPath();
    bubbleCtx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);

    bubbleCtx.fillStyle =
      bubble.type === "bad"
        ? "rgba(239, 68, 68, 0.22)"
        : "rgba(34, 197, 94, 0.22)";

    bubbleCtx.fill();

    bubbleCtx.strokeStyle =
      bubble.type === "bad" ? "#ef4444" : "#22c55e";

    bubbleCtx.lineWidth = 2;
    bubbleCtx.stroke();

    bubbleCtx.fillStyle = "#1e293b";
    bubbleCtx.font = "bold 14px Arial";
    bubbleCtx.textAlign = "center";
    bubbleCtx.fillText(bubble.text, bubble.x, bubble.y + 5);

    if (bubble.wrong) {
      bubbleCtx.strokeStyle = "#dc2626";
      bubbleCtx.lineWidth = 5;

      bubbleCtx.beginPath();
      bubbleCtx.moveTo(bubble.x - 22, bubble.y - 22);
      bubbleCtx.lineTo(bubble.x + 22, bubble.y + 22);
      bubbleCtx.moveTo(bubble.x + 22, bubble.y - 22);
      bubbleCtx.lineTo(bubble.x - 22, bubble.y + 22);
      bubbleCtx.stroke();

      bubble.wrongTime--;

      if (bubble.wrongTime <= 0) {
        bubble.wrong = false;
      }
    }
  });

  bubbleCtx.fillStyle = "#111827";
  bubbleCtx.font = "18px Arial";
  bubbleCtx.textAlign = "left";
  bubbleCtx.fillText("Malas liberadas: " + liberated, 20, 30);
  bubbleCtx.fillText("Errores: " + mistakes, 20, 55);

  if (liberated >= 15) {
    bubbleCtx.fillStyle = "rgba(255,255,255,0.92)";
    bubbleCtx.fillRect(130, 145, 440, 140);

    bubbleCtx.fillStyle = "#7c3aed";
    bubbleCtx.font = "24px Arial";
    bubbleCtx.textAlign = "center";
    bubbleCtx.fillText("✨ Excelente trabajo", 350, 195);

    bubbleCtx.fillStyle = "#334155";
    bubbleCtx.font = "16px Arial";
    bubbleCtx.fillText("Liberaste pensamientos negativos", 350, 230);
    bubbleCtx.fillText("sin perder tus hábitos positivos.", 350, 255);
  if (!window.bubbleRewardGiven) {
  window.bubbleRewardGiven = true;
  completeWellnessActivity();
}
    return;
  }

  bubbleAnimation = requestAnimationFrame(animateBubbles);
}

function resetBubble(bubble) {
  const isBad = Math.random() < 0.65;
  const list = isBad ? badBubbles : goodBubbles;

  bubble.x = Math.random() * 620 + 40;
  bubble.y = 500;
  bubble.radius = 42;
  bubble.text = list[Math.floor(Math.random() * list.length)];
  bubble.type = isBad ? "bad" : "good";
  bubble.speed = Math.random() * 1.2 + 0.5;
  bubble.wrong = false;
  bubble.wrongTime = 0;
}

document.addEventListener("click", function (e) {
  if (!bubbleCanvas) return;
  if (!document.getElementById("bubbleGameModal").classList.contains("active")) return;

  const rect = bubbleCanvas.getBoundingClientRect();
  const scaleX = bubbleCanvas.width / rect.width;
  const scaleY = bubbleCanvas.height / rect.height;

  const mouseX = (e.clientX - rect.left) * scaleX;
  const mouseY = (e.clientY - rect.top) * scaleY;

  bubbles.forEach((bubble) => {
    const dx = mouseX - bubble.x;
    const dy = mouseY - bubble.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < bubble.radius) {
      if (bubble.type === "bad") {
        liberated++;
        resetBubble(bubble);
      } else {
        mistakes++;
        bubble.wrong = true;
        bubble.wrongTime = 35;
      }
    }
  });
});
let selectedColor = "#f9a8d4";

function openColorGame() {
  document.getElementById("colorGameModal").classList.add("active");
  activateColorGame();
  updateProgress();
}

function closeColorGame() {
  document.getElementById("colorGameModal").classList.remove("active");
}

function selectColor(color) {
  selectedColor = color;
}

function activateColorGame() {
  document.querySelectorAll("#wellnessDrawing .paintable").forEach(item => {
    item.onclick = function (e) {
      e.stopPropagation();
      this.setAttribute("fill", selectedColor);
      this.dataset.painted = "true";
      updateProgress();
    };
  });
}

function updateProgress() {

  const items = document.querySelectorAll("#wellnessDrawing .paintable");
  const painted = document.querySelectorAll("#wellnessDrawing .paintable[data-painted='true']");

  const percent = items.length === 0
    ? 0
    : Math.round((painted.length / items.length) * 100);

  document.getElementById("paintProgressText").textContent = percent + "%";
  document.getElementById("paintProgressFill").style.width = percent + "%";

  console.log("Porcentaje:", percent);

  if (painted.length === items.length && items.length > 0) {

    if (!window.drawingCompleted) {

      window.drawingCompleted = true;
       if (!window.colorRewardGiven) {
  window.colorRewardGiven = true;
  completeWellnessActivity();
}
      setTimeout(() => {
 
       showCongratsModal();
      }, 200);

    }
  }
}
function resetDrawing() {

  document.querySelectorAll("#wellnessDrawing .paintable").forEach(item => {
    item.setAttribute("fill", "#ffffff");
    item.removeAttribute("data-painted");
  });

  window.drawingCompleted = false;
  window.colorRewardGiven = false;

  updateProgress();
}
function showCongratsModal() {

    document
      .getElementById("congratsModal")
      .classList.add("active");

}

function closeCongratsModal() {

    document
      .getElementById("congratsModal")
      .classList.remove("active");

}
function getCurrentUserKey() {
  if (!currentUser) return "guest";
  return currentUser.email;
}
function resetStressFormUI() {
  const form = document.getElementById("stressForm");

  if (form) {
    form.reset();
  }

  document.querySelectorAll("#stressForm input[type='radio']").forEach(input => {
    input.checked = false;
  });

  document.querySelectorAll("#stressForm .selected, #stressForm .active").forEach(el => {
    el.classList.remove("selected", "active");
  });

  document.getElementById("measurementForm").style.display = "block";
  document.getElementById("resultContainer").style.display = "none";
}
function completeWellnessActivity() {

  addGardenProgress(0);

  showMessage(
    "success",
    "🌱 Tu jardín ha crecido +1 progreso"
  );

}