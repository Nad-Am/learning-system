<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script>
import { ref, reactive, computed } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default {
  components: {
    FullCalendar
  },
  setup() {
    const learnTask = {
      tasks: [
        {
          title: '数学课',
          start: '2023-10-01T10:00:00',
          end: '2023-10-01T12:00:00'
        },
        {
          title: '英语课',
          start: '2023-10-01T14:00:00',
          end: '2023-10-01T16:00:00'
        }
      ]
    };

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
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      events: computed(() => learnTask.tasks),
      eventColor: '#3788d8',
      eventOverlap: true,
      eventDidMount: handleEventDidMount,
      select: handleDateSelect,
      eventClick: handleEventClick
    });

    function handleEventDidMount(info) {
      // 获取事件信息
      const event = info.event;
      const start = event.start;
      const end = event.end;
      const title = event.title;

      // 计算重复的周次
      const weeks = 10; // 假设重复10周
      for (let i = 1; i < weeks; i++) {
        const newStart = new Date(start);
        newStart.setDate(newStart.getDate() + 7 * i);
        const newEnd = new Date(end);
        newEnd.setDate(newEnd.getDate() + 7 * i);

        // 添加重复事件到 learnTask.tasks
        learnTask.tasks.push({
          title: title,
          start: newStart.toISOString(),
          end: newEnd.toISOString()
        });
      }
    }

    function handleDateSelect(info) {
      console.log('Selected date:', info.startStr);
    }

    function handleEventClick(info) {
      console.log('Clicked event:', info.event.title);
    }

    return {
      calendarOptions
    };
  }
};
</script>
