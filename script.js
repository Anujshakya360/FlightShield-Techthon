// Global variables
let currentFlight = null;
let engineInterval = null;
let alertInterval = null;
let filteredFlights = [...flightData];
let blackboxInterval = null;
let chartUpdateInterval = null;
let transparencyMode = false;
let currentStarRating = 0;
let anomalyDetected = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    populateAirlineDropdown();
    populateAirlineComparison();
    startEngineMonitoring();
    startAlertFeed();
    addTooltipListeners();
    updateAllFilters();
    initializeBlackBox();
    populateTransparencyData();
    startLiveMetricsUpdate();
    applyFilters(); // Show initial flight cards
}

// Navigation
function navigateToChecker() {
    document.getElementById('checker').scrollIntoView({ behavior: 'smooth' });
}

function navigateToMonitoring() {
    document.getElementById('monitoring').scrollIntoView({ behavior: 'smooth' });
}

// Flight selection and filtering
function populateAirlineDropdown() {
    const airlineSelect = document.getElementById('airline-select');
    const airlines = [...new Set(flightData.map(flight => flight.airline))];
    
    airlineSelect.innerHTML = '<option value="">Choose Airline</option>';
    airlines.forEach(airline => {
        const option = document.createElement('option');
        option.value = airline;
        option.textContent = airline;
        airlineSelect.appendChild(option);
    });
}

function updateFlights() {
    const selectedAirline = document.getElementById('airline-select').value;
    const flightSelect = document.getElementById('flight-select');
    
    flightSelect.innerHTML = '<option value="">Choose Flight</option>';
    
    if (selectedAirline) {
        const airlineFlights = flightData.filter(flight => flight.airline === selectedAirline);
        airlineFlights.forEach(flight => {
            const option = document.createElement('option');
            option.value = flight.flight;
            option.textContent = `${flight.flight} (Age: ${flight.aircraftAge}y)`;
            flightSelect.appendChild(option);
        });
    }
    
    // Hide flight info when airline changes
    document.getElementById('flight-info').style.display = 'none';
}

function displayFlightInfo() {
    const selectedAirline = document.getElementById('airline-select').value;
    const selectedFlight = document.getElementById('flight-select').value;
    
    if (selectedAirline && selectedFlight) {
        currentFlight = flightData.find(flight => 
            flight.airline === selectedAirline && flight.flight === selectedFlight
        );
        
        if (currentFlight) {
            updateFlightDisplay(currentFlight);
            document.getElementById('flight-info').style.display = 'block';
        }
    }
}

function updateFlightDisplay(flight) {
    // Aircraft Age
    const ageElement = document.getElementById('aircraft-age');
    ageElement.textContent = `${flight.aircraftAge} years`;
    ageElement.className = `metric-value ${getAgeClass(flight.aircraftAge)}`;
    
    // Last Maintenance
    const maintenanceElement = document.getElementById('last-maintenance');
    const maintenanceDate = new Date(flight.lastMaintenance);
    const daysSince = Math.floor((new Date() - maintenanceDate) / (1000 * 60 * 60 * 24));
    maintenanceElement.textContent = `${daysSince} days ago`;
    maintenanceElement.className = `metric-value ${getMaintenanceClass(daysSince)}`;
    
    // Incident History
    const incidentElement = document.getElementById('incident-history');
    incidentElement.textContent = `${flight.crashHistory} incidents`;
    incidentElement.className = `metric-value ${getIncidentClass(flight.crashHistory)}`;
    
    // Pilot Hours
    const pilotElement = document.getElementById('pilot-hours');
    pilotElement.textContent = `${flight.pilotHours.toLocaleString()} hours`;
    pilotElement.className = `metric-value ${getPilotClass(flight.pilotHours)}`;
    
    // Safety Score
    const safetyElement = document.getElementById('safety-score');
    safetyElement.textContent = flight.safetyScore;
    safetyElement.className = `metric-value safety-${flight.safetyScore.toLowerCase()}`;
    
    // Update waste/fuel system status
    updateSystemStatus(flight);
}

function getAgeClass(age) {
    if (age <= 10) return 'safety-high';
    if (age <= 20) return 'safety-medium';
    return 'safety-low';
}

function getMaintenanceClass(days) {
    if (days <= 30) return 'safety-high';
    if (days <= 90) return 'safety-medium';
    return 'safety-low';
}

function getIncidentClass(incidents) {
    if (incidents === 0) return 'safety-high';
    if (incidents <= 1) return 'safety-medium';
    return 'safety-low';
}

function getPilotClass(hours) {
    if (hours >= 1000) return 'safety-high';
    if (hours >= 500) return 'safety-medium';
    return 'safety-low';
}

function applyFilters() {
    const ageFilter = parseInt(document.getElementById('age-filter').value);
    const safetyRatingFilter = parseFloat(document.getElementById('safety-rating-filter').value);
    const pilotHoursFilter = parseInt(document.getElementById('pilot-hours-filter').value);
    const maintenanceFilter = parseInt(document.getElementById('maintenance-filter').value);
    
    filteredFlights = flightData.filter(flight => {
        const daysSinceMaintenance = Math.floor((new Date() - new Date(flight.lastMaintenance)) / (1000 * 60 * 60 * 24));
        
        return flight.aircraftAge <= ageFilter &&
               flight.safetyRating >= safetyRatingFilter &&
               flight.pilotHours >= pilotHoursFilter &&
               daysSinceMaintenance <= maintenanceFilter;
    });
    
    // Update airline dropdown and generate flight cards
    updateAirlineDropdownWithFilters();
    generateFlightCards();
    updateAllFilters();
}

function updateAirlineDropdownWithFilters() {
    const airlineSelect = document.getElementById('airline-select');
    const currentValue = airlineSelect.value;
    const airlines = [...new Set(filteredFlights.map(flight => flight.airline))];
    
    airlineSelect.innerHTML = '<option value="">Choose Airline</option>';
    airlines.forEach(airline => {
        const option = document.createElement('option');
        option.value = airline;
        option.textContent = airline;
        airlineSelect.appendChild(option);
    });
    
    // Restore selection if still valid
    if (airlines.includes(currentValue)) {
        airlineSelect.value = currentValue;
    } else {
        // Clear flight selection if airline is no longer available
        document.getElementById('flight-select').innerHTML = '<option value="">Choose Flight</option>';
        document.getElementById('flight-info').style.display = 'none';
    }
}

function updateAllFilters() {
    updateAgeFilter();
    updateSafetyRatingFilter();
    updatePilotHoursFilter();
    updateMaintenanceFilter();
}

function updateAgeFilter() {
    const ageSlider = document.getElementById('age-filter');
    const ageValue = document.getElementById('age-value');
    ageValue.textContent = `${ageSlider.value} years`;
}

function updateSafetyRatingFilter() {
    const ratingSlider = document.getElementById('safety-rating-filter');
    const ratingValue = document.getElementById('safety-rating-value');
    ratingValue.textContent = `${ratingSlider.value}+`;
}

function updatePilotHoursFilter() {
    const hoursSlider = document.getElementById('pilot-hours-filter');
    const hoursValue = document.getElementById('pilot-hours-value');
    hoursValue.textContent = `${hoursSlider.value} hrs`;
}

function updateMaintenanceFilter() {
    const maintenanceSlider = document.getElementById('maintenance-filter');
    const maintenanceValue = document.getElementById('maintenance-value');
    maintenanceValue.textContent = `${maintenanceSlider.value} days`;
}

// Airline comparison
function populateAirlineComparison() {
    const comparisonGrid = document.getElementById('comparison-grid');
    
    airlineComparison.forEach(airline => {
        const card = createAirlineCard(airline);
        comparisonGrid.appendChild(card);
    });
}

function createAirlineCard(airline) {
    const card = document.createElement('div');
    card.className = 'airline-card';
    
    const ratingClass = airline.safetyRating >= 8 ? 'safety-high' : 
                       airline.safetyRating >= 6.5 ? 'safety-medium' : 'safety-low';
    
    card.innerHTML = `
        <div class="airline-logo">${airline.logo}</div>
        <div class="airline-name">${airline.name}</div>
        <div class="airline-stats">
            <div class="stat-row">
                <span class="stat-label">Avg Fleet Age</span>
                <span class="stat-value">${airline.avgFleetAge} years</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Crash History</span>
                <span class="stat-value">${airline.crashHistory} incidents</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Maintenance</span>
                <span class="stat-value">${airline.maintenanceFreq}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Avg Pilot Exp.</span>
                <span class="stat-value">${airline.avgPilotExp} hrs</span>
            </div>
        </div>
        <div class="rating ${ratingClass}">${airline.safetyRating}/10</div>
    `;
    
    return card;
}

// Engine monitoring simulation
function startEngineMonitoring() {
    engineInterval = setInterval(updateEngineMetrics, 2000);
}

function updateEngineMetrics() {
    updateGauge('temp', generateEngineValue('temperature'));
    updateGauge('fuel', generateEngineValue('fuelPressure'));
    updateGauge('hydraulic', generateEngineValue('hydraulicPressure'));
}

function generateEngineValue(type) {
    const threshold = engineThresholds[type];
    const baseValue = threshold.min + Math.random() * (threshold.max - threshold.min);
    
    // Occasionally generate critical values for alerts
    if (Math.random() < 0.05) {
        return threshold.critical + Math.random() * 50;
    }
    
    return Math.round(baseValue);
}

function updateGauge(type, value) {
    const threshold = engineThresholds[type === 'temp' ? 'temperature' : 
                                    type === 'fuel' ? 'fuelPressure' : 'hydraulicPressure'];
    
    const percentage = Math.min((value / threshold.max) * 100, 100);
    const isCritical = value >= threshold.critical;
    
    const gauge = document.getElementById(`${type}-gauge`);
    const fill = gauge.querySelector('.gauge-fill');
    const valueElement = document.getElementById(`${type}-value`);
    
    // Update value display
    let unit = type === 'temp' ? '°C' : ' PSI';
    valueElement.textContent = `${value}${unit}`;
    
    // Update gauge fill
    const color = isCritical ? 'var(--neon-red)' : 
                 percentage > 80 ? 'var(--neon-yellow)' : 'var(--neon-green)';
    
    fill.style.background = `conic-gradient(from 0deg, ${color} 0deg ${percentage * 2.7}deg, transparent ${percentage * 2.7}deg)`;
    
    // Update value color
    valueElement.style.color = color;
    
    // Generate alert if critical
    if (isCritical) {
        const alertType = type === 'temp' ? 'Engine overheating' :
                         type === 'fuel' ? 'High fuel pressure' : 'High hydraulic pressure';
        addAlert(`🚨 Critical: ${alertType} - ${value}${unit}`);
    }
}

// System status updates
function updateSystemStatus(flight) {
    updateWasteSystem(flight.wasteCleanDate);
    updateFuelSystem(flight.fuelCleanDate);
}

function updateWasteSystem(cleanDate) {
    const daysSince = Math.floor((new Date() - new Date(cleanDate)) / (1000 * 60 * 60 * 24));
    const indicator = document.getElementById('waste-indicator');
    
    indicator.className = 'indicator';
    if (daysSince > 30) {
        indicator.classList.add('status-danger');
        addAlert('⚠️ Waste system: Possible contamination risk');
    } else if (daysSince > 14) {
        indicator.classList.add('status-warning');
    } else {
        indicator.classList.add('status-clean');
    }
}

function updateFuelSystem(cleanDate) {
    const daysSince = Math.floor((new Date() - new Date(cleanDate)) / (1000 * 60 * 60 * 24));
    const indicator = document.getElementById('fuel-indicator');
    
    indicator.className = 'indicator';
    if (daysSince > 30) {
        indicator.classList.add('status-danger');
        addAlert('⚠️ Fuel system: Contamination risk detected');
    } else if (daysSince > 14) {
        indicator.classList.add('status-warning');
    } else {
        indicator.classList.add('status-clean');
    }
}

// Live alert feed
function startAlertFeed() {
    alertInterval = setInterval(generateRandomAlert, 8000);
    // Add initial alert
    addAlert('System monitoring initiated');
}

function generateRandomAlert() {
    const randomAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
    addAlert(randomAlert);
}

function addAlert(message) {
    const alertContent = document.getElementById('alert-content');
    const alertItem = document.createElement('div');
    alertItem.className = 'alert-item';
    
    const now = new Date();
    const timestamp = now.toLocaleTimeString();
    
    alertItem.innerHTML = `
        <div>${message}</div>
        <div class="alert-timestamp">${timestamp}</div>
    `;
    
    alertContent.insertBefore(alertItem, alertContent.firstChild);
    
    // Keep only last 10 alerts
    while (alertContent.children.length > 10) {
        alertContent.removeChild(alertContent.lastChild);
    }
    
    // Auto-scroll to top
    alertContent.scrollTop = 0;
}

// Pilot modal
function showPilotModal() {
    if (!currentFlight) return;
    
    const modal = document.getElementById('pilot-modal');
    const pilotInfo = document.getElementById('pilot-info');
    
    const isInexperienced = currentFlight.pilotHours < 500;
    const experienceWarning = isInexperienced ? 
        '<div class="warning-badge">⚠️ Inexperienced</div>' : '';
    
    pilotInfo.innerHTML = `
        <div class="pilot-details">
            <div class="pilot-stat">
                <span>Name:</span>
                <span>${currentFlight.pilotName}</span>
            </div>
            <div class="pilot-stat">
                <span>Flying Hours:</span>
                <span>${currentFlight.pilotHours.toLocaleString()} hours ${experienceWarning}</span>
            </div>
            <div class="pilot-stat">
                <span>Certifications:</span>
                <span>${currentFlight.pilotCertifications.join(', ')}</span>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closePilotModal() {
    document.getElementById('pilot-modal').style.display = 'none';
}

// Tooltip functionality
function addTooltipListeners() {
    const tooltip = document.getElementById('tooltip');
    
    // Add tooltips to various elements
    addTooltip('.info-card', 'Click for detailed information');
    addTooltip('.gauge', 'Real-time engine monitoring data');
    addTooltip('.status-light', 'System cleanliness indicator');
    addTooltip('.airline-card', 'Airline safety comparison data');
}

function addTooltip(selector, text) {
    const elements = document.querySelectorAll(selector);
    const tooltip = document.getElementById('tooltip');
    
    elements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            tooltip.textContent = text;
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY - 10 + 'px';
            tooltip.classList.add('show');
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.classList.remove('show');
        });
        
        element.addEventListener('mousemove', (e) => {
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY - 10 + 'px';
        });
    });
}

// Enhanced flight card generation
function generateFlightCards() {
    const resultsContainer = document.getElementById('flight-results');
    resultsContainer.innerHTML = '';
    
    if (filteredFlights.length === 0) {
        resultsContainer.innerHTML = '<div class="no-flights">No flights match your criteria. Try adjusting the filters.</div>';
        return;
    }
    
    filteredFlights.forEach(flight => {
        const card = createFlightCard(flight);
        resultsContainer.appendChild(card);
    });
}

function createFlightCard(flight) {
    const card = document.createElement('div');
    card.className = 'flight-card';
    card.onclick = () => selectFlight(flight);
    
    const safetyClass = flight.safetyScore.toLowerCase();
    const daysSinceMaintenance = Math.floor((new Date() - new Date(flight.lastMaintenance)) / (1000 * 60 * 60 * 24));
    
    card.innerHTML = `
        <div class="flight-header">
            <div class="flight-number">${flight.airline} ${flight.flight}</div>
            <div class="safety-badge ${safetyClass}">${flight.safetyScore}</div>
        </div>
        <div class="flight-metrics">
            <div class="metric-row">
                <span class="label">Age:</span>
                <span>${flight.aircraftAge}y</span>
            </div>
            <div class="metric-row">
                <span class="label">Pilot:</span>
                <span>${flight.pilotHours}h</span>
            </div>
            <div class="metric-row">
                <span class="label">Maintenance:</span>
                <span>${daysSinceMaintenance}d ago</span>
            </div>
            <div class="metric-row">
                <span class="label">AI Score:</span>
                <span>${flight.safetyRating}/10</span>
            </div>
        </div>
    `;
    
    return card;
}

function selectFlight(flight) {
    // Remove previous selection
    document.querySelectorAll('.flight-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    event.currentTarget.classList.add('selected');
    
    currentFlight = flight;
    showFlightDetail(flight);
}

function showFlightDetail(flight) {
    const detailPanel = document.getElementById('flight-detail');
    const flightTitle = document.getElementById('flight-title');
    
    flightTitle.textContent = `${flight.airline} ${flight.flight} - Detailed Analysis`;
    
    // Update confidence score
    const confidence = calculateBookingConfidence(flight);
    const confidenceFill = document.getElementById('confidence-fill');
    const confidencePercentage = document.getElementById('confidence-percentage');
    
    confidenceFill.style.width = `${confidence}%`;
    confidencePercentage.textContent = `${confidence}%`;
    
    // Populate overview tab
    populateOverviewTab(flight);
    populateMaintenanceTab(flight);
    populateIncidentsTab(flight);
    populateEngineTab(flight);
    
    detailPanel.style.display = 'block';
    detailPanel.scrollIntoView({ behavior: 'smooth' });
}

function calculateBookingConfidence(flight) {
    let score = 50; // Base score
    
    // Age factor
    if (flight.aircraftAge <= 5) score += 20;
    else if (flight.aircraftAge <= 15) score += 10;
    else score -= 10;
    
    // Pilot experience factor
    if (flight.pilotHours >= 2000) score += 20;
    else if (flight.pilotHours >= 1000) score += 10;
    else if (flight.pilotHours < 500) score -= 20;
    
    // Safety record factor
    if (flight.crashHistory === 0) score += 15;
    else score -= flight.crashHistory * 10;
    
    // Engine health factor
    score += (flight.engineHealth - 70) / 3;
    
    return Math.max(0, Math.min(100, Math.round(score)));
}

function populateOverviewTab(flight) {
    document.getElementById('aircraft-age').textContent = `${flight.aircraftAge} years`;
    document.getElementById('aircraft-age').className = `metric-value ${getAgeClass(flight.aircraftAge)}`;
    
    document.getElementById('pilot-hours').textContent = `${flight.pilotHours.toLocaleString()} hours`;
    document.getElementById('pilot-hours').className = `metric-value ${getPilotClass(flight.pilotHours)}`;
    
    document.getElementById('ai-safety-score').textContent = `${flight.safetyRating}/10`;
    document.getElementById('ai-safety-score').className = `metric-value ${flight.safetyRating >= 7 ? 'safety-high' : flight.safetyRating >= 5 ? 'safety-medium' : 'safety-low'}`;
    
    // Score breakdown
    const maintenanceScore = Math.max(1, Math.min(10, 10 - Math.floor((new Date() - new Date(flight.lastMaintenance)) / (1000 * 60 * 60 * 24)) / 30));
    const pilotScore = Math.min(10, Math.max(1, Math.floor(flight.pilotHours / 200)));
    const aircraftScore = Math.max(1, Math.min(10, 10 - Math.floor(flight.aircraftAge / 3)));
    
    document.getElementById('maintenance-score').textContent = `${maintenanceScore}/10`;
    document.getElementById('pilot-score').textContent = `${pilotScore}/10`;
    document.getElementById('aircraft-score').textContent = `${aircraftScore}/10`;
}

function populateMaintenanceTab(flight) {
    const logsContainer = document.getElementById('maintenance-logs');
    logsContainer.innerHTML = '';
    
    if (flight.maintenanceLogs && flight.maintenanceLogs.length > 0) {
        flight.maintenanceLogs.forEach(log => {
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            logItem.innerHTML = `
                <div class="log-header">
                    <h5>${log.type}</h5>
                    <div class="log-meta">
                        <span class="log-date">${new Date(log.date).toLocaleDateString()}</span>
                        <span class="log-severity ${log.severity}">${log.severity.toUpperCase()}</span>
                    </div>
                </div>
                <p>${log.description}</p>
            `;
            logsContainer.appendChild(logItem);
        });
    } else {
        logsContainer.innerHTML = '<p>No maintenance logs available for this flight.</p>';
    }
}

function populateIncidentsTab(flight) {
    const logsContainer = document.getElementById('incident-logs');
    logsContainer.innerHTML = '';
    
    if (flight.incidentHistory && flight.incidentHistory.length > 0) {
        flight.incidentHistory.forEach(incident => {
            const incidentItem = document.createElement('div');
            incidentItem.className = 'log-item';
            incidentItem.innerHTML = `
                <div class="log-header">
                    <h5>${incident.type.charAt(0).toUpperCase() + incident.type.slice(1)} Incident</h5>
                    <div class="log-meta">
                        <span class="log-date">${new Date(incident.date).toLocaleDateString()}</span>
                        <span class="log-severity ${incident.severity}">${incident.severity.toUpperCase()}</span>
                    </div>
                </div>
                <p>${incident.description}</p>
            `;
            logsContainer.appendChild(incidentItem);
        });
    } else {
        logsContainer.innerHTML = '<div class="no-incidents"><i class="fas fa-check-circle"></i> No incidents reported for this flight.</div>';
    }
}

function populateEngineTab(flight) {
    const healthFill = document.getElementById('engine-health-fill');
    const healthStatus = document.getElementById('engine-health-status');
    const contaminationFill = document.getElementById('contamination-fill');
    const contaminationPercentage = document.getElementById('contamination-percentage');
    
    healthFill.style.width = `${flight.engineHealth}%`;
    healthStatus.textContent = flight.engineHealth >= 80 ? 'Excellent' : 
                              flight.engineHealth >= 60 ? 'Good' : 
                              flight.engineHealth >= 40 ? 'Fair' : 'Poor';
    
    contaminationFill.style.width = `${flight.fuelContamination}%`;
    contaminationPercentage.textContent = `${flight.fuelContamination}% contamination`;
}

// Tab management
function showTab(tabName) {
    // Hide all tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab panel
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Black Box 2.0 functionality
function initializeBlackBox() {
    startBlackBoxMonitoring();
    startChartUpdates();
}

function startBlackBoxMonitoring() {
    blackboxInterval = setInterval(() => {
        updateBlackBoxData();
        checkForAnomalies();
    }, 1000);
}

function startChartUpdates() {
    chartUpdateInterval = setInterval(() => {
        updateLiveCharts();
    }, 500);
}

function updateBlackBoxData() {
    // Update temperature
    const newTemp = 500 + Math.random() * 100 + (Math.random() > 0.95 ? 200 : 0);
    document.getElementById('current-temp').textContent = `${Math.round(newTemp)}°C`;
    
    // Update vibration
    const newVibration = 1.8 + Math.random() * 1.2 + (Math.random() > 0.98 ? 2 : 0);
    document.getElementById('current-vibration').textContent = `${newVibration.toFixed(1)} Hz`;
    
    // Update pressure
    const newPressure = 14.2 + Math.random() * 1.0;
    document.getElementById('current-pressure').textContent = `${newPressure.toFixed(1)} PSI`;
    
    // Update speed
    const newSpeed = 570 + Math.random() * 20 + (Math.random() > 0.97 ? -50 : 0);
    document.getElementById('current-speed').textContent = `${Math.round(newSpeed)} mph`;
    
    // Update chart data
    chartData.temperature.push(newTemp);
    chartData.vibration.push(newVibration);
    chartData.pressure.push(newPressure);
    chartData.speed.push(newSpeed);
    
    // Keep only last 50 data points
    Object.keys(chartData).forEach(key => {
        if (chartData[key].length > 50) {
            chartData[key].shift();
        }
    });
}

function updateLiveCharts() {
    // Simple chart visualization using canvas
    updateCanvas('tempCanvas', chartData.temperature, '#00d4ff');
    updateCanvas('vibrationCanvas', chartData.vibration, '#00ff88');
    updateCanvas('pressureCanvas', chartData.pressure, '#ffcc00');
    updateCanvas('speedCanvas', chartData.speed, '#ff0066');
}

function updateCanvas(canvasId, data, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    data.forEach((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
}

function checkForAnomalies() {
    const temp = chartData.temperature[chartData.temperature.length - 1];
    const vibration = chartData.vibration[chartData.vibration.length - 1];
    const speed = chartData.speed[chartData.speed.length - 1];
    
    if (temp > 750 || vibration > 4.5 || speed < 520) {
        if (!anomalyDetected) {
            anomalyDetected = true;
            triggerAnomalyAlert();
        }
    } else {
        anomalyDetected = false;
        updateAnomalyStatus('normal');
    }
}

function triggerAnomalyAlert() {
    updateAnomalyStatus('critical');
    showAnomalyModal();
}

function updateAnomalyStatus(status) {
    const statusElement = document.getElementById('anomaly-status');
    const indicator = statusElement.querySelector('.status-indicator');
    
    indicator.className = `status-indicator ${status}`;
    
    if (status === 'normal') {
        indicator.innerHTML = '<i class="fas fa-check-circle"></i><span>All Systems Operating Normally</span>';
    } else if (status === 'warning') {
        indicator.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Minor Anomaly Detected - Monitoring</span>';
    } else if (status === 'critical') {
        indicator.innerHTML = '<i class="fas fa-times-circle"></i><span>Critical Anomaly Detected - Immediate Attention Required</span>';
    }
}

function showAnomalyModal() {
    const modal = document.getElementById('anomaly-modal');
    const alertDetails = document.getElementById('alert-details');
    
    alertDetails.innerHTML = `
        <p><strong>Anomaly Type:</strong> Multiple system parameters exceeded safe thresholds</p>
        <p><strong>Detection Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Affected Systems:</strong> Engine temperature, vibration sensors, speed monitoring</p>
        <p><strong>Risk Level:</strong> <span style="color: var(--neon-red);">HIGH</span></p>
    `;
    
    modal.style.display = 'block';
}

function closeAnomalyModal() {
    document.getElementById('anomaly-modal').style.display = 'none';
}

function contactGroundControl() {
    addAlert('🚨 Ground Control contacted - Emergency protocols initiated');
    closeAnomalyModal();
}

function acknowledgeAlert() {
    addAlert('✓ Anomaly alert acknowledged by flight crew');
    closeAnomalyModal();
}

// Weather route analysis
function updateRouteAnalysis() {
    const weather = document.getElementById('weather-condition').value;
    const routeData = weatherRoutes[weather];
    
    // Update risk level
    const riskLevel = document.querySelector('.risk-level');
    riskLevel.textContent = `${getRiskText(routeData.risk)} (${routeData.risk}%)`;
    riskLevel.className = `risk-level ${getRiskClass(routeData.risk)}`;
    
    // Update delay
    document.querySelector('.delay-time').textContent = `+${routeData.delay} minutes`;
    
    // Update weather impact
    const weatherImpact = document.querySelector('.weather-impact');
    weatherImpact.textContent = routeData.impact.charAt(0).toUpperCase() + routeData.impact.slice(1);
    weatherImpact.className = `weather-impact ${routeData.impact}`;
    
    // Update alerts
    const alertsContainer = document.getElementById('weather-alerts');
    alertsContainer.innerHTML = `
        <div class="alert-item weather-${getRiskClass(routeData.risk)}">
            <i class="fas fa-${getWeatherIcon(weather)}"></i>
            <span>${routeData.alert}</span>
        </div>
    `;
}

function getRiskText(risk) {
    if (risk < 25) return 'Low';
    if (risk < 60) return 'Medium';
    return 'High';
}

function getRiskClass(risk) {
    if (risk < 25) return 'low';
    if (risk < 60) return 'medium';
    return 'high';
}

function getWeatherIcon(weather) {
    const icons = {
        clear: 'sun',
        cloudy: 'cloud',
        storm: 'bolt',
        fog: 'smog',
        wind: 'wind'
    };
    return icons[weather] || 'cloud';
}

// Transparency panel functionality
function populateTransparencyData() {
    populatePassengerReports();
    populateFlightRatings();
    populateIncidentExplorer();
    populateAirlineComparison();
}

function populatePassengerReports() {
    const reportsContainer = document.getElementById('passenger-reports');
    reportsContainer.innerHTML = '';
    
    passengerReports.forEach(report => {
        const reportItem = document.createElement('div');
        reportItem.className = 'report-item';
        reportItem.innerHTML = `
            <div class="report-meta">
                <span>${report.flight} - ${report.airline}</span>
                <span>${new Date(report.date).toLocaleDateString()}</span>
            </div>
            <p>${report.report}</p>
        `;
        reportsContainer.appendChild(reportItem);
    });
}

function populateFlightRatings() {
    const summaryContainer = document.getElementById('ratings-summary');
    summaryContainer.innerHTML = '';
    
    Object.entries(flightRatings).forEach(([flight, data]) => {
        const ratingItem = document.createElement('div');
        ratingItem.className = 'rating-item';
        ratingItem.innerHTML = `
            <div class="rating-header">
                <span class="flight-name">${flight}</span>
                <span class="rating-average">${data.average}/5</span>
            </div>
            <div class="rating-breakdown">
                ${data.ratings.map((count, index) => 
                    `<div class="rating-bar">
                        <span>${index + 1}★</span>
                        <div class="bar">
                            <div class="fill" style="width: ${(count / data.total) * 100}%"></div>
                        </div>
                        <span>${count}</span>
                    </div>`
                ).join('')}
            </div>
        `;
        summaryContainer.appendChild(ratingItem);
    });
}

function populateIncidentExplorer() {
    const incidentsContainer = document.getElementById('incidents-list');
    incidentsContainer.innerHTML = '';
    
    historicalIncidents.forEach(incident => {
        const incidentItem = document.createElement('div');
        incidentItem.className = 'incident-item';
        incidentItem.innerHTML = `
            <div class="incident-header">
                <h5>${incident.airline} ${incident.flight}</h5>
                <span class="incident-type ${incident.type}">${incident.type.toUpperCase()}</span>
            </div>
            <div class="incident-details">
                <p><strong>Date:</strong> ${new Date(incident.date).toLocaleDateString()}</p>
                <p><strong>Aircraft:</strong> ${incident.aircraft}</p>
                <p><strong>Cause:</strong> ${incident.cause}</p>
                <p><strong>Outcome:</strong> ${incident.outcome}</p>
            </div>
        `;
        incidentsContainer.appendChild(incidentItem);
    });
}

function showTransparencyTab(tabName) {
    // Hide all transparency panels
    document.querySelectorAll('.transparency-panel-content').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all transparency tabs
    document.querySelectorAll('.transparency-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected panel
    document.getElementById(`${tabName}-panel`).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Star rating functionality
function initializeStarRating() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            currentStarRating = index + 1;
            updateStarDisplay();
        });
        
        star.addEventListener('mouseover', () => {
            highlightStars(index + 1);
        });
    });
    
    document.getElementById('star-rating').addEventListener('mouseleave', () => {
        updateStarDisplay();
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateStarDisplay() {
    highlightStars(currentStarRating);
}

function submitRating() {
    if (currentStarRating === 0) {
        alert('Please select a rating before submitting.');
        return;
    }
    
    addAlert(`✓ Flight rating submitted: ${currentStarRating}/5 stars`);
    currentStarRating = 0;
    updateStarDisplay();
}

function submitReport() {
    const reportText = document.getElementById('report-text').value.trim();
    if (reportText === '') {
        alert('Please enter a report before submitting.');
        return;
    }
    
    addAlert('✓ Anonymous safety report submitted to authorities');
    document.getElementById('report-text').value = '';
}

// Dark mode and transparency toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#dark-mode-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

function toggleTransparencyMode() {
    transparencyMode = !transparencyMode;
    const toggle = document.getElementById('transparency-toggle');
    
    if (transparencyMode) {
        toggle.classList.add('active');
        toggle.innerHTML = '<i class="fas fa-eye-slash"></i><span>Basic Mode</span>';
        document.body.classList.add('transparency-mode');
    } else {
        toggle.classList.remove('active');
        toggle.innerHTML = '<i class="fas fa-eye"></i><span>Transparency</span>';
        document.body.classList.remove('transparency-mode');
    }
}

// Live metrics update for hero section
function startLiveMetricsUpdate() {
    setInterval(() => {
        const altitude = document.getElementById('live-altitude');
        const speed = document.getElementById('live-speed');
        
        if (altitude && speed) {
            const currentAlt = parseInt(altitude.textContent.replace(/[^\d]/g, ''));
            const currentSpeed = parseInt(speed.textContent.replace(/[^\d]/g, ''));
            
            altitude.textContent = `${currentAlt + Math.floor(Math.random() * 200 - 100)} ft`;
            speed.textContent = `${currentSpeed + Math.floor(Math.random() * 20 - 10)} mph`;
        }
    }, 3000);
}

// Utility functions for Black Box
function showPastLogs() {
    const modal = document.getElementById('logs-modal');
    const logsContent = document.getElementById('logs-content');
    
    // Generate sample log data
    const logs = [];
    for (let i = 0; i < 20; i++) {
        const time = new Date(Date.now() - i * 15000);
        logs.push({
            timestamp: time.toLocaleTimeString(),
            system: ['Engine', 'Hydraulic', 'Navigation', 'Fuel'][Math.floor(Math.random() * 4)],
            value: (Math.random() * 100).toFixed(2),
            status: ['Normal', 'Normal', 'Normal', 'Warning'][Math.floor(Math.random() * 4)]
        });
    }
    
    logsContent.innerHTML = logs.map(log => `
        <div class="log-entry">
            <span class="log-time">${log.timestamp}</span>
            <span class="log-system">${log.system}</span>
            <span class="log-value">${log.value}</span>
            <span class="log-status ${log.status.toLowerCase()}">${log.status}</span>
        </div>
    `).join('');
    
    modal.style.display = 'block';
}

function closeLogsModal() {
    document.getElementById('logs-modal').style.display = 'none';
}

function exportData() {
    const data = {
        timestamp: new Date().toISOString(),
        chartData: chartData,
        currentFlight: currentFlight,
        systemStatus: 'operational'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flightshield_data_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addAlert('✓ Flight data exported successfully');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Filter event listeners
    ['age-filter', 'safety-rating-filter', 'pilot-hours-filter', 'maintenance-filter'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                updateAllFilters();
                applyFilters();
            });
        }
    });
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Transparency toggle
    const transparencyToggle = document.getElementById('transparency-toggle');
    if (transparencyToggle) {
        transparencyToggle.addEventListener('click', toggleTransparencyMode);
    }
    
    // Initialize star rating
    initializeStarRating();
    
    // Weather condition change
    const weatherCondition = document.getElementById('weather-condition');
    if (weatherCondition) {
        weatherCondition.addEventListener('change', updateRouteAnalysis);
        updateRouteAnalysis(); // Initial update
    }
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modals = ['pilot-modal', 'anomaly-modal', 'logs-modal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Cleanup intervals when page unloads
window.addEventListener('beforeunload', function() {
    if (engineInterval) clearInterval(engineInterval);
    if (alertInterval) clearInterval(alertInterval);
    if (blackboxInterval) clearInterval(blackboxInterval);
    if (chartUpdateInterval) clearInterval(chartUpdateInterval);
});