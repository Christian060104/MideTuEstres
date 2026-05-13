// Global Variables
let currentUser = null;
let stressMeasurements = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load user data from localStorage
    loadUserData();
    
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
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if user is authenticated
            if (!currentUser) {
                showMessage('error', 'Debes registrarte o iniciar sesión para acceder a esta sección');
                showRegisterModal();
                return;
            }
            
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Stress measurement form
    document.getElementById('stressForm').addEventListener('submit', handleStressMeasurement);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
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
    const modal = document.getElementById('loginModal');

    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Abrir modal registro
function showRegisterModal() {
    const modal = document.getElementById('registerModal');

    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
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
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Cambiar login -> registro
function switchToRegister() {
    closeModal('loginModal');
    showRegisterModal();
}

// Cambiar registro -> login
function switchToLogin() {
    closeModal('registerModal');
    showLoginModal();
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate email domain
    if (!email.endsWith('@tehuacan.tecnm.mx')) {
        showMessage('error', 'Debe usar un correo institucional (@tehuacan.tecnm.mx)');
        return;
    }
    
    // Simulate authentication (in real app, this would be an API call)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateAuthUI();
        closeModal('loginModal');
        showMessage('success', '¡Bienvenido de nuevo!');
        
        // Load user data after successful login
        loadStressMeasurements();
        initializeChart();
        
        // Reset form
        document.getElementById('loginForm').reset();
    } else {
        showMessage('error', 'Correo o contraseña incorrectos');
    }
}


function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        matricula: document.getElementById('regMatricula').value,
        carrera: document.getElementById('regCarrera').value,
        semestre: document.getElementById('regSemestre').value,
        password: document.getElementById('regPassword').value,
        confirmPassword: document.getElementById('regConfirmPassword').value
    };
    
    // Validate email domain
    if (!formData.email.endsWith('@tehuacan.tecnm.mx')) {
        showMessage('error', 'Debe usar un correo institucional (@tehuacan.tecnm.mx)');
        return;
    }
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
        showMessage('error', 'Las contraseñas no coinciden');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === formData.email)) {
        showMessage('error', 'Este correo ya está registrado');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        matricula: formData.matricula,
        carrera: formData.carrera,
        semestre: formData.semestre,
        password: formData.password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    updateAuthUI();
    closeModal('registerModal');
    showMessage('success', '¡Registro exitoso! Bienvenido a MideTuEstres');
    
    // Initialize user data after successful registration
    loadStressMeasurements();
    initializeChart();
    
    // Reset form
    document.getElementById('registerForm').reset();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showMessage('success', 'Sesión cerrada correctamente');
    
    // Clear user-specific data
    stressMeasurements = [];
    document.getElementById('totalMeasurements').textContent = '0';
    document.getElementById('averageScore').textContent = '0';
    document.getElementById('improvement').textContent = '0%';
    initializeChart();
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainContent = document.getElementById('mainContent');
    const mainNav = document.getElementById('mainNav');
    
    if (currentUser) {
        // Show main content, hide welcome screen
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
        if (mainNav) mainNav.style.display = 'flex';
        
        // Update login button
        if (loginBtn) {
            loginBtn.textContent = `Hola, ${currentUser.name.split(' ')[0]}`;
            loginBtn.onclick = logout;
        }
    } else {
        // Show welcome screen, hide main content
        if (welcomeScreen) welcomeScreen.style.display = 'flex';
        if (mainContent) mainContent.style.display = 'none';
        if (mainNav) mainNav.style.display = 'none';
        
        // Update login button
        if (loginBtn) {
            loginBtn.textContent = 'Iniciar Sesión';
            loginBtn.onclick = showLoginModal;
        }
    }
}

// New function to check authentication status
function checkAuthenticationStatus() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainContent = document.getElementById('mainContent');
    
    if (currentUser) {
        // User is authenticated, show main content
        if (welcomeScreen) welcomeScreen.style.display= 'none';
        if (mainContent) mainContent.style.display = 'block';
    } else {
        // User is not authenticated, show welcome screen
        if (welcomeScreen) welcomeScreen.style.display = 'flex';
        if (mainContent) mainContent.style.display = 'none';
    }
}

// Stress Measurement Functions
function handleStressMeasurement(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showMessage('error', 'Debes iniciar sesión para medir tu estrés');
        showLoginModal();
        return;
    }
    
    const formData = new FormData(e.target);
    let totalScore = 0;
    let answeredQuestions = 0;
    
    // Calculate score
    for (let i = 1; i <= 5; i++) {
        const answer = formData.get(`q${i}`);
        if (answer) {
            totalScore += parseInt(answer);
            answeredQuestions++;
        }
    }
    
    if (answeredQuestions < 5) {
        showMessage('error', 'Por favor responde todas las preguntas');
        return;
    }
    
    // Save measurement
    const measurement = {
        id: Date.now().toString(),
        userId: currentUser.id,
        score: totalScore,
        date: new Date().toISOString(),
        answers: {
            q1: formData.get('q1'),
            q2: formData.get('q2'),
            q3: formData.get('q3'),
            q4: formData.get('q4'),
            q5: formData.get('q5')
        }
    };
    
    stressMeasurements.push(measurement);
    localStorage.setItem('stressMeasurements', JSON.stringify(stressMeasurements));
    
    // Show results
    showStressResults(totalScore);
    
    // Update tracking
    updateTrackingStats();
}

function showStressResults(score) {
    // Hide form, show results
    document.getElementById('measurementForm').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';
    
    // Calculate score percentage
    const maxScore = 20; // 5 questions * 4 points max
    const percentage = (score / maxScore) * 100;
    
    // Update score display
    document.getElementById('scoreValue').textContent = score;
    
    // Determine stress level and recommendations
    let level, description, recommendations;
    
    if (score <= 8) {
        level = 'Nivel de Estrés Bajo';
        description = 'Tienes un buen manejo del estrés académico. Sigue así!';
        recommendations = [
            'Mantén tus hábitos saludables',
            'Continúa con tus técnicas de relajación',
            'Comparte tus estrategias con compañeros',
            'Sigue monitoreando tu bienestar regularmente'
        ];
    } else if (score <= 14) {
        level = 'Nivel de Estrés Moderado';
        description = 'Estás experimentando algo de estrés, pero es manejable.';
        recommendations = [
            'Practica técnicas de respiración profunda',
            'Establece horarios regulares de estudio',
            'Haz pausas activas cada 30 minutos',
            'Habla con amigos o familiares sobre tus preocupaciones',
            'Considera actividades físicas ligeras'
        ];
    } else {
        level = 'Nivel de Estrés Alto';
        description = 'Tu nivel de estrés es elevado. Es importante tomar acción.';
        recommendations = [
            'Busca apoyo del departamento de bienestar estudiantil',
            'Practica meditación diaria (10-15 minutos)',
            'Revisa y ajusta tu carga académica si es posible',
            'Establece límites claros entre estudio y descanso',
            'Considera hablar con un consejero profesional',
            'Prioriza el sueño y la alimentación saludable'
        ];
    }
    
    // Update UI
    document.getElementById('levelTitle').textContent = level;
    document.getElementById('levelDescription').textContent = description;
    
    // Update recommendations
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });
    
    // Update score circle color based on level
    const scoreCircle = document.querySelector('.score-circle');
    if (score <= 8) {
        scoreCircle.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    } else if (score <= 14) {
        scoreCircle.style.background = 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)';
    } else {
        scoreCircle.style.background = 'linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)';
    }
}

function resetMeasurement() {
    // Reset form
    document.getElementById('stressForm').reset();
    
    // Show form, hide results
    document.getElementById('measurementForm').style.display = 'block';
    document.getElementById('resultContainer').style.display = 'none';
    
    // Scroll to measurement section
    scrollToSection('medicion');
}

// Tracking Functions
function loadStressMeasurements() {
    const measurements = localStorage.getItem('stressMeasurements');
    if (measurements) {
        stressMeasurements = JSON.parse(measurements);
    }
    
    // Filter measurements for current user
    if (currentUser) {
        const userMeasurements = stressMeasurements.filter(m => m.userId === currentUser.id);
        updateTrackingStats(userMeasurements);
    }
}

function updateTrackingStats(userMeasurements = null) {
    const measurements = userMeasurements || stressMeasurements.filter(m => m.userId === currentUser.id);
    
    if (measurements.length === 0) {
        document.getElementById('totalMeasurements').textContent = '0';
        document.getElementById('averageScore').textContent = '0';
        document.getElementById('improvement').textContent = '0%';
        return;
    }
    
    // Total measurements
    document.getElementById('totalMeasurements').textContent = measurements.length;
    
    // Average score
    const avgScore = measurements.reduce((sum, m) => sum + m.score, 0) / measurements.length;
    document.getElementById('averageScore').textContent = avgScore.toFixed(1);
    
    // Improvement (compare first vs last measurements)
    if (measurements.length >= 2) {
        const firstScore = measurements[0].score;
        const lastScore = measurements[measurements.length - 1].score;
        const improvement = ((firstScore - lastScore) / firstScore) * 100;
        document.getElementById('improvement').textContent = improvement.toFixed(1) + '%';
    } else {
        document.getElementById('improvement').textContent = 'N/A';
    }
    
    // Update chart
    updateChart(measurements);
}

function initializeChart() {
    // This would initialize a real chart library like Chart.js
    // For now, we'll create a placeholder
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.innerHTML = `
        <div class="chart-placeholder">
            <i class="fas fa-chart-line" style="font-size: 4rem; color: #667eea; margin-bottom: 1rem;"></i>
            <p>Gráfico de progreso</p>
            <p style="font-size: 0.9rem; color: #999;">Tus mediciones aparecerán aquí</p>
        </div>
    `;
}

function updateChart(measurements) {
    // This would update a real chart
    // For now, we'll just show a simple text representation
    const chartContainer = document.querySelector('.chart-container');
    
    if (measurements.length === 0) {
        initializeChart();
        return;
    }
    
    const chartData = measurements.map(m => ({
        date: new Date(m.date).toLocaleDateString(),
        score: m.score
    }));
    
    chartContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <h4 style="margin-bottom: 1rem;">Historial de Estrés</h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${chartData.map(d => `
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8f9fa; border-radius: 5px;">
                        <span>${d.date}</span>
                        <span style="font-weight: bold; color: ${d.score <= 8 ? '#28a745' : d.score <= 14 ? '#ffc107' : '#dc3545'}">${d.score} pts</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Resource Functions
function playVideo(videoType) {
    if (!currentUser) {
        showMessage('error', 'Debes iniciar sesión para ver los recursos');
        showLoginModal();
        return;
    }
    
    // In a real application, this would open a video player
    // For now, we'll show a message
    const videoMessages = {
        'relajacion': 'Video de técnicas de relajación - En desarrollo',
        'tiempo': 'Video de gestión del tiempo - En desarrollo',
        'motivacion': 'Video de motivación académica - En desarrollo'
    };
    
    showMessage('info', videoMessages[videoType] || 'Video no disponible');
}

// Utility Functions
function scrollToSection(sectionId) {
    // Check authentication before allowing navigation
    if (!currentUser && sectionId !== 'inicio') {
        showMessage('error', 'Debes registrarte para acceder a esta sección');
        showRegisterModal();
        return;
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showMessage(type, message) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Position at top
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translateX(-50%)';
    messageDiv.style.zIndex = '3000';
    messageDiv.style.maxWidth = '400px';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.padding = '1rem 1.5rem';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.fontWeight = '500';
    messageDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    // Set colors based on type
    if (type === 'success') {
        messageDiv.style.background = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        messageDiv.style.background = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    } else if (type === 'info') {
        messageDiv.style.background = '#d1ecf1';
        messageDiv.style.color = '#0c5460';
        messageDiv.style.border = '1px solid #bee5eb';
    }
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 4000);
}

function loadUserData() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
    }
}

// Data Management Functions
function exportUserData() {
    if (!currentUser) {
        showMessage('error', 'Debes iniciar sesión para exportar datos');
        return;
    }
    
    const userMeasurements = stressMeasurements.filter(m => m.userId === currentUser.id);
    const exportData = {
        user: {
            name: currentUser.name,
            email: currentUser.email,
            matricula: currentUser.matricula,
            carrera: currentUser.carrera,
            semestre: currentUser.semestre
        },
        measurements: userMeasurements,
        exportDate: new Date().toISOString()
    };
    
    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `stress_data_${currentUser.matricula}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showMessage('success', 'Datos exportados correctamente');
}

function clearUserData() {
    if (!currentUser) {
        showMessage('error', 'Debes iniciar sesión para eliminar datos');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.')) {
        // Remove user measurements
        stressMeasurements = stressMeasurements.filter(m => m.userId !== currentUser.id);
        localStorage.setItem('stressMeasurements', JSON.stringify(stressMeasurements));
        
        // Remove user account
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.filter(u => u.id !== currentUser.id);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Logout
        logout();
        
        showMessage('success', 'Todos tus datos han sido eliminados');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + E: Export data
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportUserData();
    }
    
    // Escape: Close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
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
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}
// Mobile-specific functions
function checkMobileView() {
    return window.innerWidth <= 768;
}

function optimizeForMobile() {
    if (checkMobileView()) {
        // Add mobile-specific optimizations
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }
}
// Mood selector
document.addEventListener('click', function(e){

    const btn = e.target.closest('.mood-btn');

    if(!btn) return;

    document.querySelectorAll('.mood-btn').forEach(b=>{
        b.classList.remove('active');
    });

    btn.classList.add('active');

});
// Carrusel ¿Sabías que?
let dykIndex = 0;

function updateDykCarousel() {
    const track = document.getElementById('dykTrack');
    const dots = document.querySelectorAll('.dyk-dot');

    if (!track) return;

    track.style.transform = `translateX(-${dykIndex * 100}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === dykIndex);
    });
}

function moveDykSlide(direction) {
    const totalSlides = document.querySelectorAll('.dyk-card').length;

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

window.addEventListener('resize', debounce(optimizeForMobile, 250));

// Initialize mobile optimizations
optimizeForMobile();
