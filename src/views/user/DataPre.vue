<template>
  <div class="data-display">
    <div class="chart-container">
      <div ref="studyMinutesChart" class="chart"></div>
      <div ref="subjectChart" class="chart"></div>
      <div ref="dailyChart" class="chart"></div>
    </div>
    <div class="summary">
      <div>总学习时间: {{ state.totalStudyMinutes }} 分钟</div>
      <div>总专注次数: {{ state.totalSessions }}</div>
      <div>今日学习时间: {{ state.todayStudyMinutes }} 分钟</div>
      <div>今日专注次数: {{ state.todaySessions }}</div>
      <div>本周学习时间: {{ state.weekStudyMinutes }} 分钟</div>
      <div>本周专注次数: {{ state.weekSessions }}</div>
      <div>完成的番茄数: {{ state.completedPomodoros }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive, watch } from 'vue';
import { DoAxiosWithErro } from '@/api';
import { useUserStore } from '@/stores/user';
import * as echarts from 'echarts';

export default {
  setup() {
    const studyMinutesChart = ref(null);
    const subjectChart = ref(null);
    const dailyChart = ref(null);
    const userStore = useUserStore();

    const state = reactive({});

    let studyMinutesEcharts;
    let subjectEcharts;
    let dailyEcharts;

    const initCharts = () => {
      studyMinutesEcharts = echarts.init(studyMinutesChart.value);
      const studyMinutesOption = {
        title: {
          text: '学习时间分布'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['总学习时间', '今日学习时间', '本周学习时间']
        },
        yAxis: {
          type: 'value',
          name: '分钟'
        },
        series: [{
          data: [state.totalStudyMinutes, state.todayStudyMinutes, state.weekStudyMinutes],
          type: 'bar'
        }]
      };
      studyMinutesEcharts.setOption(studyMinutesOption);

      subjectEcharts = echarts.init(subjectChart.value);
      const subjectOption = {
        title: {
          text: '科目学习时间分布'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [{
          name: '学习时间',
          type: 'pie',
          radius: '50%',
          data: Object.entries(state.subjectDistribution || {}).map(([key, value]) => ({
            name: key,
            value: value
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      subjectEcharts.setOption(subjectOption);

      dailyEcharts = echarts.init(dailyChart.value);
      const dailyOption = {
        title: {
          text: '近7天学习时间'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: state.dailyStudy?.map(item => item.date) || []
        },
        yAxis: {
          type: 'value',
          name: '分钟'
        },
        series: [{
          data: state.dailyStudy?.map(item => item.studyMinutes) || [],
          type: 'line'
        }]
      };
      dailyEcharts.setOption(dailyOption);
    };

    const handleResize = () => {
      studyMinutesEcharts?.resize();
      subjectEcharts?.resize();
      dailyEcharts?.resize();
    };

    const getData = async () => {
      try {
        const res = await DoAxiosWithErro(`/study/stats`, 'get', {}, true);
          const { data } = res;
          state.totalStudyMinutes = data.totalStudyMinutes || 0;
          state.totalSessions = data.totalSessions || 0;
          state.todayStudyMinutes = data.todayStudyMinutes || 0;
          state.todaySessions = data.todaySessions || 0;
          state.weekStudyMinutes = data.weekStudyMinutes || 0;
          state.weekSessions = data.weekSessions || 0;
          state.completedPomodoros = data.completedPomodoros || 0;
          state.subjectDistribution = data.subjectDistribution || {};
          state.dailyStudy = data.dailyStudy || [];

          console.log('学习数据', state.subjectDistribution);
      } catch (error) {
        console.error('获取学习数据失败', error);
      }
    };

    onMounted(() => {
      getData().then(() => {
        initCharts();
      });
      initCharts();
      window.addEventListener('resize', handleResize);
    });

    const cleanup = () => {
      studyMinutesEcharts?.dispose();
      subjectEcharts?.dispose();
      dailyEcharts?.dispose();
      window.removeEventListener('resize', handleResize);
    };

    watch(
      () => state,
      () => {
        studyMinutesEcharts?.setOption({
          series: [{
            data: [state.totalStudyMinutes, state.todayStudyMinutes, state.weekStudyMinutes]
          }]
        });
        
        subjectEcharts?.setOption({
          series: [{
            data: Object.entries(state.subjectDistribution).map(([key, value]) => ({
              name: key,
              value: value
            }))
          }]
        });
        
        dailyEcharts?.setOption({
          xAxis: {
            data: state.dailyStudy.map(item => item.date)
          },
          series: [{
            data: state.dailyStudy.map(item => item.studyMinutes)
          }]
        });
      },
      { deep: true }
    );

    return {
      studyMinutesChart,
      subjectChart,
      dailyChart,
      state
    };
  }
};
</script>

<style scoped>
.data-display {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.chart-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.chart {
  width: calc(33.33% - 14px);
  height: 300px;
  box-sizing: border-box;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

@media (max-width: 768px) {
  .chart {
    width: 100%;
  }
}
</style>