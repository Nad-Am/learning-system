<template>
  <div class="chat-container flex flex-col relative w-3/4 h-full ml-8 border mx-auto border-gray-300 rounded-lg shadow-lg p-4">
    <div class="chat-header">
      <h2 class="text-xl font-semibold">AI 聊天</h2>
    </div>
    <div class="aicontainer p-2 h-full flex-1 flex flex-col overflow-y-auto">
      <div
       v-for="(message, index) in messages" :key="index"
       :class="{'self-end': message.role === 'user', 'self-start': message.role === 'system'}"
       class="flex flex-col">
        <div class="p-2"
         :class="{'self-end': message.role === 'user', 'self-start': message.role === 'system'}">
          {{ message.role === 'user' ? '😊' : '🤖' }}
        </div>
        <div 
         class="p-2 text-sm" >
          <p>{{ message.content }}</p>
        </div>
      </div>
    </div>
    <div class="chat-input relative mx-auto w-11/12 h-1/4">
      <textarea
        type="text"
        placeholder="输入你的问题..."
        v-model="userInput"
        @keyup.enter="sendMessage"
        class="w-full h-full  pr-16 border border-gray-300 rounded-md outline-none resize-none"
      />
      <button @click="sendMessage" class="absolute bottom-1 right-4 p-2 mt-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref } from 'vue';


const messages = ref([
  {role: "system", content: "你好！我是你的 AI 助手，请问有什么可以帮助你的？"},
])
const userInput = ref('');

async function main() {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-9487d59d27ce471091b8a7ab03d5d5ac'
        },
        body: JSON.stringify({
          messages: [
            {role: "system", content: "你是考研学习助手，请根据用户输入的问题给出合适的回答，回答的内容要简洁明了，不要有重复的内容，返回文本为一段纯文本，而非markdown格式。"},
            ...messages.value,
        ],
          model: "deepseek-chat",
          stream: true,
        })
      });
      
    userInput.value = '';
    const reader = response.body.getReader();
    // 创建文本解码器
    const decoder = new TextDecoder();
    let streamContent = "";

    while (true) {
      // 读取流中的下一个数据块
      const { done, value } = await reader.read();
      if (done) break;

      // 解码二进制数据为文本
      const chunk = decoder.decode(value);
      // 处理文本数据
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') return streamContent;

        try {
          const parsed = JSON.parse(message);
          const content = parsed.choices[0]?.delta?.content || '';
          if (content) {
            streamContent += content;
            // 更新视图
            messages.value[messages.value.length - 1].content = streamContent;
          }
        } catch (err) {
          console.error('解析错误:', err);
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const sendMessage = () =>{
  if(userInput.value.trim() === ''){
    ElMessage.warning('请输入内容');
  }
  messages.value.push({role: 'user', content: userInput.value});
  messages.value.push({role: 'system', content: '正在思考中...'});
  main().then( (str) =>{
    console.log(str)
  });
}
</script>

<style scoped>
/* 如果需要额外的样式，可以在这里添加 */
.aicontainer{
  scrollbar-width: none;
}
</style>