<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">待审核帖子：</h1>
    <div class="w-11/12 m-auto mb-6 overflow-auto border-2 border-b-0 border-gray-400 rounded-lg p-2" v-for="post in List" :key="post.id"  >
      <DissCard
      :title="post.title"
      :createdAt="post.createdAt"
      :author="post.nickname"
      :isAnonymous="post.isAnonymous"></DissCard>
      <el-button type="primary" @click="checkPost(post.id,'approved')">同意</el-button>
      <el-button type="danger" @click="checkPost(post.id,'rejected')">拒绝</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DissCard  from '@/components/discussion/DissCard.vue';
import { DoAxiosWithErro } from '@/api';
import { reactive, onMounted } from 'vue';

// approved/rejected/pending  同意/拒绝/待审核

const List = reactive([])

const getDissList = async () => {
  const res = await DoAxiosWithErro('/post/pending','post',{
    pageNo:1,
    pageSize:10,
    sortBy:'',
    isAsc:false,
    isOfficial:false
  },true)
  List.push(...res.data)
}

// 审核帖子
const checkPost = async (id:number, status:string) => {
  const res = await DoAxiosWithErro(`/post/review/${id}?status=${status}`,'put',{},true)
  if(res.code === 200){
    getDissList()
  }
}

onMounted(() => {
  getDissList()
})

</script>


<style>

</style>
