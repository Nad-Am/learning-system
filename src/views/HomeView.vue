<script setup>
import { RouterLink } from 'vue-router';
import LogIn from '@/components/LogIn.vue';
import { reactive } from 'vue';
import RegiSter from '@/components/RegiSter.vue';
const data = reactive({
  isShow:'login'
})
const handleT = (mess) =>{
    data.isShow = mess
}

</script>

<template>
  <div class="Index">
    INDE
    <router-link to="/">home</router-link>
    <router-link to="/user">patient</router-link>
    <router-link to="/doctor">doctor</router-link>
    <router-link to="/admin">admin</router-link>
    <div class="login">
      <log-in @turnLoR="handleT" v-show="data.isShow === 'login'"></log-in>
      <regi-ster @turnLoR="handleT" v-show="data.isShow === 'register'" ></regi-ster>
    </div>
  </div>
</template>

<style  scoped>
.Index{
  width: 100vw;
  height: 100vh;
  background: url(../assets/image/bg.png) no-repeat;
  background-size: cover;
  position: relative;
}
.login{
  width: 500px;
  height: 400px;
  padding:1rem;
  background: white;
  border-radius: 1rem;
  position: absolute;
  top: 40%;
  left: 80%;
  transform: translate(-80%,-40%);
}
</style>