<template>
  <div>
    <el-menu
     :router="true"
     default-active="0"
     style="background-color: rgba(255, 255, 255, 0);"
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
.item{
    border: 1px solid #000;
    border-radius: 10px;
    margin: 1rem;
    background: linear-gradient(45deg,rgba(252, 237, 237, 0.8),rgba(241, 138, 138, 0.5));
}
</style>