<template>
  <div class="forum relative pt-10">

    <div v-if="!isDetail" class="absolute z-10 top-0 left-0 w-5/6 flex justify-between">
      <el-tabs v-model="activeTab"  class="demo-tabs">
        <el-tab-pane :disabled="isfetching" name="all" class="w-full tab-text" >
          <template #label>
            <span class="custom-tabs-label">
              <span class="text-white font-bold">全部</span>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane :disabled="isfetching" name="official" class="w-full tab-text-official">
          <template #label>
            <span class="custom-tabs-label">
              <span class="text-white font-bold">官方</span>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane :disabled="isfetching" name="consultation" class="w-full tab-text-official">
          <template #label>
            <span class="custom-tabs-label">
              <span class="text-white font-bold">考研资讯</span>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane :disabled="isfetching" name="normal" class="w-full tab-text-normal">
          <template #label>
            <span class="custom-tabs-label">
              <span class="text-white font-bold">学习交流</span>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane :disabled="isfetching" name="my" class="w-full tab-text-normal">
          <template #label>
            <span class="custom-tabs-label">
              <span class="text-white font-bold">我的</span>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-input
        v-model="inputValue"
        style="width: 240px; height: 30px;"
        placeholder="搜索"
      >
        <template #append>
          <el-button @click="searchPost" :icon="Search" />
        </template>
      </el-input>
    </div>

    <div v-if="activeTab === 'my' && role !== 'admin' && !isDetail" class="w-1/6 absolute z-10 top-8 right-1/4 flex flex-col items-center">
      <el-tabs v-model="myactiveTab"  class="demo-tabs">
        <el-tab-pane :disabled="isfetching" name="approved" class="w-full tab-text" >
          <template #label>
            <span class="custom-tabs-label">
              <span class="text-white font-bold">已发布</span>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane :disabled="isfetching" name="pending" class="w-full tab-text-official">
          <template #label>
            <span class="custom-tabs-label">
              <span class="text-white font-bold">待审核</span>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane :disabled="isfetching" name="rejected" class="w-full tab-text-official">
          <template #label>
            <span class="custom-tabs-label">
              <span class="text-white font-bold">已拒绝</span>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 贴子列表 -->
    <div v-loading="isfetching" @scroll="getMorePostList" ref="postArea" v-if="!isDetail" class="listArea w-full h-full pt-10 p-4 relative flex gap-3 flex-col items-center overflow-y-auto">
      <!-- 发布帖子按钮 -->
      <div class="addIcon w-8 h-8" @click="isAdd = true"></div>

      <!-- 帖子发布叠层 -->
      <div v-if="isAdd" class="absolute z-10 top-1/3 right-1/2 w-2/3 h-2/3 bg-cardBg3 rounded-lg translate-x-1/2 -translate-y-1/3">
        <!-- 取消发布 -->
        <el-button @click="quitAdd" class="absolute top-4 right-4" size="40" type="danger" :icon="Close" circle />

        <h1 class="text-3xl font-bold text-center m-5 mt-16">发布帖子</h1>
        <el-form class="w-2/3 h-2/3 m-auto mt-10" label-width="80px" :model="newPost">
          <el-form-item label="标题">
            <el-input v-model="newPost.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <textarea v-model="newPost.content" class="w-full ml-1 h-15 resize-none focus:outline-none" placeholder="请输入内容"></textarea>
          </el-form-item>
          <el-form-item label="是否匿名">
            <el-switch v-model="newPost.isAnonymous" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-if="role === 'admin'" v-model="newPostType" class="ml-1">
              <el-radio :label="0">官方通知</el-radio>
              <el-radio :label="1">考研咨询</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="isaddPosting" type="primary" @click="addPost">发布</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div v-for="post in postList" :key="post.id"  class="postItem relative flex flex-col gap-3 items-center" style="width: 70%;">
        <DissCard 
          style="width: 100%; height: 120px;"
          :title="post.title"
          :createdAt="post.createdAt"
          :author="post.nickname"
          :isAnonymous="post.isAnonymous"
          :isOfficial="post.isOfficial"
          :content="post.content"
          :status="post.status"
          @click="getPostDetail(post)"
          />
          <el-button v-if="role === 'admin' || activeTab === 'my'" @click="deletePost(post.id)" class="delet p-1 absolute bottom-0 right-0" type="danger">删除</el-button>
      </div>

      <el-empty v-if="postList.length === 0" description="暂无帖子" />
    </div>

    <!-- 贴子详情 -->
     <div v-if="isDetail" 
     class="w-full h-full p-10 relative flex gap-3 flex-col justify-center items-center"
     >

       <!-- 返回按钮 -->
       <el-button class="w-20 absolute top-0 left-4" type="primary" plain @click="goToBack">返回</el-button>

       <!-- 内容展示区 -->
       <div class="w-2/3 h-1/2">
         <div class="flex justify-between w-full">
           <div class="text-4xl font-bold">{{ postDetail.title }}</div>
           <div>
             <div>作者：{{ postDetail.nickname }} <el-button type="danger" @click="banUser(postDetail?.id)" v-if="role === 'admin'">封禁</el-button></div>
             <div>发布时间：{{ postDetail.createdAt }}</div>
           </div>
         </div>
         <div class="content text-xl mt-4 w-full h-4/6  overflow-y-auto">
          <p class="text-xl font-bold mb-2">内容:</p>
          {{ postDetail.content }}
         </div>
       </div>

       <!-- 评论区 -->
       <div class=" w-2/3 m-1 h-1/2 relative flex gap-3 flex-col items-center">
          <div class="font-bold self-start">回复区：</div>
          <el-button class="absolute top-0 right-0" type="primary" @click="postCommit" >发表评论</el-button>

          <!-- 评论列表 -->
          <div ref="commentArea" @scroll="getMoreCommentList" class="comlist w-full h-2/3 overflow-y-auto">
            <CommitCard 
              v-for="comment in commentList" 
              :comment="comment" 
              :key="comment.id"
              @handlereply="reply"
              @fetch-replies="fetchReplies"
            />
            <div v-if="fetchMore" class="w-full h-1/6">加载中。。。</div>
          </div>

          <!-- 评论框 -->
          <div v-if="toReply" class="w-full relative bg-cardBg h-1/3 flex flex-col justify-center items-center">
            <el-button @click="toReply = false; review = ''" class="absolute top-0 right-5" type="danger" :icon="Close" circle />
            <textarea
              v-model="review"
              style="width: 80%; height: 100%; border: 1px solid #ccc; border-radius: 1rem; padding: 8px; resize: none; box-sizing: border-box;"
              class="focus:outline-none"
              :placeholder="placeTexts"></textarea>
            <div class="flex justify-center items-center gap-1 w-1/12 h-full">
              <el-button @click="commit(false)" :disabled="!couldSubmit" class="w-16 h-10" type="primary" round >评论</el-button>
              <el-button @click="commit(true)" :disabled="!couldSubmit" class="w-16 h-10" type="primary" round >匿名评论</el-button>
            </div>
          </div>
          
       </div>
       

     </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue';
import DissCard from '@/components/discussion/DissCard.vue';
import CommitCard from '@/components/discussion/CommitCard.vue';
import { DoAxiosWithErro } from '@/api';
import { ElMessage } from 'element-plus';
import { Close } from '@element-plus/icons-vue';
import { Search } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const userId = userStore.userInfo?.id;
const role = userStore.userInfo?.role;

const newPostType = ref(0); // 0: 官方 1: 考研咨询 2: 交流讨论

const myactiveTab = ref('approved');
const activeTab = ref('all')
const inputValue = ref('')
const isSearch = ref(false)
const isaddPosting = ref(false)
const isfetching = ref(false) // 是否正在获取

const postList = reactive([]); // 贴子列表
const isDetail = ref(false); // 是否进入贴子详情
const isAdd = ref(false); // 是否进入发布贴子
const fetchMore = ref(false); // 是否加载更多评论
const hasMore = ref(true); // 是否还有更多评论
const toReply = ref(false); // 是否进入评论框


const postId = ref(undefined); // 贴子id
const targetId = ref(undefined); // 评论id
const review = ref(''); // 评论内容
const couldSubmit = ref(true); // 是否可以提交评论 即是否展示提交框
const pageNo = ref(1); // 评论页数
const commentArea = ref(null);
const postArea = ref(null);
const postPageNo = ref(1); // 贴子页数
const hasPostMore = ref(true); // 是否还有更多贴子

const placeTexts = ref('请输入发送的评论');

// 贴子详情
const postDetail = reactive({
  title: '',
  content: '',
  createdAt: '',
  nickname: '',
  isAnonymous: false
});

//新增帖子的信息
const newPost = reactive({
  title: '',
  content: '',
  isAnonymous: false
})

const commentList = reactive([]);

watch([myactiveTab,activeTab],() => {
  postPageNo.value = 1;
  hasPostMore.value = true;
  console.log(activeTab.value,'activeTab');
  postList.splice(0,postList.length);
  getList();
})


const banUser = async (postId) => {

  DoAxiosWithErro(`/post/ban-user/post/${postId}`,'post',{},true).then(() => {
      ElMessage.success("已经成功封禁")
  });
}

const deletePost = async (id) => {
    DoAxiosWithErro(`/post/${id}`,'delete',{},true).then(() => {
      ElMessage.success("已经成功删除")
      const index = postList.findIndex((item) => item.id === id);
      postList.splice(index,1);
    });
}

// 获取贴子列表
const getList = async () => {
  console.log('getList',activeTab.value);
  let res;
  isfetching.value = true;
  if(activeTab.value === 'my') {
    res = await DoAxiosWithErro('/post/my','post',{
      pageNo: postPageNo.value,
      pageSize: 10,
      status: myactiveTab.value,
    },true).finally(() => {
      isfetching.value = false;
    })
  } else {
    res = await DoAxiosWithErro('/post/list','post',{
      pageNo: postPageNo.value,
      pageSize: 10,
      sortBy: 'time',
      isAsc: true,
      userId: activeTab.value === 'my' ? userId : null,
      titleKeyword: isSearch.value ? inputValue.value : '',
      status: role === 'admin' ? 'approved' : null,
      isOfficial: (activeTab.value === 'official' || activeTab.value === 'consultation') ? true : activeTab.value === 'normal' ?false : null,
      category: activeTab.value === 'official' ? 0 : activeTab.value === 'consultation' ? 1 : activeTab.value === 'normal' ? 2 : null
    },true).finally(() => {
      isfetching.value = false;
    })
    ;  
  }

  if(!res.data.length) {
    hasPostMore.value = false;
  }
  postList.push(...res.data);
}
// 获取贴子详情
const getPostDetail = async (post) => {
  if(post.status === 'pending') {
    ElMessage.warning('该贴子正在审核中');
    return;
  }

  if(post.status === 'rejected') {
    ElMessage.warning('该贴子已被拒绝');
    return;
  }

  postId.value = post.id;
  const res = await DoAxiosWithErro(`/post/${post.id}`,'get',{},true);
  Object.assign(postDetail,res.data);
  isDetail.value = true;
  commentList.length = 0;
  getCommentList();
}

const searchPost = async () => {
  if(!inputValue.value) {
    ElMessage.warning('请输入搜索内容');
    return;
  }
  activeTab.value = '';
  pageNo.value = 1;
  hasMore.value = true;
  isSearch.value = true;
  postList.splice(0,postList.length);
  await getList();
  isSearch.value = false;
}

// 发表贴子
const addPost = async () => {
  if(!newPost.content || !newPost.title) {
    ElMessage.warning('标题或内容不能为空');
    return;
  }
  isaddPosting.value = true;
  if(role !== 'admin') {
    DoAxiosWithErro('/post','post',{
      title: newPost.title,
      content: newPost.content,
      isAnonymous: newPost.isAnonymous
    },true).then(res => {
      ElMessage.success('发布成功,等待审核');
      console.log(res);
      newPost.content = '';
      newPost.title = '';
      isAdd.value = false;

    }).finally(() => {
      isaddPosting.value = false;
      quitAdd();
    });
  } else {
    DoAxiosWithErro('/post/official','post',{
      title: newPost.title,
      content: newPost.content,
      isAnonymous: newPost.isAnonymous,
      categoryId: newPostType.value
    },true).then(res => {
      console.log(res);
    }).finally(() =>{
      isaddPosting.value = false;
      quitAdd();
    })
  }
}

// 退出发布贴子
const quitAdd = () => {
  newPost.content = '';
  newPost.title = '';
  newPost.isAnonymous = false;
  isAdd.value = false;
}

// 返回帖子列表
const goToBack = () => {
  isDetail.value = false;
  isAdd.value = false;
  postId.value = undefined;
  pageNo.value = 1;
}

// 回复评论
const reply = (id, nickname) => {
  toReply.value = true;
  targetId.value = id;
  placeTexts.value = `回复${nickname}：`;
}

// 发表评论
const postCommit = () => {
  toReply.value = true;
  targetId.value = postId.value;
  placeTexts.value = '请输入发送的评论';
}

// 获取顶级评论列表
const getCommentList = async () => {

  if(pageNo.value === 1) {
    hasMore.value = true;
    commentList.splice(0,commentList.length);
  }
  const res = await DoAxiosWithErro(`/post/comments`,'post',{
    pageNo: pageNo.value,
    pageSize: 10,
    postId: postId.value,
    sortBy: 'time',
    isAsc: true,
    contentKeyword: ''
  },true);
  if(!res.data.length) {
    hasMore.value = false;// 没有更多评论了
    return
  }
  commentList.push(...res.data.map(item => ({
    ...item,
    pageNo: 1,
    hasMore: item.replies.length === 3
  })));
}

// 获取子评论列表

const getReplyList = async (id, pageNo) => {
  const res = await DoAxiosWithErro(`/post/comments/replies`,'post',{
    pageNo,
    pageSize: 3,
    sortBy: 'time',
    rootCommentId: id,
  },true);
  return res.data;
}

const fetchReplies = async (id, pageNo) => {
  const res = await getReplyList(id, pageNo + 1);
  const index = commentList.findIndex(item => item.id === id);
  commentList[index].replies.push(...res);
  commentList[index].pageNo = pageNo + 1;
  commentList[index].hasMore = res.length === 3
}


// 发表子评论
const ToReply = (id, isAnonymous) => {
  couldSubmit.value = false;
  if(!review.value) {
    ElMessage.warning('评论内容不能为空');
    couldSubmit.value = true;
    return;
  };
  const res = DoAxiosWithErro(`/post/comments/${id}/reply`,'post',{
    content: review.value,
    isAnonymous
  },true).then(res => {
    const index = commentList.findIndex(item => item.id === res.data.rootCommentId);
    commentList[index].replies.unshift(res.data);
    review.value = '';
  }).finally(() => {
    couldSubmit.value = true;
    toReply.value = false;
  })
}

// 发表顶级评论
const Tocommit = async (postId, isAnonymous) => {
  couldSubmit.value = false;
  if(!review.value) {
    ElMessage.warning('评论内容不能为空');
    couldSubmit.value = true;
    return;
  };
  DoAxiosWithErro(`/post/create/comments`,'post',{
    postId,
    content: review.value,
    isAnonymous
  },true).then(res => {
    ElMessage.success('评论成功');
    const newComment = res.data;
    commentList.unshift(newComment);
    review.value = '';
  }).finally(() => {
    couldSubmit.value = true;
    toReply.value = false;
  })
}

const commit = (isAnonymous) => {
  if(placeTexts.value === '请输入发送的评论') {
    Tocommit(targetId.value, isAnonymous);
  } else {
    ToReply(targetId.value, isAnonymous);
  }
}


// 加载更多评论

const getMoreCommentList = async () => {
  if(!commentArea.value || fetchMore.value || !hasMore.value) return
  const { scrollTop, clientHeight, scrollHeight } = commentArea.value;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    fetchMore.value = true;
    pageNo.value++;
    await getCommentList();
    fetchMore.value = false;
  }  
}

const getMorePostList = async () => {
  if(!postArea.value || fetchMore.value || !hasPostMore.value) return
  const { scrollTop, clientHeight, scrollHeight } = postArea.value;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    fetchMore.value = true;
    postPageNo.value = postPageNo.value + 1;
    await getList();
    fetchMore.value = false;
  }
}


onMounted(async () => {
    getList();
})

</script>
<style >
.forum{
  width: 100%;
  height: 100%;
  /* flex-direction: column; */
}
.addIcon{
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 5rem;
  border: 2px solid #ccc;
  border-radius: 50%;
  background: url('/src/assets/image/add.png') no-repeat;
  background-size: cover;
}
.listArea{
  scrollbar-width: none;
}

.comlist{
  scrollbar-width: none;
}
.content{
  scrollbar-width: none;
}

.delet{
  display: none;
}

.postItem:hover .delet {
  display: block;
}

</style>