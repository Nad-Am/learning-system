<template>
  <div class="card relative rounded-md bg-cardBg m-1 flex flex-col justify-between">
    <div class="card-header flex justify-between">
      <span class="text-lg font-bold m-1">{{ title }}</span>
      <span v-if="!isAnonymous" class="m-2">{{ author }}</span>
    </div>
    <div class="card-body flex-1 p-2 ease-linear overflow-hidden text-ellipsis whitespace-nowrap">
      {{ content }}
    </div>
    <div class="w-full  flex justify-between text-red-50 p-1">

        {{ createdAt }}
        <div v-if="status === 'pending' " class=" p-1 text-red-400">
          审核中
          <el-icon><RemoveFilled /></el-icon>
        </div>
        <div v-if="status === 'rejected' " class=" p-1 text-red-400">
          已拒绝
          <el-icon><WarningFilled /></el-icon>
        </div>
    </div>
    <div v-if="isOfficial" class="offical w-10 h-10"></div>
  </div>
</template>

<script setup>

defineProps({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  },
  isAnonymous: {
    type: Boolean,
    required: true
  },
  isOfficial: {
    type: Boolean,
    defalt: false
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
})

</script>

<style scoped>
.offical {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  background: url('/src//assets/image/official.png') no-repeat;
  background-size: cover;
}
</style>