<template>
    <div class="event-form">
        <h3>{{ editingEvent.id ? '编辑日程' : '添加日程' }}</h3>
        <div class="form-group">
          <label>标题</label>
          <input v-model="currentEvent.title" type="text" placeholder="输入日程标题">
        </div>
        <div class="form-group">
          <label>标题</label>
          <input v-model="currentEvent.description" type="text" placeholder="输入日程描述">
        </div>
        <div class="form-group">
          <label>开始时间</label>
          <input v-model="currentEvent.start" type="datetime-local">
        </div>
        <div class="form-group">
          <label>结束时间</label>
          <input v-model="currentEvent.end" type="datetime-local">
        </div>
        <div class="form-group">
          <label>颜色</label>
          <input v-model="currentEvent.backgroundColor" type="color">
        </div>
        <div class="form-actions">
          <button @click="saveEvent(editingEvent)">保存</button>
          <button @click="cancelEdit(editingEvent)">取消</button>
          <button v-if="editingEvent" @click="deleteEvent(editingEvent)">删除</button>
        </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, defineProps, defineEmits, onMounted } from 'vue'
  import { useLearnTask } from '@/stores/learnTask'
  
  // 响应式状态
  const emits = defineEmits(['cancelEdit'])
  const currentEvent = reactive({
    id: null,
    title: '',
    start: '',
    end: '',
    description: '',
    backgroundColor: '#3788d8'
  })
  
  const props = defineProps({
    editingEvent: {
      type: Object,
      required: true
    }
  })

  const learnTask = useLearnTask()
  

  
  function saveEvent(editingEvent) {
    if (editingEvent.id) {
      // 更新现有事件
      learnTask.updateTask(currentEvent.id, {
        title: currentEvent.title,
        start: new Date(currentEvent.start),
        end: new Date(currentEvent.end),
        backgroundColor: currentEvent.backgroundColor
      })
    } else {
      // 添加新事件
      const newTask = {
        id: Date.now().toString(),
        title: currentEvent.title,
        start: new Date(currentEvent.start),
        end: new Date(currentEvent.end),
        description: currentEvent.description,
        backgroundColor: currentEvent.backgroundColor
      }
      learnTask.addTask(newTask)
    }
    
    emits('cancelEdit')
  }

  function cancelEdit() {
    emits('cancelEdit')
  }
    
  function deleteEvent(editingEvent) {
    if (editingEvent.id) {
      learnTask.deleteTask(currentEvent.id)
    }
    emits('cancelEdit')
  }

  function formatDate(date) {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

  onMounted(() => {
    const event = props.editingEvent
    Object.assign(currentEvent, {
      id: event.id,
      title: event.title,
      start: formatDate(event.start),
      end: formatDate(event.end),
      description: event.description,
      backgroundColor: event.backgroundColor
    })
  })

  </script>
  
  <style>
  .event-form {
    width: 50%;
    height: 50%;
    padding: 2rem;
    border-radius: 8px;
    background: linear-gradient(75deg,rgba(230, 187, 187,0.8),rgba(252, 250, 250,0.5));
    position: absolute;
    top:45%;
    left: 50%;
    transform: translate(-40%,-40%);
    z-index: 99;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .form-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  .form-actions button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .form-actions button:first-child {
    background-color: #3788d8;
    color: white;
  }
  
  .form-actions button:first-child:hover {
    background-color: #2c7bbd;
  }
  
  .form-actions button:nth-child(2) {
    background-color: #f1f1f1;
  }
  
  .form-actions button:nth-child(2):hover {
    background-color: #e5e5e5;
  }
  
  .form-actions button:last-child {
    background-color: #e74c3c;
    color: white;
  }
  
  .form-actions button:last-child:hover {
    background-color: #c0392b;
  }
  
  .conflict-indicator {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #e74c3c;
    font-weight: bold;
  }
  </style>