<template>
  <div>
    <el-menu
     :router="true"
     active-text-color="#ffd04b"
     background-color="#545c64"
     class="el-menu-vertical-demo"
     default-active="0"
     text-color="#fff"
     style="background-color: rgba(255, 255, 255, 0);"
     mode="horizontal"
    >
    <el-menu-item class="item" v-for="item in routers" :key="item.router" :index="item.router">{{item.name}}</el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>

defineProps({
    routers: {
        type: Array,
        required: true
    }
})



</script>

<style>
</style>