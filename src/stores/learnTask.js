// stores/learnTask.js
import { defineStore } from 'pinia'

export const useLearnTask = defineStore('learnTask', {
  state: () => ({
    tasks: []
  }),
  actions: {
    // 添加任务
    addTask(task) {
      this.tasks.push(task)
    },
    // 更新任务
    updateTask(id, updatedTask) {
      const index = this.tasks.findIndex(task => task.id === id)
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updatedTask }
      }
    },
    // 删除任务
    deleteTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id)
    },
    // 获取任务
    getTaskById(id) {
      return this.tasks.find(task => task.id === id)
    }
  }
})