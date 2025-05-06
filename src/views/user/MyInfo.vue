<script setup>
import { onMounted, reactive,ref } from 'vue';
import { DoAxiosWithErro } from '@/api';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
    const userStore = useUserStore();
    const formRef = ref(null);
    const avatarList = reactive([]);
    const avatarSrc = ref('');
    const formInfo = reactive({
        newpass:'',
        oldpass:''
    })

    const validatePass = (rule, value, callback) => {
        const reg = /^(?=.*[a-zA-Z])(?=.*[\d])[a-zA-Z\d]{6,10}$/;
        if (value === '') {
            return callback(new Error('Please input the password'));
        }
        if (!reg.test(value)) {
            return callback(new Error("密码是至少各包含一个数字和英文的8位字符串"));
        }
        callback();
    };

    const rule = reactive({
        oldpass:[{validator:validatePass,trigger:'change'}],
        newpass:[{validator:validatePass,trigger:'change'}]
    })

    const hanlecancle = () => {
        const form = formRef.value;
        if(form) {
            form.resetFields();
        }
    }
    const handleconfirm = () => {
    const form = formRef.value;
    if (!form) {
        return;
    }
    form.validate(async (valid) => {
        if (valid) {
            console.log("thatok")
            try {
                await DoAxiosWithErro(`/users/update-password?oldPassword=${formInfo.oldpass}&newPassword=${formInfo.newpass}`, 'post',{}, true);
                ElMessage({
                    message:'修改成功',
                    typ:'success'
                })
            } catch (error) {
                console.error("请求失败：", error);
            } finally {
                form.resetFields();
            }
        } else {
            // 不显示控制台错误
            console.log("验证未通过");
        }
    });
};

avatarSrc.value = userStore.userInfo.avatarUrl;

const handleChangeAvatar = (item) => {

    if(!item.isUnlocked) {
        DoAxiosWithErro(`/avatars/exchange/${item.id}`, 'post',{}, true).then(res => {
            if(res.code === 200) {
                ElMessage({
                    message:'兑换成功',
                    type:'success'
                }) 
                DoAxiosWithErro(`/users/change-avatar/${item.id}`, 'post',{}, true).then(()=>{
                    userStore.userInfo.points = userStore.userInfo.points  - item.pointsRequired;
                    userStore.userInfo.avatarUrl = item.imageUrl;
                })
            } else {
                ElMessage({
                    message:res.message,
                    type:'error'
                })
            }
        })
        return;
    }
    const res = DoAxiosWithErro(`/users/change-avatar/${item.id}`, 'post',{}, true);
    userStore.userInfo.avatarUrl = item.imageUrl;
    console.log(res);
};

const getAvaterList = () => {
    DoAxiosWithErro('/avatars/user-avatars', 'get',{}, true).then(res => {
        avatarList.push(...res.data)
    })
}

onMounted(() => {
    getAvaterList();
})



</script>
<template>
    <div class="p-4">
        <div style="height: 100px; width: 100px;">
            <el-avatar
                :size="80"
                :src="userStore.userInfo.avatarUrl"
            />
            <el-dropdown class="custom-dropdown">
                <span>修改头像</span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item  @click="handleChangeAvatar(item)" class="relative" v-for="item in avatarList" :key="item.id">
                            <el-avatar
                                :size="40"
                                :src="item.imageUrl"
                            />
                            <div class="absolute left-1 top-2 bg-white rounded-full">
                                {{ item.pointsRequired }}
                            </div>
                            <div v-if="!item.isUnlocked" class="lock rounded-full w-8 h-8"></div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

        <div>

        </div>

        <div style="padding: 10px 0; font-weight: bold;">修改密码:</div>
        <el-form
            ref="formRef"
            :model="formInfo"
            :rules="rule"
            style="width: 70%;"
        >
        <el-input autocomplete="off" type="password" aria-hidden="true" style="display: none;"></el-input>
            <el-form-item class="w-80" label="旧密码" prop="oldpass">
                <el-input placeholder="旧密码" autocomplete="off" type="password" show-password v-model="formInfo.oldpass"></el-input>
            </el-form-item>
            <el-form-item class="w-80" label="新密码" prop="newpass">
                <el-input placeholder="请输入新密码" name="newpass" autocomplete="off" type="password" show-password v-model="formInfo.newpass"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleconfirm">确认修改</el-button>
                <el-button @click="hanlecancle">取消修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style  scoped>
.custom-dropdown{
  border: 0;
  outline: none;
  --el-dropdown-menu-focus-border-color: transparent;
}
.lock {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: url("/src/assets/image/lock.png");
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
