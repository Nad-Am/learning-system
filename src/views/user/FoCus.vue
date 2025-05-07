<template>
  <div @click="isOver = false" class="pomodoro-container relative w-full h-full flex flex-nowrap items-center flex-col  p-6 rounded-lg shadow-md">

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
        :disabled="isRunning || isFetch"
        class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-lg"
      >
        开始番茄{{ tomtoTime }}分钟
      </button>
      <button 
        @click="pauseTimer" 
        :disabled="!isRunning"
        class=" bg-red-500 hover:bg-red-400 text-white px-6 py-4 rounded-lg"
      >
        停止
      </button>
      <button 
        @click="startBreak" 
        class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-lg"
      >
        休息{{ breakTime }}分钟
      </button>
    </div>
    <div class="w-3/4 flex justify-center m-5">
        <div class="m-2 font-bold text-white text-lg">
          <span>番茄：</span>
          <el-input-number v-model="tomtoTime" :min="1" :max="10" />
          <span>分钟</span>
        </div>
        <div class="m-2 font-bold text-white text-lg">
          <span>休息：</span>
          <el-input-number v-model="breakTime" :min="1" :max="10" />
          <span>分钟</span>
        </div>
    </div>
    <div v-loading="isLoading" class="list w-3/4 h-2/3 relative overflow-y-auto m-5">
      <div v-for="history in historyList" :key="history.id" class="item mb-2 flex relative w-11/12  py-7 rounded-full justify-center items-center text-center ">
        {{ history.endTime }}分钟计时结束了，您的专注度如何？
      </div>
      <el-empty v-if="historyList.length === 0" description="暂无历史记录" />
    </div>

    <div 
     class="overCard absolute top-1/2 left-1/2 w-2/3 h-2/3 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-10 rounded-lg" 
     v-show="isOver"
    >
      时间到！
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onUnmounted, onMounted, reactive } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { DoAxiosWithErro } from '@/api';
  import { useUserStore } from '@/stores/user';

  const isOver = ref(false);
  const isFetch = ref(false);
  const isLoading = ref(false);
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();

  const tomtoTime = ref(0);
  const breakTime = ref(0);

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
    isFetch.value = true;
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
      totalTime.value = tomtoTime.value * 60;
      remainingTime.value = tomtoTime.value * 60;
      if (!isRunning.value) {
      isRunning.value = true;
      timerInterval = setInterval(() => {
          remainingTime.value--;
          if (remainingTime.value <= 0) {
            fetchOverTomot();
            clearInterval(timerInterval);
            isRunning.value = false;
            isOver.value = true;
          }
        }, 1000);
      }
    }).finally(() => {
      isFetch.value = false;
    })
  };

  // 暂停计时
  const pauseTimer = async () => {

    if (isRunning.value) {

      fetchOverTomot();

      resetTimer();
    }

  };

  // 重置计时
  const resetTimer = () => {
    clearInterval(timerInterval);
    remainingTime.value = 0;
    isRunning.value = false;
  };


  const fetchOverTomot = async () => {
    console.log('fetchOverTomotOP');

    const id = sessionId.value || await getNowTom();
    
    if(!id) return;

    const res = await DoAxiosWithErro(`/study/sessions/${id}/complete`,'post',{},true)
    console.log('fetchOverTomot',res);
    historyList.unshift(res.data);
    sessionId.value = null;

  }

  const startBreak = async () => {
    
    await fetchOverTomot();

    isBreak.value = true;
    remainingTime.value =  breakTime.value * 60;
    totalTime.value = breakTime.value * 60;
    if (!isRunning.value) {
      isRunning.value = true;
      timerInterval = setInterval(() => {
          remainingTime.value--;
          if (remainingTime.value <= 0) {
            clearInterval(timerInterval);
            isRunning.value = false;
            isOver.value = true;
            isBreak.value = false;
          }
        }, 1000);
    }
  }

  const getDetaile = (id) => {
    DoAxiosWithErro(`/study/tasks/${id}`,'get',{},true).then(res => {
      console.log(res);
    })
  }

  const getTomoList = (id) => {
    isLoading.value = true;
    DoAxiosWithErro(`/study/tasks/${id}/sessions`,'get',{},true).then(res => {
      historyList.splice(0,historyList.length)
      historyList.push(...res.data)
    }).finally(() => {
      isLoading.value = false;
    })
  }

  const getNowTom = async () => {
    const res = await fetch('/api/study/sessions/current',{
      method: 'GET',
      headers:{
        'sa-token-authorization': `${userStore.userToken}`
      }
    });
    const data = await res.json();
    sessionId.value = data.data?.id || null;
  }


  onMounted(() => {
    console.log(route.params.id);
    getDetaile(route.params.id);
    getTomoList(route.params.id);
    getNowTom();

    console.log(historyList);
  })

  // 组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(timerInterval);
    fetchOverTomot();
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
.overCard {
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, white, pink);
    color: rgb(243, 30, 30);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 1);
    text-align: center;
    font-size: 4rem;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);
    font-weight: bold;
    z-index: 100;
    transition: all 0.3s ease;
    animation: float 2s ease-in-out infinite, pulse 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% {
        font-weight: bold;
        transform: translate(-50%, -50%);
    }
    50% {
      font-weight: normal;
        transform: translate(-50%, -55%);
    }
}

@keyframes pulse {
    0%, 100% {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    50% {
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        transform: translate(-50%, -50%) scale(1.05);
    }
}
</style>