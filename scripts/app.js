// Global variables
let tasks = [];
let currentEditIndex = -1;

// Remove color display function - keeping it basic
// function updateColorDisplay() - REMOVED
// getColorName() function - REMOVED

// Task constructor
class Task {
    constructor(title, description, color, startDate, status, budget) {
        this.id = Date.now() + Math.random(); // Simple unique ID
        this.title = title;
        this.description = description;
        this.color = color;
        this.startDate = startDate;
        this.status = status;
        this.budget = parseFloat(budget) || 0;
        this.createdAt = new Date().toISOString();
    }
}

// Form validation functions
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

function validateDescription(description) {
    if (!description || description.trim().length === 0) {
        return "Description is required";
    }
    if (description.trim().length < 10) {
        return "Description must be at least 10 characters";
    }
    if (description.trim().length > 500) {
        return "Description must be less than 500 characters";
    }
    return null;
}

function validateStartDate(startDate) {
    if (!startDate) {
        return "Start date is required";
    }
    const selectedDate = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        return "Start date cannot be in the past";
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
    $(".form-control, #inputStatus").removeClass("error");
}

// Show validation error
function showValidationError(fieldId, message) {
    const field = $(fieldId);
    field.addClass("error");
    field.after(`<div class="error-message">${message}</div>`);
}

// Validate entire form
function validateForm() {
    clearValidationErrors();
    
    const title = $("#inputTitle").val();
    const description = $("#inputDescription").val();
    const startDate = $("#inputDate").val();
    const status = $("#inputStatus").val();
    const budget = $("#inputBudget").val();
    
    let isValid = true;
    
    // Validate each field
    const titleError = validateTitle(title);
    if (titleError) {
        showValidationError("#inputTitle", titleError);
        isValid = false;
    }
    
    const descError = validateDescription(description);
    if (descError) {
        showValidationError("#inputDescription", descError);
        isValid = false;
    }
    
    const dateError = validateStartDate(startDate);
    if (dateError) {
        showValidationError("#inputDate", dateError);
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

// Save or update task
function saveTask() {
    if (!validateForm()) {
        return;
    }
    
    // Get form values
    const title = $("#inputTitle").val().trim();
    const description = $("#inputDescription").val().trim();
    const color = $("#inputColor").val();
    const startDate = $("#inputDate").val();
    const status = $("#inputStatus").val();
    const budget = $("#inputBudget").val();
    
    if (currentEditIndex === -1) {
        // Create new task
        const newTask = new Task(title, description, color, startDate, status, budget || 0);
        tasks.push(newTask);
        console.log("New task created:", newTask);
        showSuccessMessage("Task created successfully!");
    } else {
        // Update existing task
        const existingTask = tasks[currentEditIndex];
        existingTask.title = title;
        existingTask.description = description;
        existingTask.color = color;
        existingTask.startDate = startDate;
        existingTask.status = status;
        existingTask.budget = budget ? parseFloat(budget) : 0;
        console.log("Task updated:", existingTask);
        showSuccessMessage("Task updated successfully!");
        currentEditIndex = -1;
        $("#btnSave").text("Save Task");
    }
    
    // Refresh display and clear form
    displayTasks();
    clearForm();
}

// Display tasks in the list section - NO INLINE STYLES
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
    
    let html = '<div class="task-header"><h3>Your Tasks</h3></div><div class="task-container">';
    
    tasks.forEach((task, index) => {
        const formattedDate = new Date(task.startDate).toLocaleDateString();
        const formattedBudget = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(task.budget);
        
        html += `
            <div class="task-card task-border-color" data-color="${task.color}">
                <div class="task-header-row">
                    <h4 class="task-title">${task.title}</h4>
                    <span class="task-status status-${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span>
                </div>
                <p class="task-description">${task.description}</p>
                <div class="task-details">
                    <div class="task-detail">
                        <strong>Start:</strong> ${formattedDate}
                    </div>
                    ${task.budget > 0 ? `<div class="task-detail"><strong>Budget:</strong> ${formattedBudget}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn-edit" onclick="editTask(${index})">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteTask(${index})">🗑️ Delete</button>
                </div>
            </div>
        `;
    });
    
    html += '</div><div class="bubble-extra-1"></div><div class="bubble-extra-2"></div>';
    listSection.html(html);
    
    // Apply border colors using jQuery instead of inline styles
    $('.task-border-color').each(function() {
        const color = $(this).data('color');
        $(this).css('border-left', `5px solid ${color}`);
    });
}

// Edit task
function editTask(index) {
    const task = tasks[index];
    currentEditIndex = index;
    
    // Populate form with task data
    $("#inputTitle").val(task.title);
    $("#inputDescription").val(task.description);
    $("#inputColor").val(task.color);
    $("#inputDate").val(task.startDate);
    $("#inputStatus").val(task.status);
    $("#inputBudget").val(task.budget > 0 ? task.budget : "");
    
    // Update button text
    $("#btnSave").text("Update Task");
    
    // Scroll form into view
    $("#form")[0].scrollTop = 0;
    
    showSuccessMessage("Task loaded for editing");
}

// Delete task
function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
        const deletedTask = tasks.splice(index, 1)[0];
        console.log("Task deleted:", deletedTask);
        displayTasks();
        showSuccessMessage("Task deleted successfully!");
        
        // Reset edit mode if we were editing the deleted task
        if (currentEditIndex === index) {
            currentEditIndex = -1;
            $("#btnSave").text("Save Task");
            clearForm();
        }
    }
}

// Clear form
function clearForm() {
    $("#inputTitle").val("");
    $("#inputDescription").val("");
    $("#inputColor").val("#563d7c");
    $("#inputDate").val("");
    $("#inputStatus").val("");
    $("#inputBudget").val("");
    clearValidationErrors();
    currentEditIndex = -1;
    $("#btnSave").text("Save Task");
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
        $(".success-message").fadeOut(500, function() {
            $(this).remove();
        });
    }, 3000);
}

// Initialize application
function init() {
    console.log("Task Manager initialized");
    
    // Set default color
    $("#inputColor").val("#563d7c");
    
    // Hook up event listeners
    $("#btnSave").click(saveTask);
    
    // Add clear button
    $("#btnSave").after('<button class="btn btn-secondary" type="button" id="btnClear" style="margin-left: 10px;">Clear Form</button>');
    $("#btnClear").click(clearForm);
    
    // Real-time validation on blur
    $("#inputTitle").blur(() => {
        const error = validateTitle($("#inputTitle").val());
        if (error) {
            $("#inputTitle").addClass("error");
        } else {
            $("#inputTitle").removeClass("error");
        }
    });
    
    $("#inputDescription").blur(() => {
        const error = validateDescription($("#inputDescription").val());
        if (error) {
            $("#inputDescription").addClass("error");
        } else {
            $("#inputDescription").removeClass("error");
        }
    });
    
    // Display initial empty state
    displayTasks();
}

// Initialize when page loads
window.onload = init;