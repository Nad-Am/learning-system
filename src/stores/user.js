import { defineStore } from "pinia";
import { DoAxiosWithErro, DoAxios } from "@/api";
export const useUserStore =  defineStore('user',{
    state:() => ({
        userInfo:JSON.parse(localStorage.getItem('userInfo')) || {},
        avatorId:localStorage.getItem('avatorId') || '',
        avatorUrl:localStorage.getItem('avatarUrl') || '',
        points: localStorage.getItem('points') || '',
        userToken: localStorage.getItem('userToken') || '',
        isLoggedIn:false
    }),
    getters: {
        isAuthenticated: (state) => !!state.userInfo,
        userName: (state) => (state.userInfo ? state.userInfo.username : 'Guest')
      },
    
      // 3. 定义 actions
      actions: {
        async login(userData) {
              let Info = {};

              // this is text, only view
              // Info.username = 'Nad Am'
              // Info.avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';

              // this is dev

              const data = await DoAxiosWithErro(`/users/login`,'post',userData,false);

              this.userToken = data.data.token;
              Info = data.data;
              localStorage.setItem('userToken', this.userToken);
              this.points = Info.points;
              this.avatorId = Info.avatarId;
              this.avatorUrl = Info.avatarUrl;
              localStorage.setItem('avatorId',Info.avatarId);
              localStorage.setItem('avatarUrl',Info.avatarUrl);
              localStorage.setItem('points',Info.points);
              this.userInfo = Info;
              const infoJSON = JSON.stringify(Info);
              localStorage.setItem('userInfo',infoJSON);
        },
        async logout() {
          this.userInfo = null;
          DoAxios('/users/logout','post',{},true).finally(() =>{
            localStorage.removeItem('userToken');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('avatorId');
            localStorage.removeItem('avatarUrl');
            localStorage.removeItem('points');
            this.userToken = '';
            this.isLoggedIn = false;
          })
        }
      }
})