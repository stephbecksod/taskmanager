/**
 * Main application initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize TaskManager
  TaskManager.init();

  // Initialize UI
  UI.init();

  // Log successful initialization
  console.log('Task Manager initialized successfully');
  console.log('Loaded tasks:', TaskManager.state.tasks.length);
});
