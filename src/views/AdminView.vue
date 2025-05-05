<template>
  <div class="h-screen w-screen">
    <el-container class="h-full w-full">
      <el-header style="height: 10%; background: rgba(0,0,0,0);">
        <NavTop />
      </el-header>
      <el-main class="" style="height: 90%;">
        <el-container class="h-full">
          <el-aside class=" h-full">
            <MeNu :routers="routers"/>
          </el-aside>
          <el-main class="h-full main ">
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
    router:'/admin',
    name: '用户管理'
  },
  {
    router:'/admin/megdiscussion',
    name: '论坛'
  },
  {
    router:'/admin/magediss',
    name: '论坛管理'
  }
]

</script>

<style scoped>
.main {
  border-radius: 2rem;
  overflow: auto;
  background: linear-gradient(-120deg, rgba(248, 230, 230, 0.8),rgba(12, 1, 1, 0.1));
  }
</style>