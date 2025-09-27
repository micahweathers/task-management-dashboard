# 📋 Task Management Dashboard

A modern priority-based task management application featuring glassmorphism design, intelligent sorting, and comprehensive validation. Built with JavaScript ES6+ and modular CSS architecture.

## 🛠️ Technologies

**Frontend:** JavaScript ES6+ • HTML5 • CSS3 • Bootstrap 5.3.3 • jQuery 3.7.1

**Architecture:** Modular CSS (8 files) • Local Storage API • Responsive Design

## ✨ Key Features

### 🎯 Priority Management
- Four-tier priority system with automatic color coding
- Smart sorting by priority and completion status
- Visual hierarchy through consistent color mapping

### 📝 Task Operations
- Create, edit, and delete tasks with validation
- Due date management with past-date prevention
- Optional notes and budget tracking
- Real-time form validation with visual feedback

### 🎨 User Interface
- Dark theme with glassmorphism effects
- Floating bubble animations
- Themed modal dialogs
- Custom scrollbars and hover effects
- Mobile-responsive layout

## 🏗️ Architecture

### File Structure
```
task-management-dashboard/
├── index.html
├── styles/
│   ├── base.css          # Foundation & animations
│   ├── layout.css        # Containers & structure
│   ├── forms.css         # Input styling
│   ├── buttons.css       # Button system
│   ├── modals.css        # Dialog components
│   ├── tasks.css         # Task display
│   ├── animations.css    # Keyframe animations
│   └── responsive.css    # Mobile design
└── scripts/
    └── app.js           # Core functionality
```

### Priority System
```javascript
const PRIORITY_COLORS = {
    'low': '#28a745',      // Green
    'medium': '#ffc107',   // Yellow  
    'high': '#fd7e14',     // Orange
    'urgent': '#dc3545'    // Red
};
```

### Task Model
```javascript
class Task {
    constructor(title, notes, priority, dueDate, status, budget) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 9);
        this.title = title;
        this.notes = notes;
        this.priority = priority;
        this.color = PRIORITY_COLORS[priority];
        this.dueDate = dueDate;
        this.status = status;
        this.budget = parseFloat(budget) || 0;
        this.createdAt = new Date().toISOString();
    }
}
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome 92+, Firefox 91+, Safari 14+, Edge 92+)
- No server required - runs entirely client-side

### Installation
```bash
git clone https://github.com/micahweathers/task-management-dashboard.git
cd task-management-dashboard
# Open index.html in your default browser
```

## 💡 Usage

### Creating Tasks
1. Enter task title (auto-capitalized)
2. Add optional notes
3. Select priority level (determines color)
4. Set due date
5. Choose status
6. Add budget if needed
7. Save task

### Task Management
- **Edit:** Click edit button to modify any task
- **Complete:** One-click status changes
- **Delete:** Confirmation dialog prevents accidents
- **Sort:** Automatic sorting by priority and status

## 🎨 Design Philosophy

### Visual Hierarchy
Priority-first interface with color coding for immediate recognition. Urgent tasks appear prominently while lower priority items remain accessible but de-emphasized.

### Dark Theme Benefits
- Reduced eye strain during extended use
- Professional appearance
- Better contrast for task details
- Energy efficient on OLED displays

### Modular CSS Approach
Separated concerns across 8 CSS files for maintainability, team collaboration, and selective loading. Each component has dedicated styling without conflicts.

## ⚡ Performance Features

### Optimization Strategies
- Modular CSS loading
- Efficient DOM manipulation
- In-memory task sorting
- Event delegation for dynamic content
- Local storage for persistence

### Browser Compatibility
Full ES6+ feature support across modern browsers with graceful degradation for older versions.

## 🔧 Technical Implementation

### Validation System
Comprehensive client-side validation with real-time feedback:
- Title: 3-50 characters, required
- Notes: 10-500 characters, optional  
- Priority: Required selection from four levels
- Due date: Future dates only
- Budget: Positive numbers up to $1,000,000, optional

### Modal System
Custom themed dialogs matching application design:
- Consistent visual language
- Keyboard navigation support
- Fallback to browser dialogs
- Bootstrap integration

### Data Persistence
Automatic local storage with error handling:
```javascript
function saveTasks() {
    try {
        localStorage.setItem('taskManagerTasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Storage error:', error);
    }
}
```

## 📱 Responsive Design

### Mobile Features
- Vertical layout stacking
- Touch-friendly interactions
- Readable typography scaling
- Optimized button sizing

### Desktop Enhancements
- Side-by-side form and task list
- Rich hover interactions
- Keyboard navigation
- Efficient screen space usage

## 🎓 Portfolio Highlights

### Technical Skills Demonstrated
- Modern JavaScript (ES6+ classes, arrow functions)
- Modular CSS architecture
- Responsive design implementation
- Local storage integration
- Form validation systems

### Professional Practices
- Code organization and separation of concerns
- Comprehensive documentation
- Error handling and graceful degradation
- Accessibility considerations
- Performance optimization

## 🔮 Future Enhancements

- Search and filtering capabilities
- Drag-and-drop task reordering
- Export functionality (JSON/CSV)
- Keyboard shortcuts
- Cloud synchronization
- Multi-user collaboration

---

**Built with modern web technologies • Version 1.2.0**

*This project demonstrates advanced proficiency in JavaScript ES6+, modular CSS architecture, responsive design, priority-based UX design, and professional development practices.*