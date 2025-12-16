const UI = {
  currentTab: 'todo',
  draggedTask: null,
  editingTaskId: null,

  /**
   * Initialize UI and bind events
   */
  init() {
    this.bindEvents();
    this.render();
  },

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Add task events
    document.getElementById('add-task-btn').addEventListener('click', () => {
      this.handleAddTask();
    });

    document.getElementById('task-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleAddTask();
      }
    });

    // Tab switching
    document.querySelectorAll('.tab-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = e.target.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Event delegation for task interactions
    document.addEventListener('click', (e) => {
      // Checkbox toggle
      if (e.target.matches('.task-checkbox')) {
        const taskId = e.target.closest('.task').dataset.id;
        this.handleToggleComplete(taskId);
      }

      // Delete button
      if (e.target.matches('.task-delete')) {
        const taskId = e.target.closest('.task').dataset.id;
        this.handleDelete(taskId);
      }

      // Click outside task to exit edit mode
      if (this.editingTaskId && !e.target.closest('.task')) {
        this.exitEditMode();
      }

      // Category toggle
      if (e.target.closest('.category-header')) {
        const category = e.target.closest('.category');
        category.classList.toggle('collapsed');
      }
    });

    // Task title click for editing
    document.addEventListener('click', (e) => {
      if (e.target.matches('.task-title') && !e.target.classList.contains('editing')) {
        const taskId = e.target.closest('.task').dataset.id;
        this.enterEditMode(taskId);
      }
    });

    // Handle editing
    document.addEventListener('keydown', (e) => {
      if (this.editingTaskId) {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.saveEdit();
        } else if (e.key === 'Escape') {
          this.exitEditMode();
        }
      }
    });

    document.addEventListener('blur', (e) => {
      if (e.target.matches('.task-title.editing')) {
        this.saveEdit();
      }
    }, true);
  },

  /**
   * Switch between tabs
   * @param {string} tab - Tab name ('todo' or 'completed')
   */
  switchTab(tab) {
    this.currentTab = tab;

    // Update tab links
    document.querySelectorAll('.tab-link').forEach(link => {
      link.classList.toggle('active', link.dataset.tab === tab);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${tab}-content`);
    });

    this.render();
  },

  /**
   * Handle adding a new task
   */
  handleAddTask() {
    const input = document.getElementById('task-input');
    const categorySelect = document.getElementById('category-select');
    const title = input.value.trim();

    if (title) {
      TaskManager.addTask(title, categorySelect.value);
      input.value = '';
      this.render();
    }
  },

  /**
   * Handle toggling task completion
   * @param {string} taskId - Task ID
   */
  handleToggleComplete(taskId) {
    TaskManager.toggleComplete(taskId);
    this.render();
  },

  /**
   * Handle task deletion
   * @param {string} taskId - Task ID
   */
  handleDelete(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      TaskManager.deleteTask(taskId);
      this.exitEditMode();
      this.render();
    }
  },

  /**
   * Enter edit mode for a task
   * @param {string} taskId - Task ID
   */
  enterEditMode(taskId) {
    this.exitEditMode(); // Exit any existing edit mode

    this.editingTaskId = taskId;
    const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);
    if (!taskElement) return;

    taskElement.classList.add('editing');
    const titleElement = taskElement.querySelector('.task-title');
    titleElement.contentEditable = true;
    titleElement.classList.add('editing');
    titleElement.focus();

    // Select all text
    const range = document.createRange();
    range.selectNodeContents(titleElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  },

  /**
   * Exit edit mode
   */
  exitEditMode() {
    if (!this.editingTaskId) return;

    const taskElement = document.querySelector(`.task[data-id="${this.editingTaskId}"]`);
    if (taskElement) {
      taskElement.classList.remove('editing');
      const titleElement = taskElement.querySelector('.task-title');
      titleElement.contentEditable = false;
      titleElement.classList.remove('editing');
    }

    this.editingTaskId = null;
  },

  /**
   * Save edit changes
   */
  saveEdit() {
    if (!this.editingTaskId) return;

    const taskElement = document.querySelector(`.task[data-id="${this.editingTaskId}"]`);
    if (!taskElement) return;

    const titleElement = taskElement.querySelector('.task-title');
    const newTitle = titleElement.textContent.trim();

    if (newTitle) {
      TaskManager.updateTask(this.editingTaskId, { title: newTitle });
    }

    this.exitEditMode();
    this.render();
  },

  /**
   * Render the current view
   */
  render() {
    if (this.currentTab === 'todo') {
      this.renderTodoTab();
    } else {
      this.renderCompletedTab();
    }
  },

  /**
   * Render the To-Do tab
   */
  renderTodoTab() {
    const container = document.getElementById('tasks-container');
    const tasksByCategory = TaskManager.getTasksByCategory();

    if (Object.keys(tasksByCategory).length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No tasks yet. Add one above to get started!</p></div>';
      return;
    }

    const html = Object.entries(tasksByCategory)
      .map(([category, tasks]) => this.renderCategory(category, tasks))
      .join('');

    container.innerHTML = html;
    this.attachDragDropEvents();
  },

  /**
   * Render a category section
   * @param {string} category - Category name
   * @param {Array} tasks - Tasks in the category
   * @returns {string} HTML string
   */
  renderCategory(category, tasks) {
    const sortedTasks = tasks.sort((a, b) => a.order - b.order);

    return `
      <div class="category" data-category="${this.escapeHtml(category)}">
        <div class="category-header">
          <span class="category-toggle">▼</span>
          <h3>${this.escapeHtml(category)} <span class="category-count">(${tasks.length})</span></h3>
        </div>
        <div class="tasks">
          ${sortedTasks.map(task => this.renderTask(task)).join('')}
        </div>
      </div>
    `;
  },

  /**
   * Render a single task
   * @param {Object} task - Task object
   * @returns {string} HTML string
   */
  renderTask(task) {
    const isCompleting = task.completed && TaskManager.hasCompletionTimer(task.id);
    const completingClass = isCompleting ? 'completing' : '';

    return `
      <div class="task ${completingClass}"
           data-id="${task.id}"
           draggable="true">
        <div class="task-content">
          <input type="checkbox"
                 class="task-checkbox"
                 ${task.completed ? 'checked' : ''}>
          <div class="task-title">${this.escapeHtml(task.title)}</div>
        </div>
        <button class="task-delete">✕</button>
      </div>
    `;
  },

  /**
   * Render the Completed tab
   */
  renderCompletedTab() {
    const container = document.getElementById('completed-tasks-container');
    const tasksByDay = TaskManager.getCompletedTasksByDay();

    if (Object.keys(tasksByDay).length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No completed tasks yet.</p></div>';
      return;
    }

    const html = Object.entries(tasksByDay)
      .map(([day, tasks]) => this.renderDayGroup(day, tasks))
      .join('');

    container.innerHTML = html;
  },

  /**
   * Render a day group in completed view
   * @param {string} day - Day label
   * @param {Array} tasks - Completed tasks
   * @returns {string} HTML string
   */
  renderDayGroup(day, tasks) {
    return `
      <div class="day-group">
        <h3>${this.escapeHtml(day)}</h3>
        ${tasks.map(task => this.renderCompletedTask(task)).join('')}
      </div>
    `;
  },

  /**
   * Render a completed task
   * @param {Object} task - Task object
   * @returns {string} HTML string
   */
  renderCompletedTask(task) {
    return `
      <div class="completed-task">
        <div class="task-title">${this.escapeHtml(task.title)}</div>
        <small>${this.escapeHtml(task.category)}</small>
      </div>
    `;
  },

  /**
   * Attach drag and drop event listeners
   */
  attachDragDropEvents() {
    const tasks = document.querySelectorAll('.task');

    tasks.forEach(task => {
      task.addEventListener('dragstart', (e) => this.handleDragStart(e));
      task.addEventListener('dragend', (e) => this.handleDragEnd(e));
      task.addEventListener('dragover', (e) => this.handleDragOver(e));
      task.addEventListener('drop', (e) => this.handleDrop(e));
      task.addEventListener('dragleave', (e) => this.handleDragLeave(e));
    });
  },

  /**
   * Handle drag start
   */
  handleDragStart(e) {
    this.draggedTask = e.currentTarget;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
  },

  /**
   * Handle drag end
   */
  handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    document.querySelectorAll('.task').forEach(task => {
      task.classList.remove('drag-over');
    });
  },

  /**
   * Handle drag over
   */
  handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';

    const draggedOver = e.currentTarget;
    if (draggedOver !== this.draggedTask) {
      draggedOver.classList.add('drag-over');
    }

    return false;
  },

  /**
   * Handle drag leave
   */
  handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  },

  /**
   * Handle drop
   */
  handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    e.preventDefault();

    const draggedId = this.draggedTask.dataset.id;
    const droppedOnId = e.currentTarget.dataset.id;

    if (draggedId !== droppedOnId) {
      // Get category of dropped task
      const droppedTask = TaskManager.state.tasks.find(t => t.id === droppedOnId);
      const draggedTask = TaskManager.state.tasks.find(t => t.id === draggedId);

      // Only reorder within same category
      if (droppedTask && draggedTask && droppedTask.category === draggedTask.category) {
        const categoryTasks = TaskManager.state.tasks
          .filter(t => t.category === draggedTask.category && !t.completed)
          .sort((a, b) => a.order - b.order);

        const newIndex = categoryTasks.findIndex(t => t.id === droppedOnId);
        TaskManager.reorderTask(draggedId, newIndex);
        this.render();
      }
    }

    return false;
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Make UI available globally for TaskManager callbacks
window.UI = UI;
