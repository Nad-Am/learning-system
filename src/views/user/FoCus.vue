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
        {{ isBreak ? '休息时间' :'' }} {{ minutes }}:{{ seconds }}
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
      <button 
        @click="pauseTimer" 
        :disabled="!isRunning"
        class=" bg-red-500 hover:bg-red-400 text-white px-6 py-4 rounded-lg"
      >
        停止
      </button>
      <button 
        :disabled="!sessionId"
        @click="startBreak" 
        class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-lg"
      >
        休息一会儿
      </button>
    </div>
    <div class="list w-3/4 h-2/3 relative overflow-y-auto m-5">
      <div v-for="history in historyList" :key="history.id" class="item flex relative w-11/12  py-7 rounded-full justify-center items-center text-center ">
        {{ history.endTime }}分钟计时结束了，您的专注度如何？
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onUnmounted, onMounted, reactive } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { DoAxiosWithErro } from '@/api';

  const route = useRoute();
  const router = useRouter();

  const sessionId = ref(null);
  const totalTime = ref(25 * 60); // 25分钟
  const remainingTime = ref(0);
  const isRunning = ref(false);
  let timerInterval = null;

  const historyList = reactive([]);

  const isBreak = ref(false);

  // 计算分钟和秒
  const minutes = computed(() => {
    return Math.floor(remainingTime.value / 60).toString().padStart(2, '0');
  });

  const seconds = computed(() => {
    return (remainingTime.value % 60).toString().padStart(2, '0');
  });

  const percent = computed(() => {
    return (remainingTime.value / totalTime.value) * 100;
  })

  const goBack = () => {
    router.go(-1);
  }

  // 开始计时
  const startTimer = () => {
    if(sessionId.value){
      DoAxiosWithErro(`/study/sessions/${sessionId.value}/complete`,'post',{},true).then(res =>{
        sessionId.value = null;
      })
    }

    DoAxiosWithErro('/study/sessions/start','post',{
      id:null,
      taskId: route.params.id,
      sessionType: 'worke',
      durationMinutes: 25
    },true).then(res => {
      sessionId.value = res.data.id;
      resetTimer();
      totalTime.value = 25 * 60;
      remainingTime.value = 25 * 60;
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
    })
  };

  // 暂停计时
  const pauseTimer = async () => {

    await getNowTom();

    if(isBreak.value){
      isRunning.value = false;
      resetTimer();
      remainingTime.value = 0;
      return;
    }
    
    remainingTime.value = 0;
    if (isRunning.value) {
      clearInterval(timerInterval);
      isRunning.value = false;
      DoAxiosWithErro(`/study/sessions/${sessionId.value}/complete`,'post',{},true).then(res =>{
        console.log(res);
        historyList.unshift(res.data)
        sessionId.value = null;
      })
    }

  };

  // 重置计时
  const resetTimer = () => {
    clearInterval(timerInterval);
    remainingTime.value = totalTime;
    isRunning.value = false;
  };

  const startBreak = () => {
    isBreak.value = true;
    remainingTime.value = 5 * 60;
    totalTime.value = 5 * 60;
  }

  const getDetaile = (id) => {
    DoAxiosWithErro(`/study/tasks/${id}`,'get',{},true).then(res => {
      console.log(res);
    })
  }

  const getTomoList = (id) => {
    DoAxiosWithErro(`/study/tasks/${id}/sessions`,'get',{},true).then(res => {
      historyList.splice(0,historyList.length)
      historyList.push(...res.data)
    })
  }

  const getNowTom = () => {
    DoAxiosWithErro('/study/sessions/current','get',{},true).then(res => {
      sessionId.value = res.data.id || null;
    })
  }

  onMounted(() => {
    console.log(route.params.id);
    getDetaile(route.params.id);
    getTomoList(route.params.id);
    getNowTom();
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