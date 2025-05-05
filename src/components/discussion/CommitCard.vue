<template>
  <div class="commit relative mt-4 m-1">
    <el-button class="absolute top-1 right-1 opacity-0" type="primary" size="small" @click="handlereply(comment.id, comment.nickname)">回复</el-button>
    <div class="font-bold m-1">{{ comment.nickname }}</div>
    <div class="m-1 ml-3">{{ comment.content }}</div>
    <div v-show="comment.replies && comment.replies.length > 0 && opORmore">
      <div v-for="reply in comment.replies" :key="reply.id" class="ml-5 relative">
        <el-button class="absolute top-0 right-0" type="primary" size="small" @click="handlereply(reply.id, reply.nickname,true)">回复</el-button>
        <div class="font-bold m-1">{{ reply.nickname }} <el-icon><CaretRight /></el-icon> {{ reply.toUserNickname }}</div>
        <div class="m-1 ml-3">{{ reply.content }}</div>
      </div>
      <div 
        v-show="comment.hasMore" @click="emit('fetchReplies', comment.id, comment.pageNo)" 
        class="w-full text-sm flex justify-center items-center cursor-pointer"
      >
        <el-icon><ArrowDown /></el-icon>
        展开更多
    </div>
    <div 
        v-show="!comment.hasMore"
        class="w-full text-sm flex justify-center items-center cursor-pointer"
      >
        没有更多了
    </div>
    </div>
    <div 
      v-show="comment.replies && comment.replies.length > 0" 
      @click="opORmore = !opORmore" 
      class="w-full text-sm flex items-center cursor-pointer"
    >
        <el-icon v-show="!opORmore"><ArrowDown /></el-icon>
        <el-icon v-show="opORmore"><ArrowUp /></el-icon>
        {{ opORmore ? '收起' : '展开' }}{{ comment.replies.length }}条回复
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted, defineEmits } from 'vue'

const props = defineProps({
  comment:{
    type: Object,
    required: true
  }
})

const opORmore = ref(false)

const emit = defineEmits(['handlereply', 'fetchReplies'])

const handlereply = (id, nickname, isReply = false) => {
  emit('handlereply', id, nickname, isReply)
}

onMounted(() => {
  console.log('commit card mounted:',props)
})

</script>

<style scoped>
.commit {
  border: 1px solid #ccc;
  border-bottom: 0;
  border-radius: 5px;
  padding: 10px;
}
.commit:hover .el-button {
  opacity: 1;
}
</style>