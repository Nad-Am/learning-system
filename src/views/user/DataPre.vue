<template>
  <div>
    Datapre
  </div>
</template>

<script lang="ts" setup>
import { DoAxiosWithErro } from '@/api';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';

const userStore = useUserStore()

const getData = async () => {
  const res = await DoAxiosWithErro(`/study/stats`,'get',{},true)
  console.log(res)
}

onMounted(()=>{
  getData()
})

</script>

<style>

</style>