<template>
  <div class="w-full pt-10 h-full relative flex flex-wrap gap-20">

    <!-- 新增按钮 -->
    <div @click="handleClick" class="absolute flex flex-col justify-center items-center top-0 right-0">
      <el-icon color="red" size="30px"><Opportunity /></el-icon>
      <span class="text-xs font-bold ">新建任务</span>
    </div>

    <!-- 新增表单 -->
    <div 
    class="bg-white z-10 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg p-4 w-1/3" 
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
          <el-input-number v-model="newTask.durationMinutes" :min="25" :max="150"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="comfirmed">确定</el-button>
          <el-button @click="FromShow = false; resetNewTask()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="w-full flex-1 flex gap-10">
      <TaskCard
       v-for="task in tasks" 
       :key="task.id" :task="task" 
       @update="handleClick"
       @entertomato="enterTomato"
       @delete="deleteTask"
      />
      <el-empty description="暂无任务" v-if="tasks.length === 0" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import TaskCard from '@/components/TaskCard.vue';
import { useUserStore } from '@/stores/user';
import { DoAxiosWithErro } from '@/api';
import { useRouter } from 'vue-router';
import TaskCRUD from '@/components/TaskCRUD.vue';

const router = useRouter()

const tasks = reactive([])

const userStore = useUserStore()

const newTask = reactive({
  id: null,
  subject: '',
  name: '',
  durationMinutes: 0,
})


const FromShow = ref(false);


const resetNewTask = () => {
  newTask.id = null
  newTask.subject = ''
  newTask.name = ''
  newTask.durationMinutes = 0
}

function handleClick (task) {
  if (task) {
    Object.assign(newTask, task);
  } else {
    resetNewTask();
  }
  FromShow.value = true;
}

const getTasks = () => {
  DoAxiosWithErro(`/study/tasks`, 'get', {},true).then(res => {
    tasks.splice(0, tasks.length)
    tasks.push(...res.data)
  })
}

const addTask = () => {
  DoAxiosWithErro(`/study/tasks`, 'post', {
    subject: newTask.subject,
    name: newTask.name,
    durationMinutes: newTask.durationMinutes,
  },true).then(res => {
    tasks.push(res.data)
  })
}


const comfirmed = () => {
  if(!newTask.id) {
    addTask()
  } else {
    updateTask()
  }
  FromShow.value = false
}

const updateTask = () => {
  DoAxiosWithErro(`/study/tasks/${newTask.id}`, 'put', {
    id: newTask.id,
    subject: newTask.subject,
    name: newTask.name,
    durationMinutes: newTask.durationMinutes,
  },true).then(res => {
    const index = tasks.findIndex(task => task.id === newTask.id)
    tasks.splice(index, 1, res.data)
  })
}

const deleteTask = (taskId) => {
  DoAxiosWithErro(`/study/tasks/${taskId}`, 'delete', {},true).then(res => {
    const index = tasks.findIndex(t => t.id === task.id)
    tasks.splice(index, 1)
  })
}

const enterTomato = (task) => {
  router.push({
    name: 'tomato',
    params: {
      id: task.id
    }
  })
}

onMounted(() => {
  getTasks()
})


</script>

<style>

</style>