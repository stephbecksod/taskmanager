const Storage = {
  STORAGE_KEY: 'taskManagerData',

  /**
   * Load data from localStorage
   * @returns {Object} The stored data or default state
   */
  load() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.getDefaultState();
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      return this.getDefaultState();
    }
  },

  /**
   * Save data to localStorage
   * @param {Object} state - The state to save
   * @returns {boolean} Success status
   */
  save(state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded! Please delete some completed tasks.');
      } else {
        console.error('Failed to save data to localStorage:', error);
      }
      return false;
    }
  },

  /**
   * Get the default state structure
   * @returns {Object} Default state
   */
  getDefaultState() {
    return {
      tasks: [],
      categories: ['Personal', 'Work', 'Shopping'],
      settings: {
        defaultCategory: 'Personal'
      }
    };
  },

  /**
   * Clear all data from localStorage
   */
  clear() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }
};
