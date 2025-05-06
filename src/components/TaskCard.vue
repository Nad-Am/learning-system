<template>
  <div class="h-1/3 relative bg-gray-50 p-4 rounded-lg shadow-md border border-gray-100">
    <div class="flex mb-1">
      <span class="font-bold text-gray-600">科目：</span>
      <span class="text-gray-700">{{ task.subject }}</span>
    </div>

    <div class="flex mb-1">
      <span class="font-bold text-gray-600">任务名称：</span>
      <span class="text-gray-700">{{ task.name }}</span>
    </div>

    <div class="flex mb-1">
      <span class="font-bold text-gray-600">总学习时间：</span>
      <span class="text-gray-700">{{ task.durationMinutes ? task.durationMinutes : 0}} 分钟</span>
    </div>

    <div class="flex mb-1">
      <span class="font-bold text-gray-600">创建时间：</span>
      <span class="text-gray-700">{{ formatDate(task.createdAt) }}</span>
    </div>

    <div class="flex">
      <span class="font-bold text-gray-600">完成的番茄数：</span>
      <span class="text-gray-700">{{ task.completedPomodoros }}</span>
    </div>

    <div class="mt-1 rounded-lg">
      <el-button @click="handleUpdate(task)">修改任务</el-button>
      <el-button @click="handleEnterTomato(task)">番茄时间</el-button>
    </div>

    <div class="absolute top-2 right-2">
      <el-button @click="$emit('delete', task.id)" type="danger" :icon="Delete" circle />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { Delete } from '@element-plus/icons-vue';

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const emits = defineEmits(['update','entertomato','delete']);


const handleUpdate = (task) => {
  emits('update',task);
};

const handleEnterTomato = (task) => {
  emits('entertomato',task);
}

// 格式化日期函数
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<style scoped>
/* 添加自定义样式以增强美观性 */
.bg-gray-50 {
  background-color: #f9fafb;
  transition: all 0.3s ease;
}

.bg-gray-50:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.font-bold {
  color: #374151;
}

.text-gray-700 {
  color: #4b5563;
}

/* 添加渐变背景 */
.bg-gradient {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}
</style>