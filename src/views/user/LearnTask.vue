<template>
  <div class="w-full h-full relative flex flex-wrap gap-20">
    <div @click="handleClick" class="absolute flex flex-col justify-center items-center top-0 right-0">
      <el-icon color="red" size="30px"><Opportunity /></el-icon>
      <span class="text-xs font-bold ">新建任务</span>
    </div>

    <div 
    class="bg-white absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg p-4 w-1/3" 
    v-if="FromShow"
    >
      <h1 class="text-center font-bold text-2xl mb-4">任务</h1>
      <el-form class="p-4" :model="newTask">
        <el-form-item label="任务科目">
          <el-input v-model="newTask.subject" />
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="newTask.name" />
        </el-form-item>
        <el-form-item label="任务时长(/min)">
          <el-input-number v-model="newTask.durationMinutes" :min="0" :max="100"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="comfirmed">确定</el-button>
          <el-button @click="FromShow = false; resetNewTask()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <TaskCard v-for="task in tasks" :key="task.id" :task="task" @click="handleClick(task)" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import TaskCard from '@/components/TaskCard.vue';
import { useUserStore } from '@/stores/user';
import { DoAxiosWithErro } from '@/api';
import TaskCRUD from '@/components/TaskCRUD.vue';

const tasks = reactive([
  {
    id: 1,
    title: 'Task 1',
    description: 'This is the first task',
    date: '2022-01-01',
    time: '10:00',
    status: 'completed',
    priority: 'high',
    type: 'personal',
    tags: ['tag1', 'tag2'],
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'This is the second task',
    date: '2022-01-02',
    time: '11:00',
    status: 'in progress',
    priority: 'medium',
    type: 'work',
    tags: ['tag3', 'tag4'],
  },
  {
    id: 3,
    title: 'Task 3',
    description: 'This is the third task',
    date: '2022-01-03',
    time: '12:00',
  }
])

const userStore = useUserStore()

const newTask = reactive({
  id: null,
  subject: '',
  name: '',
  durationMinutes: 0,
})

const resetNewTask = () => {
  newTask.id = null
  newTask.subject = ''
  newTask.name = ''
  newTask.durationMinutes = 0
}

const FromShow = ref(false);
const editingEvent = reactive({});

function handleClick (task) {
  if (task) {
    Object.assign(editingEvent, task);
  } else {
    resetNewTask();
  }
  FromShow.value = true;
}

const addTask = () => {
  DoAxiosWithErro(`/study/tasks?userId=${userStore.userInfo.id}`, 'post', {
    subject: newTask.subject,
    name: newTask.name,
    durationMinutes: newTask.durationMinutes,
  },true).then(res => {
    console.log(res)
  })
}

const comfirmed = () => {
  console.log(newTask)
  if(!newTask.id) {
    addTask()
  }
}

</script>

<style>

</style>