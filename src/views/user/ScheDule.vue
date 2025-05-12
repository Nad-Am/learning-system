<template>
  <div class="w-full h-full relative">
    <FullCalendar :options="calendarOptions" ref="fullCalendar" />

    <div
      class="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-2/3 w-2/3 h-5/6 bg-cardBg z-10"
      v-if="showEventForm"
    >
      <h1 class="text-2xl text-center text-white mb-4">日程/课表</h1>
      <el-form :model="eventForm" :rules="rules" ref="eventFormRef" label-width="120px">
        <el-form-item label="事件标题" prop="title">
          <el-input v-model="eventForm.title" placeholder="请输入事件标题"></el-input>
        </el-form-item>
        <el-form-item label="事件描述" prop="description">
          <el-input v-model="eventForm.description" type="textarea" placeholder="请输入事件描述"></el-input>
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input v-model="eventForm.location" placeholder="请输入地点"></el-input>
        </el-form-item>
        <el-form-item label="第一周开始时间" prop="startTime">
          <el-date-picker
            v-model="eventForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="第一周结束时间" prop="endTime">
          <el-date-picker
            v-model="eventForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="事件类型" prop="eventType">
          <el-radio-group v-model="eventForm.eventType">
            <el-radio label="class">课程</el-radio>
            <el-radio label="schedule">日程</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="重复周数" prop="repeatWeeks">
          <el-input-number v-model="eventForm.repeatWeeks" :min="1" :max="eventForm.eventType === 'class' ? 20 : 1" placeholder="请输入重复周数"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">{{ eventForm.id ? '修改' : '添加'}}</el-button>
          <el-button v-show="eventForm.id != null" type="primary" @click="deleteEvent">删除</el-button>
          <el-button @click="resetForm; showEventForm = false">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, toRaw, onMounted } from 'vue';
import { DoAxiosWithErro } from '@/api';

import { format } from 'date-fns';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const evetList = reactive([]);

const eventForm = reactive({
  id: null,
  title: '',
  description: '',
  location: '',
  startTime: '',
  endTime: '',
  eventType: 'schedule',
  repeatWeeks: 0
});

const showEventForm = ref(false);
const fullCalendar = ref(null); // 引用 FullCalendar 组件
const eventId = ref(0); // 用于存储当前选中事件的 ID
const conflictingEvents = reactive(new Set()); // 存储冲突事件的 ID

const sheduleList = computed(() => {
  const list = [];
  evetList.forEach(item => {
    for (let i = 0; i <= item.repeatWeeks - 1; i++) { // 修复循环条件
      const originalStart = new Date(item.startTime);
      const originalEnd = new Date(item.endTime);

      const newStart = new Date(originalStart);
      newStart.setDate(originalStart.getDate() + 7 * i);

      const newEnd = new Date(originalEnd);
      newEnd.setDate(originalEnd.getDate() + 7 * i);

      const id = eventId.value;

      eventId.value = id + 1;

      const newEvent = {
        id,
        weekTime: i,
        eventId: item.id,
        title: item.title,
        start: getTime(newStart),
        end: getTime(newEnd),
        description: item.description,
        location: item.location,
        eventType: item.eventType,
        repeatWeeks: item.repeatWeeks
      };
      list.push(newEvent);
    }
  });
  return list;
});

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek'
  },
  width: '100%',
  height: '80%',
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  events: sheduleList,
  eventColor: '#3788d8',
  eventOverlap: true,
  eventsSet: (events) => {
    detectConflicts(events); // 在事件列表更新时检测冲突
  },
  eventDidMount: handleEventDidMount,
  select: handleDateSelect,
  eventClick: handleEventClick
});

const getTime = (data) => {
  return format(new Date(data), 'yyyy-MM-dd HH:mm:ss');
};

// 检测事件冲突并标记
function detectConflicts(events) {
  conflictingEvents.clear(); // 清空之前的冲突记录

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1 = events[i];
      const event2 = events[j];

      // 检查两个事件是否冲突
      if (isEventsOverlapping(event1, event2)) {
        conflictingEvents.add(event1.id);
        conflictingEvents.add(event2.id);
      }
    }
  }
}

// 检查两个事件是否冲突
function isEventsOverlapping(event1, event2) {
  const start1 = new Date(event1.start);
  const end1 = new Date(event1.end);
  const start2 = new Date(event2.start);
  const end2 = new Date(event2.end);

  const res = start1 < end2 && end1 > start2;

  // if( res) {
  //   console.log(res, event1.title, event2.title, '是否冲突');
  // }

  return res;
}

// 在事件渲染后添加冲突标记
function handleEventDidMount(arg) {
  const event = arg.event;
  const el = arg.el;

  console.log(event.id, '事件ID');
  console.log(conflictingEvents, conflictingEvents.has(event.id), '冲突事件');
  if (conflictingEvents.has(event.id)) {
    // 添加红色感叹号标记
    console.log('冲突事件');
    const marker = document.createElement('span');
    marker.innerHTML = '<i style="color: red; margin-right: 5px; font-weight: bold;">⚠️</i>';
    el.querySelector('.fc-event-title').prepend(marker);
    el.style.backgroundColor= '#ff0000'; // 设置背景颜色为红色
  }
}

function handleDateSelect(info) {
  resetForm();
  eventForm.startTime = getTime(info.start);
  eventForm.endTime = getTime(info.end);
  showEventForm.value = true;
}

function handleEventClick(info) {
  console.log('Clicked event:', info.event.title, getTime(info.event.start), getTime(info.event.end));

  const eventId = info.event.extendedProps.eventId;

  const firstEvent = evetList.find(item => item.id === eventId);

  eventForm.title = info.event.title;
  eventForm.id = info.event.extendedProps.eventId;
  eventForm.description = info.event.extendedProps.description;
  eventForm.location = info.event.extendedProps.location;
  eventForm.eventType = info.event.extendedProps.eventType;
  eventForm.repeatWeeks = info.event.extendedProps.repeatWeeks;
  eventForm.startTime = getTime(firstEvent.startTime);
  eventForm.endTime = getTime(firstEvent.endTime);
  showEventForm.value = true;
}

const resetForm = () => {
  eventForm.id = null;
  eventForm.title = '';
  eventForm.description = '';
  eventForm.location = '';
  eventForm.startTime = '';
  eventForm.endTime = '';
  eventForm.eventType = 'schedule';
  eventForm.repeatWeeks = 0;
};

const getClassList = () => {
  DoAxiosWithErro('/calendar-events/classes', 'get', null, true).then(res => {
    evetList.push(...res.data);
    detectConflicts(sheduleList.value); // 初始化时检测冲突
    fullCalendar.value.getApi().refetchEvents(); // 初始化时重新获取和渲染事件
  });

  DoAxiosWithErro('/calendar-events/schedules', 'get', null, true).then(res => {
    evetList.push(...res.data);
    detectConflicts(sheduleList.value); // 初始化时检测冲突
    fullCalendar.value.getApi().refetchEvents(); // 初始化时重新获取和渲染事件
  });
};

const submitForm = () => {

  if(!eventForm.id){
    if(eventForm.eventType === 'class'){
      DoAxiosWithErro('/calendar-events/class', 'post', {
        ...eventForm,
        startTime: getTime(eventForm.startTime),
        endTime: getTime(eventForm.endTime)
      }, true).then(res => {
        evetList.push(res.data);
      })
    } else {
      DoAxiosWithErro('/calendar-events/schedule', 'post', {
        ...eventForm,
        startTime: getTime(eventForm.startTime),
        endTime: getTime(eventForm.endTime)
      }, true).then(res => {
        evetList.push(res.data);
      })
    }
  } else {
    DoAxiosWithErro(`/calendar-events/${eventForm.id}`,'put', {
      ...eventForm,
      startTime: getTime(eventForm.startTime),
      endTime: getTime(eventForm.endTime)
    }, true).then(res => {
      const index = evetList.findIndex(item => item.id === eventForm.id);
      if (index !== -1){
        evetList.splice(index, 1, res.data);
      }
    })
  }
  
  fullCalendar.value.getApi().refetchEvents(); // 初始化时重新获取和渲染事件
  console.log(evetList, sheduleList.value, '更新事件');
  showEventForm.value = false;
  resetForm();
};


const deleteEvent = () => {
  DoAxiosWithErro(`/calendar-events/${eventForm.id}`, 'delete', null, true).then(res => {
    const index = evetList.findIndex(item => item.id === eventForm.id);
    if (index !== -1){
      evetList.splice(index, 1);
    }
    showEventForm.value = false;
  })
}


onMounted(() => {
  getClassList();
});
</script>

<style>
.bg-cardBg {
  background-color: #fff; /* 示例背景色 */
}
</style>