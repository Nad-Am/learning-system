<template>
  <div class="h-screen w-screen usermian">
    <el-container class="h-full w-full">
      <el-header style="height: 10%; background: rgba(0,0,0,0);">
        <NavTop />
      </el-header>
      <el-main class="" style="height: 90%;">
        <el-container class="h-full">
          <el-aside class=" h-full">
            <MeNu :routers="routers" />
          </el-aside>
          <el-main class="h-full main">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import NavTop from '@/components/NavTop.vue';
import MeNu from '@/components/MeNu.vue';

const routers = [
    {
        router: '/user',
        name: '日程'
    },
    {
        router: '/user/learntask',
        name: '学习任务'
    },
    {
        router: '/user/chatai',
        name: 'ai小助手'
    },
    {
        name: '讨论区',
        router: '/user/discussion',
    },
    {
        router: '/user/datapre',
        name: '学习数据'
    },
    {
        router: '/user/myinfo',
        name: '设置'
    },
]

</script>

<style scoped>
.usermian {
  min-width: 1300px;
}
.main {
  border-radius: 2rem;
  overflow: auto;
  background: linear-gradient(-120deg, rgba(248, 230, 230, 0.8),rgba(12, 1, 1, 0.1));
  }
</style>