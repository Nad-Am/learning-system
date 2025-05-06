<template>
  <div class="pomodoro-container relative w-full h-full flex flex-nowrap items-center flex-col  p-6 rounded-lg shadow-md">

    <div class="absolute top-0 left-0">
      <el-button @click="goBack">返回</el-button>
    </div>

    <div class="img" v-if="!isRunning"></div>
    
    <div v-if="isRunning" class="timer-display text-8xl font-bold text-center pb-12  text-red-500">
      <span>{{ minutes }}:{{ seconds }}</span>
    </div>
    
    <div class="w-3/4 relative">
      <el-progress
        :percentage="percent"
        :stroke-width="35"
        :show-text="false"
        status="exception"
        striped
        class="w-full m-4"
      />
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white text-lg font-bold">
        {{ minutes }}:{{ seconds }}
      </div>
    </div>

    <div class="timer-controls  flex justify-center gap-8">
      <button 
        @click="startTimer" 
        :disabled="isRunning"
        class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-lg"
      >
        开始
      </button>
      <!-- <button 
        @click="pauseTimer" 
        :disabled="!isRunning"
        class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-lg"
      >
        暂停
      </button> -->
      <button 
        @click="startTimer" 
        :disabled="isRunning"
        class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-lg"
      >
        休息一会儿
      </button>
      <button 
        @click="resetTimer" 
        class="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-lg"
      >
        重置
      </button>
    </div>
    <div class="list w-3/4 h-2/3 relative overflow-y-auto m-5">
      <div class="item flex relative w-11/12  py-7 rounded-full font-light-20 justify-center items-center text-center text-2xl">
        分钟计时结束了，您的专注度如何？
       <div class="text-red-500 absolute top-1/3 right-10 text-2xl cursor-pointer">×</div>
      </div>
      <div class="item flex relative w-11/12  py-7 rounded-full font-light-20 justify-center items-center text-center text-2xl">
        分钟计时结束了，您的专注度如何？
       <div class="text-red-500 absolute top-1/3 right-10 text-2xl cursor-pointer">×</div>
      </div>
      <div class="item flex relative w-11/12  py-7 rounded-full font-light-20 justify-center items-center text-center text-2xl">
        分钟计时结束了，您的专注度如何？
       <div class="text-red-500 absolute top-1/3 right-10 text-2xl cursor-pointer">×</div>
      </div>
      <div class="item flex relative w-11/12  py-7 rounded-full font-light-20 justify-center items-center text-center text-2xl">
        分钟计时结束了，您的专注度如何？
       <div class="text-red-500 absolute top-1/3 right-10 text-2xl cursor-pointer">×</div>
      </div>
      <div class="item flex relative w-11/12  py-7 rounded-full font-light-20 justify-center items-center text-center text-2xl">
        分钟计时结束了，您的专注度如何？
       <div class="text-red-500 absolute top-1/3 right-10 text-2xl cursor-pointer">×</div>
      </div>
      <div class="item flex relative w-11/12  py-7 rounded-full font-light-20 justify-center items-center text-center text-2xl">
        分钟计时结束了，您的专注度如何？
       <div class="text-red-500 absolute top-1/3 right-10 text-2xl cursor-pointer">×</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onUnmounted, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { DoAxiosWithErro } from '@/api';

  const route = useRoute();
  const router = useRouter();

  const totalTime = 25 * 60; // 25分钟，单位为秒
  const remainingTime = ref(0);
  const isRunning = ref(false);
  let timerInterval = null;

  // 计算分钟和秒
  const minutes = computed(() => {
    return Math.floor(remainingTime.value / 60).toString().padStart(2, '0');
  });

  const seconds = computed(() => {
    return (remainingTime.value % 60).toString().padStart(2, '0');
  });

  const percent = computed(() => {
    return (remainingTime.value / totalTime) * 100;
  })

  const goBack = () => {
    router.go(-1);
  }

  // 开始计时
  const startTimer = () => {
    remainingTime.value = totalTime;
    if (!isRunning.value) {
      isRunning.value = true;
      timerInterval = setInterval(() => {
        remainingTime.value--;
        if (remainingTime.value <= 0) {
          clearInterval(timerInterval);
          isRunning.value = false;
          alert('时间到！');
        }
      }, 1000);
    }
  };

  // 暂停计时
  const pauseTimer = () => {
    remainingTime.value = 0;
    if (isRunning.value) {
      clearInterval(timerInterval);
      isRunning.value = false;
    }
  };

  // 重置计时
  const resetTimer = () => {
    clearInterval(timerInterval);
    remainingTime.value = totalTime;
    isRunning.value = false;
  };

  const getDetaile = (id) => {
    DoAxiosWithErro(`/study/tasks/${id}`,'get',{},true).then(res => {
      console.log(res);
    })
  }

  onMounted(() => {
    console.log(route.params.id);
    getDetaile(route.params.id);
  })

  // 组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(timerInterval);

  });

</script>

<style scoped>
.img{
  width: 20rem;
  height: 10rem;
  background: url('../../assets/image/pt.png') no-repeat;
  border: solid red 1px;
  border-radius: 1rem;
  background-size: cover;
}
.item{
  background: rgb(248, 215, 218);
}

.list{
  scrollbar-width: none;
}
</style>