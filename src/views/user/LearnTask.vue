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
          <el-input-number v-model="newTask.durationMinutes" :min="0" :max="100"/>
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
      />
      <el-empty description="暂无任务" v-if="tasks.length === 0" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import TaskCard from '@/components/TaskCard.vue';
import { useUserStore } from '@/stores/user';
import { DoAxiosWithErro } from '@/api';
import { useRouter } from 'vue-router';
import TaskCRUD from '@/components/TaskCRUD.vue';

const router = useRouter()

const tasks = reactive([
  {
      id: 1, // 任务ID
      userId: 1001, // 用户ID
      subject: "Mathematics", // 科目
      name: "Calculus Homework", // 任务名称
      durationMinutes: 120, // 计划时长(分钟)
      createdAt: "2025-05-01T09:30:00Z", // 创建时间
      updatedAt: "2025-05-05T10:45:00Z", // 更新时间
      totalStudyMinutes: 90, // 总学习时间（分钟）
      completedPomodoros: 3 // 完成的番茄数
  },
  {
      id: 2, // 任务ID
      userId: 1001, // 用户ID
      subject: "Physics", // 科目
      name: "Quantum Mechanics", // 任务名称
      durationMinutes: 180, // 计划时长(分钟)
      createdAt: "2025-05-02T11:00:00Z", // 创建时间
      updatedAt: "2025-05-06T12:30:00Z", // 更新时间
      totalStudyMinutes: 150, // 总学习时间（分钟）
      completedPomodoros: 5 // 完成的番茄数
  },
  {
      id: 3, // 任务ID
      userId: 1001, // 用户ID
      subject: "Chemistry", // 科目
      name: "Organic Chemistry", // 任务名称
      durationMinutes: 90, // 计划时长(分钟)
      createdAt: "2025-05-03T13:00:00Z", // 创建时间
      updatedAt: "2025-05-07T14:15:00Z", // 更新时间
      totalStudyMinutes: 75, // 总学习时间（分钟）
      completedPomodoros: 2 // 完成的番茄数
  },
])

const userStore = useUserStore()

const newTask = reactive({
  id: null,
  subject: '',
  name: '',
  durationMinutes: 0,
})


const FromShow = ref(false);
const editingEvent = reactive({});

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

const addTask = () => {
  DoAxiosWithErro(`/study/tasks`, 'post', {
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

const enterTomato = (task) => {
  router.push({
    name: 'tomato',
    params: {
      id: task.id
    }
  })
}


</script>

<style>

</style>