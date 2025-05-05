<template>
  <div class="w-full h-full">
    <el-row class="h-full text-white flex items-center justify-between">
        <el-col :span="18" class="h-full">
            <el-avatar :size="70" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            <span class="h-5 pb-4">{{ userStore.userInfo.nickname }}</span>
        </el-col>
        <el-col :span="2" class="flex items-center justify-center">
          <div class="flex items-center justify-center text-red-200">
            <el-icon class="my-2" color="red" size="30"><StarFilled /></el-icon>
            {{ userStore.userInfo.points }}积分
          </div>
        </el-col>
        <el-col :span="1">
            <el-button :disabled="hascheckin" color="pink" @click="CheckIn" class="w-20 p-3" type="primary">
              {{ hascheckin ? '已签到' : '签到'}}
            </el-button>
        </el-col>
        <el-col :span="2">
            <el-button color="pink" @click="turnHome" class="w-20 p-3" type="primary">退出</el-button>
        </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { DoAxiosWithErro } from '@/api'
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const hascheckin = ref(false)

const turnHome = async () => {
  userStore.logout().finally(() => {
    router.push('/')
  })
}

const CheckIn = async () => {
  DoAxiosWithErro('/users/checkin', 'post',{},true).then(() => {
    ElMessage.success('签到成功')
    hascheckin.value = true
  })
}

const checkHasCheckIn = async () => {
  DoAxiosWithErro('/users/check-today-checkin', 'get',{},true).then((res) => {
    hascheckin.value = res.data
  })
}

onMounted(() => {
  checkHasCheckIn()
})

</script>

<style>

</style>