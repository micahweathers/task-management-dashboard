// Global variables
let tasks = [];
let currentEditIndex = -1;

// Priority color mapping
const PRIORITY_COLORS = {
    'low': '#28a745',      // Green
    'medium': '#ffc107',   // Yellow
    'high': '#fd7e14',     // Orange
    'urgent': '#dc3545'    // Red
};

// Local Storage Functions
function saveTasks() {
    try {
        localStorage.setItem('taskManagerTasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
    }
}

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('taskManagerTasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        tasks = []; // Reset to empty array if there's an error
    }
}

// Task constructor - updated field names
class Task {
    constructor(title, notes, priority, dueDate, status, budget) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 9); // Unique ID for sorting
        this.title = title;
        this.notes = notes;
        this.priority = priority;
        this.color = PRIORITY_COLORS[priority] || '#6c757d'; // Get color based on priority
        this.dueDate = dueDate;
        this.status = status;
        this.budget = parseFloat(budget) || 0;
        this.createdAt = new Date().toISOString();
    }
}

// Check if Bootstrap is available
function isBootstrapAvailable() {
    return typeof bootstrap !== 'undefined' && bootstrap.Modal;
}

// Generic themed modal function
function showThemedModal(title, content, buttons = []) {
    // Fallback to browser dialogs if Bootstrap isn't available
    if (!isBootstrapAvailable()) {
        console.log('Bootstrap not available, using fallback');
        if (buttons.length === 1) {
            alert(content.replace(/<[^>]*>/g, '')); // Strip HTML tags
            if (buttons[0].callback) buttons[0].callback();
        } else if (buttons.length === 2) {
            const result = confirm(content.replace(/<[^>]*>/g, ''));
            if (result && buttons[1].callback) buttons[1].callback();
            else if (!result && buttons[0].callback) buttons[0].callback();
        }
        return;
    }

    const modalId = 'themedModal' + Date.now();

    // Create buttons HTML
    let buttonsHtml = '';
    buttons.forEach((button, index) => {
        const btnClass = button.type === 'primary' ? 'btn-primary' :
            button.type === 'warning' ? 'btn-warning' :
                button.type === 'danger' ? 'btn-danger' : 'btn-secondary';

        buttonsHtml += `<button type="button" class="btn ${btnClass}" id="${modalId}_btn_${index}">${button.text}</button>`;
    });

    const modalHtml = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content themed-modal">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalId}Label">${title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        ${buttonsHtml}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove any existing modals
    $('.modal').remove();

    // Add modal to body
    $('body').append(modalHtml);

    try {
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();

        // Add event listeners for buttons
        buttons.forEach((button, index) => {
            $(`#${modalId}_btn_${index}`).on('click', function () {
                if (button.callback) {
                    button.callback();
                }
                modal.hide();
            });
        });

        // Clean up when modal is hidden
        document.getElementById(modalId).addEventListener('hidden.bs.modal', function () {
            $(`#${modalId}`).remove();
        });

        return modal;
    } catch (error) {
        console.error('Error creating Bootstrap modal:', error);
        // Fallback to browser dialogs
        if (buttons.length === 1) {
            alert(content.replace(/<[^>]*>/g, ''));
            if (buttons[0].callback) buttons[0].callback();
        } else if (buttons.length === 2) {
            const result = confirm(content.replace(/<[^>]*>/g, ''));
            if (result && buttons[1].callback) buttons[1].callback();
            else if (!result && buttons[0].callback) buttons[0].callback();
        }
        $(`#${modalId}`).remove();
    }
}

// Themed alert function
function showThemedAlert(message, title = 'Alert') {
    showThemedModal(title, `<p>${message}</p>`, [
        { text: 'OK', type: 'primary', callback: null }
    ]);
}

// Themed confirm function
function showThemedConfirm(message, title = 'Confirm', onConfirm = null, onCancel = null) {
    showThemedModal(title, `<p>${message}</p>`, [
        { text: 'Cancel', type: 'secondary', callback: onCancel },
        { text: 'Confirm', type: 'primary', callback: onConfirm }
    ]);
}

// Themed prompt function
function showThemedPrompt(message, title = 'Input Required', defaultValue = '', onConfirm = null, onCancel = null) {
    const inputId = 'promptInput' + Date.now();
    const content = `
        <p>${message}</p>
        <div class="mb-3">
            <input type="text" class="form-control" id="${inputId}" value="${defaultValue}">
        </div>
    `;

    const modal = showThemedModal(title, content, [
        { text: 'Cancel', type: 'secondary', callback: onCancel },
        {
            text: 'OK',
            type: 'primary',
            callback: () => {
                const value = $(`#${inputId}`).val();
                if (onConfirm) onConfirm(value);
            }
        }
    ]);

    // Focus the input when modal is shown
    if (modal && modal._element) {
        modal._element.addEventListener('shown.bs.modal', function () {
            $(`#${inputId}`).focus();
        });
    }
}

// Form validation functions - updated field names
function validateTitle(title) {
    if (!title || title.trim().length === 0) {
        return "Title is required";
    }
    if (title.trim().length < 3) {
        return "Title must be at least 3 characters";
    }
    if (title.trim().length > 50) {
        return "Title must be less than 50 characters";
    }
    return null;
}

function validateNotes(notes) {
    // Notes are optional - if empty, return null (no error)
    if (!notes || notes.trim().length === 0) {
        return null;
    }
    if (notes.trim().length < 10) {
        return "Notes must be at least 10 characters";
    }
    if (notes.trim().length > 500) {
        return "Notes must be less than 500 characters";
    }
    return null;
}

function validateDueDate(dueDate) {
    if (!dueDate) {
        return "Due date is required";
    }
    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        return "Due date cannot be in the past";
    }
    return null;
}

function validatePriority(priority) {
    const validPriorities = ["low", "medium", "high", "urgent"];
    if (!priority || !validPriorities.includes(priority)) {
        return "Please select a valid priority";
    }
    return null;
}

function validateStatus(status) {
    const validStatuses = ["New", "In Progress", "Completed", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
        return "Please select a valid status";
    }
    return null;
}

function validateBudget(budget) {
    // Budget is optional - if empty, return null (no error)
    if (!budget || budget.trim() === "") {
        return null;
    }
    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum)) {
        return "Budget must be a valid number";
    }
    if (budgetNum <= 0) {
        return "Budget must be greater than 0";
    }
    if (budgetNum > 1000000) {
        return "Budget must be less than $1,000,000";
    }
    return null;
}

// Clear validation errors
function clearValidationErrors() {
    $(".error-message").remove();
    $(".form-control, #inputStatus, #inputPriority").removeClass("error");
}

// Show validation error
function showValidationError(fieldId, message) {
    const field = $(fieldId);
    field.addClass("error");
    field.after(`<div class="error-message">${message}</div>`);
}

// Validate entire form - updated field names
function validateForm() {
    clearValidationErrors();

    const title = $("#inputTitle").val();
    const notes = $("#inputNotes").val();
    const priority = $("#inputPriority").val();
    const dueDate = $("#inputDueDate").val();
    const status = $("#inputStatus").val();
    const budget = $("#inputBudget").val();

    let isValid = true;

    // Validate each field
    const titleError = validateTitle(title);
    if (titleError) {
        showValidationError("#inputTitle", titleError);
        isValid = false;
    }

    const notesError = validateNotes(notes);
    if (notesError) {
        showValidationError("#inputNotes", notesError);
        isValid = false;
    }

    const priorityError = validatePriority(priority);
    if (priorityError) {
        showValidationError("#inputPriority", priorityError);
        isValid = false;
    }

    const dateError = validateDueDate(dueDate);
    if (dateError) {
        showValidationError("#inputDueDate", dateError);
        isValid = false;
    }

    const statusError = validateStatus(status);
    if (statusError) {
        showValidationError("#inputStatus", statusError);
        isValid = false;
    }

    const budgetError = validateBudget(budget);
    if (budgetError) {
        showValidationError("#inputBudget", budgetError);
        isValid = false;
    }

    return isValid;
}

// Auto-capitalize first letter utility function
function capitalizeFirstLetter(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Save or update task - updated field names
function saveTask() {
    if (!validateForm()) {
        return;
    }

    // Get form values with auto-capitalization
    const title = capitalizeFirstLetter($("#inputTitle").val().trim());
    const notes = $("#inputNotes").val().trim();
    const priority = $("#inputPriority").val();
    const dueDate = $("#inputDueDate").val();
    const status = $("#inputStatus").val();
    const budget = $("#inputBudget").val();

    if (currentEditIndex === -1) {
        // Create new task
        const newTask = new Task(title, notes, priority, dueDate, status, budget || 0);
        tasks.push(newTask);
        console.log("New task created:", newTask);
        showSuccessMessage("Task created successfully!");
    } else {
        // Update existing task
        const existingTask = tasks[currentEditIndex];
        existingTask.title = title;
        existingTask.notes = notes;
        existingTask.priority = priority;
        existingTask.color = PRIORITY_COLORS[priority] || '#6c757d'; // Update color based on priority
        existingTask.dueDate = dueDate;
        existingTask.status = status;
        existingTask.budget = budget ? parseFloat(budget) : 0;
        console.log("Task updated:", existingTask);
        showSuccessMessage("Task updated successfully!");
        currentEditIndex = -1;
        $("#btnSave").text("Save Task");
    }

    // Save to localStorage and refresh display
    saveTasks();
    displayTasks();
    clearForm();
}

// Quick complete task function
function quickCompleteTask(index) {
    if (index < 0 || index >= tasks.length) return;

    const task = tasks[index];

    if (task.status === 'Completed') {
        showSuccessMessage("Task is already completed!");
        return;
    }

    // Store previous status for potential undo
    task.previousStatus = task.status;
    task.status = 'Completed';

    // Save and refresh
    saveTasks();
    displayTasks();
    showSuccessMessage(`"${task.title}" marked as completed!`);
}

// Undo complete task function
function undoCompleteTask(index) {
    if (index < 0 || index >= tasks.length) return;

    const task = tasks[index];

    if (task.status !== 'Completed') {
        showSuccessMessage("Task is not completed!");
        return;
    }

    // Restore previous status or default to 'In Progress'
    task.status = task.previousStatus || 'In Progress';
    delete task.previousStatus; // Clean up

    // Save and refresh
    saveTasks();
    displayTasks();
    showSuccessMessage(`"${task.title}" status restored!`);
}

// Show date picker for task - updated to due date
function showDatePicker(index) {
    if (index < 0 || index >= tasks.length) return;

    const task = tasks[index];

    // Check if Bootstrap is available, fallback to themed prompt
    if (!isBootstrapAvailable()) {
        showThemedPrompt(
            "Enter new due date (YYYY-MM-DDTHH:MM):",
            "Change Due Date",
            task.dueDate,
            (newDate) => {
                if (newDate && newDate !== task.dueDate) {
                    // Validate date
                    const selectedDate = new Date(newDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate < today) {
                        showThemedAlert("Due date cannot be in the past", "Invalid Date");
                        return;
                    }

                    // Update date
                    task.dueDate = newDate;
                    saveTasks();
                    displayTasks();
                    showSuccessMessage(`Due date updated for "${task.title}"`);
                }
            }
        );
        return;
    }

    // Create modal HTML with themed styling
    const modalHtml = `
        <div class="modal fade" id="datePickerModal" tabindex="-1" aria-labelledby="datePickerModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content themed-modal">
                    <div class="modal-header">
                        <h5 class="modal-title" id="datePickerModalLabel">Change Due Date</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="newDateInput" class="form-label">New Due Date</label>
                            <input type="datetime-local" class="form-control" id="newDateInput" value="${task.dueDate}">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveDateBtn">Save Date</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    $('#datePickerModal').remove();

    // Add modal to body
    $('body').append(modalHtml);

    try {
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('datePickerModal'));
        modal.show();

        // Handle save button
        $('#saveDateBtn').on('click', function () {
            const newDate = $('#newDateInput').val();

            if (newDate && newDate !== task.dueDate) {
                // Validate date
                const selectedDate = new Date(newDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                    showThemedAlert("Due date cannot be in the past", "Invalid Date");
                    return;
                }

                // Update date
                task.dueDate = newDate;
                saveTasks();
                displayTasks();
                showSuccessMessage(`Due date updated for "${task.title}"`);
            }

            modal.hide();
        });

        // Clean up when modal is hidden
        document.getElementById('datePickerModal').addEventListener('hidden.bs.modal', function () {
            $('#datePickerModal').remove();
        });
    } catch (error) {
        console.error('Error creating date picker modal:', error);
        // Fallback to prompt
        const newDate = prompt("Enter new due date (YYYY-MM-DDTHH:MM):", task.dueDate);

        if (newDate && newDate !== task.dueDate) {
            const selectedDate = new Date(newDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                alert("Due date cannot be in the past");
                return;
            }

            task.dueDate = newDate;
            saveTasks();
            displayTasks();
            showSuccessMessage(`Due date updated for "${task.title}"`);
        }

        $('#datePickerModal').remove();
    }
}

// Display tasks with sorting - updated field names and priority display
function displayTasks() {
    const listSection = $("#list");

    if (tasks.length === 0) {
        listSection.html(`
            <div class="empty-state">
                <h3>No Tasks Yet</h3>
                <p>Create your first task using the form!</p>
                <div class="task-icon">📋</div>
            </div>
            <div class="bubble-extra-1"></div>
            <div class="bubble-extra-2"></div>
        `);
        return;
    }

    // Sort tasks: non-completed first, completed last, then by priority
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.status === 'Completed' && b.status !== 'Completed') return 1;
        if (a.status !== 'Completed' && b.status === 'Completed') return -1;

        // If both have same completion status, sort by priority
        const priorityOrder = { 'urgent': 0, 'high': 1, 'medium': 2, 'low': 3 };
        return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
    });

    let html = '<div class="task-header"><h3>Your Tasks</h3></div><div class="task-container">';

    sortedTasks.forEach((task) => {
        // Find original index for the task functions
        const originalIndex = tasks.findIndex(t => t.id === task.id);
        const formattedDate = new Date(task.dueDate).toLocaleDateString();
        const formattedBudget = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(task.budget);

        // Format priority display with safety check
        const priorityDisplay = task.priority ?
            task.priority.charAt(0).toUpperCase() + task.priority.slice(1) + ' Priority' :
            'No Priority Set';


        html += `
            <div class="task-card task-border-color" data-color="${task.color}">
                <div class="task-header-row">
                    <h4 class="task-title">${task.title}</h4>
                    <span class="task-status status-${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span>
                </div>
                <div class="task-priority priority-${task.priority}">${priorityDisplay}</div>
                ${task.notes ? `<p class="task-notes">${task.notes}</p>` : ''}
                <div class="task-details">
                    <div class="task-detail">
                        <strong>Due:</strong> 
                        <span class="date-clickable" onclick="showDatePicker(${originalIndex})" title="Click to change date">
                            ${formattedDate}
                        </span>
                    </div>
                    ${task.budget > 0 ? `<div class="task-detail"><strong>Budget:</strong> ${formattedBudget}</div>` : ''}
                </div>
                <div class="task-actions">
                    ${task.status === 'Completed' ?
                `<button class="btn-undo" onclick="undoCompleteTask(${originalIndex})" title="Undo completion">↶ Undo</button>` :
                `<button class="btn-complete" onclick="quickCompleteTask(${originalIndex})" title="Mark as completed">✓ Complete</button>`
            }
                    <button class="btn-edit" onclick="editTask(${originalIndex})">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteTask(${originalIndex})">🗑️ Delete</button>
                </div>
            </div>
        `;
    });

    html += '</div><div class="bubble-extra-1"></div><div class="bubble-extra-2"></div>';
    listSection.html(html);

    // Apply border colors using jQuery instead of inline styles
    $('.task-border-color').each(function () {
        const color = $(this).data('color');
        $(this).css('border-left', `5px solid ${color}`);
    });
}

// Edit task - updated field names
function editTask(index) {
    const task = tasks[index];
    currentEditIndex = index;

    // Populate form with task data
    $("#inputTitle").val(task.title);
    $("#inputNotes").val(task.notes);
    $("#inputPriority").val(task.priority);
    $("#inputDueDate").val(task.dueDate);
    $("#inputStatus").val(task.status);
    $("#inputBudget").val(task.budget > 0 ? task.budget : "");

    // Update button text
    $("#btnSave").text("Update Task");

    // Scroll form into view
    $("#form")[0].scrollTop = 0;

    showSuccessMessage("Task loaded for editing");
}

// Delete task - UPDATED WITH THEMED MODAL
function deleteTask(index) {
    if (index < 0 || index >= tasks.length) return;

    const task = tasks[index];

    // Use themed confirm dialog
    showThemedConfirm(
        `Are you sure you want to delete this task?<br><br><div class="task-preview"><strong>"${task.title}"</strong><br><small class="text-muted">Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</small></div>`,
        "Delete Task",
        () => {
            // Confirm callback
            const deletedTask = tasks.splice(index, 1)[0];
            console.log("Task deleted:", deletedTask);

            saveTasks();
            displayTasks();
            showSuccessMessage("Task deleted successfully!");

            if (currentEditIndex === index) {
                currentEditIndex = -1;
                $("#btnSave").text("Save Task");
                clearForm();
            }
        }
    );
}

// Clear form - updated field names
function clearForm() {
    $("#inputTitle").val("");
    $("#inputNotes").val("");
    $("#inputPriority").val("");
    $("#inputDueDate").val("");
    $("#inputStatus").val("");
    $("#inputBudget").val("");
    clearValidationErrors();
    currentEditIndex = -1;
    $("#btnSave").text("Save Task");
}

// Clear all tasks function - UPDATED WITH THEMED MODAL
function clearAllTasks() {
    showThemedConfirm(
        `Are you sure you want to delete ALL tasks? This action cannot be undone.<br><br><p class="text-warning"><strong>All ${tasks.length} tasks will be permanently deleted.</strong></p>`,
        "Clear All Tasks",
        () => {
            // Confirm callback
            tasks = [];
            saveTasks();
            displayTasks();
            showSuccessMessage("All tasks cleared successfully!");

            if (currentEditIndex !== -1) {
                currentEditIndex = -1;
                $("#btnSave").text("Save Task");
                clearForm();
            }
        }
    );
}

// Show success message
function showSuccessMessage(message) {
    // Remove existing messages
    $(".success-message").remove();

    // Add success message
    const successDiv = `<div class="success-message">${message}</div>`;
    $("#form").prepend(successDiv);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        $(".success-message").fadeOut(500, function () {
            $(this).remove();
        });
    }, 3000);
}

// Initialize application
function init() {
    console.log("Task Manager initialized");

    // Debug Bootstrap availability
    console.log("Bootstrap available:", isBootstrapAvailable());
    console.log("Bootstrap object:", typeof bootstrap !== 'undefined' ? bootstrap : 'undefined');
    console.log("jQuery available:", typeof $ !== 'undefined');

    // Load tasks from localStorage first
    loadTasks();

    // Hook up event listeners
    $("#btnSave").click(saveTask);

    // Add clear button and clear all button in same row
    $("#btnSave").after(`
        <div class="button-row mt-3">
            <button class="btn btn-secondary" type="button" id="btnClear">Clear Form</button>
            <button class="btn btn-warning" type="button" id="btnClearAll">Clear All Tasks</button>
        </div>
    `);
    $("#btnClear").click(clearForm);
    $("#btnClearAll").click(clearAllTasks);

    // Auto-capitalize title on input
    $("#inputTitle").on('input', function () {
        const input = $(this);
        const value = input.val();
        const capitalizedValue = capitalizeFirstLetter(value);
        if (value !== capitalizedValue) {
            const cursorPos = input[0].selectionStart;
            input.val(capitalizedValue);
            input[0].setSelectionRange(cursorPos, cursorPos);
        }
    });

    // Real-time validation on blur
    $("#inputTitle").blur(() => {
        const error = validateTitle($("#inputTitle").val());
        if (error) {
            $("#inputTitle").addClass("error");
        } else {
            $("#inputTitle").removeClass("error");
        }
    });

    $("#inputNotes").blur(() => {
        const error = validateNotes($("#inputNotes").val());
        if (error) {
            $("#inputNotes").addClass("error");
        } else {
            $("#inputNotes").removeClass("error");
        }
    });

    // Create and add footer
    createFooter();

    // Display loaded tasks or empty state
    displayTasks();
}

// Create footer with version number
function createFooter() {
    const footer = $(`
        <div class="app-footer">
            Task Manager v1.2
        </div>
    `);
    $('body').append(footer);
}

// Initialize when page loads
window.onload = init;