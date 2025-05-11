<template>
  <div class="w-full h-full">


    <!-- 所有头像： -->
    <!-- <div class="m-4">
      <p class="text-xl font-bold mb-2">所有头像：</p>
      <div class="flex flex-wrap  gap-3 items-center"> 
        <div class="flex flex-col gap-2 items-center justify-center p-2" v-for="item in avaterList" :key="item">
          <el-avatar :src="item.imageUrl"></el-avatar>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div> -->

    <!-- 用户可用头像 -->
    <div class="w-full h-1/3  overflow-y-auto  p-4">
      <p class="text-xl font-bold mb-2">全部头像</p>
      <div class="flex flex-wrap  gap-3 items-center"> 
        <div
         class="flex relative flex-col gap-2 items-center justify-center p-2"
         v-for="item in userAvaterList" :key="item"
         @click="deleteAvater(item)"
         >
          <el-avatar size="large" :src="item.imageUrl"></el-avatar>
          <div v-if="!item.isUnlocked" class="lock rounded-full w-8 h-8"></div>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>

    <!-- 上传头像 -->
    <div class="w-full border-4 border-b-0 border-red-100 rounded-lg bg-cardBg h-2/3 p-4">
      <p class="text-xl font-bold mb-2">添加新头像</p>
      <el-avatar style="margin: 1rem; margin-left: 5rem;" :src="newAvater.imageUrl"></el-avatar>
      <el-form style="position: relative;" :model="newAvater" label-width="120px">
        <el-form-item label="头像名称">
          <el-input style="width: 20%;" v-model="newAvater.name"></el-input>
        </el-form-item>
        <el-form-item label="兑换金币">
          <el-input-number v-model="newAvater.pointsRequired" :min="10" :max="100">
            <template #prefix>
              <div class="money w-5 h-5"></div>
            </template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="是否设置为默认">
          <el-radio-group v-model="isDefRef">
            <el-radio value="1" size="large">是</el-radio>
            <el-radio value="0" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像图片">
          <div>
            <input class="absolute hidden" accept="image/*" type="file" id="fileInput" @change="handleFileUpload" />
            <label  for="fileInput" class="el-button el-button--primary" >
              {{ newAvater.imageUrl ? '重新选择' : '选择图片' }}
            </label>
          </div>
        </el-form-item>
        <el-button :disabled="isfetching" class="m-2 ml-4 absolute bottom-0 left-1/4" @click="uploadAvatar">上传头像</el-button>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DoAxiosWithErro } from '@/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

const isfetching = ref(false);
const avaterList = reactive([])
const userAvaterList = reactive([])
const file = ref(null);
const isDefRef = ref('0'); // 用于计算是否（1/0）为默认头像
const newAvater = reactive({
  id:'',
  name: '',
  imageUrl: '',
  pointsRequired: 0,
  isUnlocked: false,
  isDefault: isDefRef.value === '1' ? true : false
})

//选择图片
const handleFileUpload = (event) => {
  console.log("上传成功");
  newAvater.imageUrl = URL.createObjectURL(event.target.files[0]);
  file.value = event.target.files[0];
  console.log(newAvater.imageUrl);
};

// 上传头像
const uploadAvatar = async () => {
  if (!file.value || !newAvater.name || !newAvater.pointsRequired) {
    ElMessage.warning('请填写完整信息');
    return;
  }
  isfetching.value = true;
  const formData = new FormData();
  formData.append('file', file.value);
  await DoAxiosWithErro(`/avatars/upload?name=${newAvater.name}&pointsRequired=${newAvater.pointsRequired}&isDefault=${newAvater.isDefault}`, 
    'post', formData, true).then(res => {
    reset()
    ElMessage.success('上传成功');
    userAvaterList.push(res.data)
  }).finally(() => {
    isfetching.value = false;
  })
}

const deleteAvater = (item) => {
  ElMessageBox.confirm('确定要删除该头像吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const id = item.id;
    console.log(id);
    DoAxiosWithErro(`/avatars/${id}`, 'delete', {}, true).then(res => {
      ElMessage.success('删除成功');
      const index = userAvaterList.indexOf(item);
      console.log(index,id);
      userAvaterList.splice(index, 1);
    })
  })
}

const reset = () => {
  newAvater.name = '';
  newAvater.imageUrl = '';
  newAvater.pointsRequired = 0;
  newAvater.isDefault = false;
}



onMounted(() => {
  
  DoAxiosWithErro('/avatars/list','get',{},true).then(res => {
    console.log(res);
    avaterList.push(...res.data)
  })

  DoAxiosWithErro('/avatars/user-avatars','get',{},true).then(res => {
    console.log(res);
    userAvaterList.push(...res.data)
  })
})
</script>

<style scoped>
.lock {
  position: absolute;
  top: 2.5rem;
  right: 0.5rem;
  background: url("/src/assets/image/lock.png");
  background-size: cover;
  background-repeat: no-repeat;
}
.money {
  background: url("/src/assets/image/money.png");
  background-size: cover;
  background-repeat: no-repeat;
}

</style>