<template>
  <div class="login">
    <div class="header">
      <div>
        <img src="../assets/img/jikon.png" alt="杭州集控科技有限公司">
        <h2>九钻</h2>
      </div>
    </div>
    <div class="body">
      <div class="form">
        <van-form @submit="onSubmit">
          <van-cell-group>
            <van-field
                v-model="loginForm.UserId"
                name="UserId"
                label="用户名"
                placeholder="请填写用户名"
                :rules="[{ required: true, message: '请填写用户名' }]"
            />
          </van-cell-group>

          <van-cell-group>
            <van-field
                v-model="loginForm.Password"
                type="password"
                name="Password"
                label="密码"
                placeholder="请填写密码"
                :rules="[{ required: true, message: '请填写密码' }]"
            />
          </van-cell-group>

          <div class="checkbox">
            <van-checkbox v-model="loginForm.checked">记住账号密码</van-checkbox>
          </div>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit">
              登录
            </van-button>
          </div>
        </van-form>
      </div>
    </div>

    <van-overlay :show="show" class="dis_flex">
      <van-loading size="24px" vertical>登录中...</van-loading>
    </van-overlay>
  </div>
</template>

<script>
  import localStorage from "../api/localStorage";
  import {api} from "../api";
  import { Notify } from 'vant';

  export default {
    data() {
      return {
        loginForm: {
          UserId: null,
          Password: null,
          checked: false
        },
        show: false
      };
    },
    created() {
      try {
        if(localStorage.getUser().checked){
          this.loginForm = localStorage.getUser()
        }
      }catch (e) {
        console.log(e);
      }

    },
    methods: {
      onSubmit(values) {
        this.show = true
        const param = values
        api.login(this.$qs.stringify(param)).then(res=>{
          let data = res.data
          if(data.Succeed){
            let user = {}
            user = {
              UserId: this.loginForm.UserId,
              Password: this.loginForm.Password,
              checked: this.loginForm.checked,
              Token: data.Token,
              PersonId: data.PersonId,
              PersonName: data.PersonName,
              Urls: data.Urls,
            };
            localStorage.setUser(user)
            this.$router.push('/layout/purchaseArrival')
          }else{
            this.show = false;
            Notify({ type: 'danger', message: '账号或密码错误' });
          }
        })

      },
    },
  };
</script>

<style scoped lang="stylus">
  .login
    .header
      background linear-gradient(to right, #0039aa, #087ded)
      display flex
      justify-content center
      align-items center
      height 250px
      color #fff;

      div
        text-align center

        img
          width 80px
          margin-bottom 10px
          border-radius 50%

        h2
          font-size 20px

    .body
      .form
        .checkbox
          padding 20px

</style>

