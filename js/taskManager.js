const TaskManager = {
  state: null,
  completionTimers: {}, // Track setTimeout IDs for 3-second delay

  /**
   * Initialize the task manager by loading state from storage
   */
  init() {
    this.state = Storage.load();
  },

  /**
   * Generate a UUID v4
   * @returns {string} UUID
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * Get the next order value for a category
   * @param {string} category - Category name
   * @returns {number} Next order value
   */
  getNextOrder(category) {
    const categoryTasks = this.state.tasks.filter(t => t.category === category && !t.completed);
    return categoryTasks.length > 0
      ? Math.max(...categoryTasks.map(t => t.order)) + 1
      : 0;
  },

  /**
   * Add a new task
   * @param {string} title - Task title
   * @param {string} category - Category name
   * @returns {Object} The created task
   */
  addTask(title, category) {
    const task = {
      id: this.generateUUID(),
      title: title.trim(),
      category: category || this.state.settings.defaultCategory,
      completed: false,
      createdAt: Date.now(),
      completedAt: null,
      order: this.getNextOrder(category)
    };

    this.state.tasks.push(task);
    this.save();
    return task;
  },

  /**
   * Toggle task completion with 3-second delay
   * @param {string} taskId - Task ID
   * @returns {Object} Updated task
   */
  toggleComplete(taskId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) return null;

    // If unchecking a task with pending timer, cancel it
    if (this.completionTimers[taskId]) {
      clearTimeout(this.completionTimers[taskId]);
      delete this.completionTimers[taskId];
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? Date.now() : null;
    this.save();

    // If marking as complete, start 3-second timer
    if (task.completed) {
      this.completionTimers[taskId] = setTimeout(() => {
        delete this.completionTimers[taskId];
        // Trigger re-render to move task to completed tab
        if (window.UI) {
          window.UI.render();
        }
      }, 3000);
    }

    return task;
  },

  /**
   * Update a task
   * @param {string} taskId - Task ID
   * @param {Object} updates - Object with fields to update
   * @returns {Object} Updated task
   */
  updateTask(taskId, updates) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) return null;

    Object.assign(task, updates);
    this.save();
    return task;
  },

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @returns {boolean} Success status
   */
  deleteTask(taskId) {
    // Clear any pending completion timer
    if (this.completionTimers[taskId]) {
      clearTimeout(this.completionTimers[taskId]);
      delete this.completionTimers[taskId];
    }

    const initialLength = this.state.tasks.length;
    this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);
    const deleted = this.state.tasks.length < initialLength;

    if (deleted) {
      this.save();
    }

    return deleted;
  },

  /**
   * Get tasks grouped by category (incomplete only)
   * @returns {Object} Tasks grouped by category
   */
  getTasksByCategory() {
    const incompleteTasks = this.state.tasks.filter(t => !t.completed || this.completionTimers[t.id]);

    return incompleteTasks.reduce((acc, task) => {
      const cat = task.category || 'Uncategorized';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(task);
      return acc;
    }, {});
  },

  /**
   * Get completed tasks grouped by day
   * @returns {Object} Completed tasks grouped by day label
   */
  getCompletedTasksByDay() {
    const completedTasks = this.state.tasks.filter(t => t.completed && !this.completionTimers[t.id]);

    // Sort by completedAt (most recent first)
    completedTasks.sort((a, b) => b.completedAt - a.completedAt);

    // Group by day
    const grouped = {};
    completedTasks.forEach(task => {
      const dayLabel = this.getDayLabel(task.completedAt);
      if (!grouped[dayLabel]) grouped[dayLabel] = [];
      grouped[dayLabel].push(task);
    });

    return grouped;
  },

  /**
   * Get a human-readable day label for a timestamp
   * @param {number} timestamp - Timestamp in milliseconds
   * @returns {string} Day label
   */
  getDayLabel(timestamp) {
    const taskDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to midnight for comparison
    const taskDay = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (taskDay.getTime() === todayDay.getTime()) {
      return 'Today';
    } else if (taskDay.getTime() === yesterdayDay.getTime()) {
      return 'Yesterday';
    } else {
      // Format as "Month Day, Year"
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return taskDate.toLocaleDateString('en-US', options);
    }
  },

  /**
   * Reorder tasks within a category
   * @param {string} taskId - Task being moved
   * @param {number} newOrder - New order position
   */
  reorderTask(taskId, newOrder) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const categoryTasks = this.state.tasks
      .filter(t => t.category === task.category && !t.completed)
      .sort((a, b) => a.order - b.order);

    // Remove task from its current position
    const currentIndex = categoryTasks.findIndex(t => t.id === taskId);
    if (currentIndex === -1) return;

    categoryTasks.splice(currentIndex, 1);

    // Insert at new position
    categoryTasks.splice(newOrder, 0, task);

    // Update order values
    categoryTasks.forEach((t, index) => {
      t.order = index;
    });

    this.save();
  },

  /**
   * Check if a task has a pending completion timer
   * @param {string} taskId - Task ID
   * @returns {boolean} True if timer is active
   */
  hasCompletionTimer(taskId) {
    return !!this.completionTimers[taskId];
  },

  /**
   * Save current state to storage
   */
  save() {
    Storage.save(this.state);
  }
};
