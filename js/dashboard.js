/**
 * ThannxAI Dashboard JavaScript
 * Priority Chart and Project Management Functionality
 * Version: 1.0
 */

// ===== GLOBAL VARIABLES =====
let dashboardData = {
    tasks: [],
    lastUpdated: new Date(),
    theme: 'light',
    autoSave: true
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ThannxAI Dashboard Initializing...');
    
    // Initialize dashboard
    initializeDashboard();
    
    // Load saved data
    loadDashboardData();
    
    // Update all counters and progress
    updateAllCounters();
    updateProgress();
    updateTeamStats();
    
    // Set up auto-save
    if (dashboardData.autoSave) {
        setInterval(autoSave, 30000); // Auto-save every 30 seconds
    }
    
    // Update timestamps
    updateTimestamps();
    setInterval(updateTimestamps, 60000); // Update every minute
    
    console.log('✅ Dashboard initialized successfully');
});

// ===== CORE FUNCTIONS =====

/**
 * Initialize dashboard components
 */
function initializeDashboard() {
    // Set up theme
    const savedTheme = localStorage.getItem('thannxai-theme') || 'light';
    setTheme(savedTheme);
    
    // Initialize task data from DOM
    initializeTaskData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize animations
    initializeAnimations();
}

/**
 * Initialize task data from DOM elements
 */
function initializeTaskData() {
    const taskItems = document.querySelectorAll('.task-item');
    dashboardData.tasks = [];
    
    taskItems.forEach(item => {
        const taskId = item.dataset.taskId;
        const checkbox = item.querySelector('.task-checkbox');
        const title = item.querySelector('.task-title').textContent;
        const description = item.querySelector('.task-description').textContent;
        const timeText = item.querySelector('.task-time').textContent;
        const teamText = item.querySelector('.task-team').textContent;
        const statusElement = item.querySelector('.task-status');
        
        const task = {
            id: taskId,
            title: title,
            description: description,
            time: timeText.replace('⏱️ ', ''),
            team: teamText.replace('👤 ', ''),
            status: statusElement.textContent,
            completed: checkbox.classList.contains('checked'),
            priority: getPriorityFromCard(item),
            element: item
        };
        
        dashboardData.tasks.push(task);
    });
}

/**
 * Get priority level from task card
 */
function getPriorityFromCard(taskElement) {
    const card = taskElement.closest('.priority-card');
    if (card.classList.contains('high-priority')) return 'high';
    if (card.classList.contains('medium-priority')) return 'medium';
    if (card.classList.contains('low-priority')) return 'low';
    if (card.classList.contains('completed')) return 'completed';
    return 'unknown';
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Task checkbox clicks are handled by onclick in HTML
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Window events
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('resize', handleResize);
    
    // Priority card hover effects
    setupPriorityCardEffects();
    
    // Timeline item hover effects
    setupTimelineEffects();
}

/**
 * Handle keyboard navigation
 */
function handleKeyboardNavigation(event) {
    // Ctrl+S to save
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveProgress();
        showNotification('Progress saved!', 'success');
    }
    
    // Ctrl+R to refresh (prevent default and use custom refresh)
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        refreshProgress();
    }
    
    // Escape to close any modals (future feature)
    if (event.key === 'Escape') {
        closeModals();
    }
}

/**
 * Handle before page unload
 */
function handleBeforeUnload(event) {
    if (dashboardData.autoSave) {
        saveProgress();
    }
}

/**
 * Handle window resize
 */
function handleResize() {
    // Adjust layouts if needed
    updateChartSizes();
}

// ===== TASK MANAGEMENT =====

/**
 * Toggle task completion status
 */
function toggleTask(checkboxElement) {
    const taskItem = checkboxElement.closest('.task-item');
    const taskId = taskItem.dataset.taskId;
    const task = dashboardData.tasks.find(t => t.id === taskId);
    
    if (!task) return;
    
    // Toggle completion status
    task.completed = !task.completed;
    
    // Update checkbox appearance
    if (task.completed) {
        checkboxElement.classList.add('checked');
        checkboxElement.textContent = '✓';
        updateTaskStatus(taskItem, 'Completed');
    } else {
        checkboxElement.classList.remove('checked');
        checkboxElement.textContent = '□';
        updateTaskStatus(taskItem, 'Pending');
    }
    
    // Update task in data
    task.status = task.completed ? 'Completed' : 'Pending';
    
    // Update all counters and progress
    updateAllCounters();
    updateProgress();
    updateTeamStats();
    
    // Add animation effect
    addTaskToggleAnimation(taskItem);
    
    // Auto-save if enabled
    if (dashboardData.autoSave) {
        saveProgress();
    }
    
    // Show feedback
    const action = task.completed ? 'completed' : 'uncompleted';
    showNotification(`Task ${action}: ${task.title}`, 'info');
}

/**
 * Update task status display
 */
function updateTaskStatus(taskItem, status) {
    const statusElement = taskItem.querySelector('.task-status');
    if (statusElement) {
        statusElement.textContent = status;
        statusElement.className = 'task-status';
        
        if (status === 'Completed') {
            statusElement.classList.add('status-completed');
        } else if (status === 'In Progress') {
            statusElement.classList.add('status-in-progress');
        } else {
            statusElement.classList.add('status-pending');
        }
    }
}

/**
 * Add animation effect to task toggle
 */
function addTaskToggleAnimation(taskItem) {
    taskItem.style.transform = 'scale(1.02)';
    taskItem.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        taskItem.style.transform = 'scale(1)';
    }, 200);
}

// ===== PROGRESS TRACKING =====

/**
 * Update all counters
 */
function updateAllCounters() {
    updatePriorityCounters();
    updateMainStats();
}

/**
 * Update priority counters
 */
function updatePriorityCounters() {
    const priorities = ['high', 'medium', 'low', 'completed'];
    
    priorities.forEach(priority => {
        const tasks = dashboardData.tasks.filter(task => task.priority === priority);
        const countElement = document.getElementById(`${priority}-priority-count`);
        if (countElement) {
            countElement.textContent = tasks.length;
        }
    });
}

/**
 * Update main statistics
 */
function updateMainStats() {
    const totalTasks = dashboardData.tasks.length;
    const completedTasks = dashboardData.tasks.filter(task => task.completed).length;
    const inProgressTasks = dashboardData.tasks.filter(task => task.status === 'In Progress').length;
    const pendingTasks = totalTasks - completedTasks - inProgressTasks;
    
    // Update DOM elements
    updateElementText('total-tasks', totalTasks);
    updateElementText('completed-tasks', completedTasks);
    updateElementText('in-progress-tasks', inProgressTasks);
    updateElementText('pending-tasks', pendingTasks);
}

/**
 * Update progress bars and percentages
 */
function updateProgress() {
    const totalTasks = dashboardData.tasks.length;
    const completedTasks = dashboardData.tasks.filter(task => task.completed).length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update main progress
    updateElementText('progress-percentage', `${progress}%`);
    updateProgressBar('main-progress-fill', progress);
    
    // Update progress bar aria attributes
    const progressBar = document.querySelector('.progress-bar[role="progressbar"]');
    if (progressBar) {
        progressBar.setAttribute('aria-valuenow', progress);
    }
}

/**
 * Update team statistics
 */
function updateTeamStats() {
    const teams = {
        'Frontend': 'frontend',
        'Backend': 'backend',
        'Design': 'design',
        'PWA': 'devops',
        'SEO': 'devops',
        'Performance': 'devops',
        'Analytics': 'devops',
        'Full Stack': 'frontend'
    };
    
    const teamStats = {
        frontend: { total: 0, completed: 0 },
        backend: { total: 0, completed: 0 },
        design: { total: 0, completed: 0 },
        devops: { total: 0, completed: 0 }
    };
    
    // Count tasks by team
    dashboardData.tasks.forEach(task => {
        const teamKey = teams[task.team] || 'frontend';
        teamStats[teamKey].total++;
        if (task.completed) {
            teamStats[teamKey].completed++;
        }
    });
    
    // Update team displays
    Object.keys(teamStats).forEach(team => {
        const stats = teamStats[team];
        const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
        
        updateElementText(`${team}-tasks`, stats.total);
        updateProgressBar(`${team}-progress`, progress);
    });
}

/**
 * Refresh all progress data
 */
function refreshProgress() {
    showNotification('Refreshing progress...', 'info');
    
    // Re-initialize task data
    initializeTaskData();
    
    // Update all counters and progress
    updateAllCounters();
    updateProgress();
    updateTeamStats();
    
    // Update timestamps
    updateTimestamps();
    
    showNotification('Progress refreshed!', 'success');
}

// ===== UTILITY FUNCTIONS =====

/**
 * Update element text content safely
 */
function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

/**
 * Update progress bar width
 */
function updateProgressBar(elementId, percentage) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.width = `${percentage}%`;
    }
}

/**
 * Update timestamps
 */
function updateTimestamps() {
    const now = new Date();
    const timeString = now.toLocaleString();
    
    updateElementText('last-updated-time', timeString);
    updateElementText('last-sync-time', 'Just now');
    
    dashboardData.lastUpdated = now;
}

// ===== THEME MANAGEMENT =====

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

/**
 * Set theme
 */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('thannxai-theme', theme);
    dashboardData.theme = theme;
    
    // Update theme icon
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// ===== DATA PERSISTENCE =====

/**
 * Save progress to localStorage
 */
function saveProgress() {
    try {
        const dataToSave = {
            tasks: dashboardData.tasks.map(task => ({
                id: task.id,
                completed: task.completed,
                status: task.status
            })),
            lastUpdated: dashboardData.lastUpdated,
            theme: dashboardData.theme,
            version: '1.0'
        };
        
        localStorage.setItem('thannxai-dashboard-data', JSON.stringify(dataToSave));
        showNotification('Progress saved successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Error saving progress:', error);
        showNotification('Error saving progress', 'error');
        return false;
    }
}

/**
 * Load dashboard data from localStorage
 */
function loadDashboardData() {
    try {
        const savedData = localStorage.getItem('thannxai-dashboard-data');
        if (!savedData) return;
        
        const data = JSON.parse(savedData);
        
        // Apply saved task states
        if (data.tasks) {
            data.tasks.forEach(savedTask => {
                const task = dashboardData.tasks.find(t => t.id === savedTask.id);
                if (task) {
                    task.completed = savedTask.completed;
                    task.status = savedTask.status;
                    
                    // Update DOM
                    const taskElement = task.element;
                    const checkbox = taskElement.querySelector('.task-checkbox');
                    
                    if (task.completed) {
                        checkbox.classList.add('checked');
                        checkbox.textContent = '✓';
                    } else {
                        checkbox.classList.remove('checked');
                        checkbox.textContent = '□';
                    }
                    
                    updateTaskStatus(taskElement, task.status);
                }
            });
        }
        
        // Apply saved theme
        if (data.theme) {
            setTheme(data.theme);
        }
        
        console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading saved data', 'warning');
    }
}

/**
 * Auto-save function
 */
function autoSave() {
    if (dashboardData.autoSave) {
        saveProgress();
    }
}

/**
 * Reset all data
 */
function resetData() {
    if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
        // Clear localStorage
        localStorage.removeItem('thannxai-dashboard-data');
        
        // Reset all tasks to uncompleted
        dashboardData.tasks.forEach(task => {
            task.completed = false;
            task.status = 'Pending';
            
            const checkbox = task.element.querySelector('.task-checkbox');
            checkbox.classList.remove('checked');
            checkbox.textContent = '□';
            
            updateTaskStatus(task.element, 'Pending');
        });
        
        // Update all displays
        updateAllCounters();
        updateProgress();
        updateTeamStats();
        
        showNotification('All data has been reset', 'info');
    }
}

// ===== EXPORT FUNCTIONALITY =====

/**
 * Export dashboard data
 */
function exportData() {
    try {
        const exportData = {
            projectName: 'ThannxAI Development',
            exportDate: new Date().toISOString(),
            totalTasks: dashboardData.tasks.length,
            completedTasks: dashboardData.tasks.filter(t => t.completed).length,
            tasks: dashboardData.tasks.map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                team: task.team,
                time: task.time,
                status: task.status,
                completed: task.completed
            })),
            progress: {
                overall: Math.round((dashboardData.tasks.filter(t => t.completed).length / dashboardData.tasks.length) * 100),
                byPriority: {
                    high: dashboardData.tasks.filter(t => t.priority === 'high' && t.completed).length,
                    medium: dashboardData.tasks.filter(t => t.priority === 'medium' && t.completed).length,
                    low: dashboardData.tasks.filter(t => t.priority === 'low' && t.completed).length
                }
            }
        };
        
        // Create and download file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `thannxai-dashboard-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        showNotification('Data exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('Error exporting data', 'error');
    }
}

// ===== ANIMATIONS AND EFFECTS =====

/**
 * Initialize animations
 */
function initializeAnimations() {
    // Stagger animation for priority cards
    const priorityCards = document.querySelectorAll('.priority-card');
    priorityCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Stagger animation for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
}

/**
 * Set up priority card effects
 */
function setupPriorityCardEffects() {
    const priorityCards = document.querySelectorAll('.priority-card');
    
    priorityCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px) scale(1)';
        });
    });
}

/**
 * Set up timeline effects
 */
function setupTimelineEffects() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

/**
 * Update chart sizes (for responsive design)
 */
function updateChartSizes() {
    // Future implementation for dynamic chart resizing
    console.log('Updating chart sizes for responsive design');
}

// ===== NOTIFICATION SYSTEM =====

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        border-left: 4px solid ${getNotificationColor(type)};
        z-index: var(--z-modal);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Get notification icon
 */
function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

/**
 * Get notification color
 */
function getNotificationColor(type) {
    const colors = {
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
        info: 'var(--info)'
    };
    return colors[type] || colors.info;
}

// ===== MODAL MANAGEMENT =====

/**
 * Close any open modals
 */
function closeModals() {
    // Future implementation for modal dialogs
    console.log('Closing modals');
}

// ===== PERFORMANCE MONITORING =====

/**
 * Monitor dashboard performance
 */
function monitorPerformance() {
    // Log performance metrics
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Dashboard load time: ${loadTime}ms`);
    }
}

// Initialize performance monitoring
window.addEventListener('load', monitorPerformance);

// ===== ERROR HANDLING =====

/**
 * Global error handler
 */
window.addEventListener('error', function(event) {
    console.error('Dashboard error:', event.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('An error occurred. Please try again.', 'error');
});

// ===== EXPORT GLOBAL FUNCTIONS =====
window.toggleTask = toggleTask;
window.toggleTheme = toggleTheme;
window.saveProgress = saveProgress;
window.resetData = resetData;
window.exportData = exportData;
window.refreshProgress = refreshProgress;

console.log('📊 ThannxAI Dashboard JavaScript loaded successfully');
