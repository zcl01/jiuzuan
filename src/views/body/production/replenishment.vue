<template xmlns="">
  <div class="body">
    <!--搜索-->
    <div class="search">
      <el-input v-model="listPage.BillNo" style="width: 280px;" clearable placeholder="请扫入单号"
                size="small" @keyup.enter.native="getList"></el-input>
      <el-button size="small" type="primary" @click="handleFilter" :disabled="listPage.BillNo == null || listPage.BillNo === ''">搜索</el-button>
    </div>
    <van-divider>{{contentShow === false ? '请先按条件查询': '请查看、填写数据'}}</van-divider>
    <!--填充内容-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" class="content" v-if="contentShow">
      <div class="content-header">
        <el-button size="small" type="success" @click="handleSubmit">提交申请</el-button>
      </div>
      <div class="content-item">
        <transition name="van-slide-up">
          <ul>
            <li>工序流转卡号：{{list.BillNo}}</li>
            <li>当前工序：{{list.WorkProcessName}}</li>
            <li>生产图号：{{list.ProductionDrawingNo }}</li>
            <li>存货：{{list.MaterialName}}</li>
            <li>规格：{{list.RuleType }}</li>
            <li class="dis_flex_a">申请数量：
              <van-stepper v-model="list.ShouldQty" input-width="100px" button-size="32px" :min="0"/>
            </li>
          </ul>
        </transition>
      </div>
    </van-pull-refresh>

    <van-overlay :show="show" class="dis_flex">
      <van-loading size="24px" vertical>请给我点时间...</van-loading>
    </van-overlay>
  </div>
</template>

<script>
  import {Dialog, Notify} from 'vant';
  import {api} from '../../../api'
  import localStorage from '../../../api/localStorage'

  export default {
    data() {
      return {
        isLoading: false,
        total: null,
        list: {},
        show: false,
        contentShow: false,
        listPage: {
          BillNo: null,
          PersonId: localStorage.getUser().PersonId
        },
      }
    },
    created() {
      // this.getList()
    },
    methods: {
      handleFilter(){
        if(this.listPage.BillNo == null || this.listPage.BillNo === ''){
          Notify({type: 'warning', message: '请先扫入单号再搜索'});
        }else{
          this.getList()
        }
      },
      getList() {
        this.show = true
        const param = {
          BillNo: this.listPage.BillNo,
          PersonId: this.listPage.PersonId,
        }
        api.getprocessflowreplacementitem(this.$qs.stringify(param)).then(res => {
          this.show = false
          let data = res.data;
          if (data.Success === false){
            return Notify({type: 'danger', message: res.data.Message});
          }
          this.contentShow = true;
          this.list = data;
        })
      },
      onRefresh() {
        this.getList();
        this.isLoading = false;
      },
      handleSubmit() {
        console.log(this.list);
        Dialog.confirm({
          title: '提交',
          message: '该操作将提交当前页的所有数据，是否继续？'
        })
            .then(() => {
              const param = {
                ProcessFlowBarCode: this.list.BarCode,
                ProcessFlowNo: this.list.BillNo,
                ProcessFlowRowId: this.list.Row_Id,
                MaterialId: this.list.MaterialId,
                WorkProcessId: this.list.WorkProcessId,
                ShouldQty: this.list.ShouldQty,
                PersonId: this.listPage.PersonId,
                CreatorId: this.listPage.PersonId,
              }
              api.addstkreplacement(this.$qs.stringify((param))).then(res => {
                if (res.data.Success) {
                  Notify({type: 'primary', message: res.data.Message});
                  this.contentShow = false
                  this.listPage.BillNo = null
                } else {
                  Notify({type: 'danger', message: res.data.Message});
                }
              })
            })
            .catch(() => {
              Notify({type: 'warning', message: '已取消操作'});
            });
      }
    }
  }
</script>

<style scoped lang="stylus">
  .body
    box-sizing border-box
    min-height 100%
    margin-bottom 80px

    .search
      width 95%
      margin 10px auto 0
      display flex
      align-items center

    .content
      font-size 16px
      color #666
      margin 10px auto 0

      .content-header
        width 95%
        line-height 20px
        margin 5px auto

      .content-item
        margin-bottom 30px
        overflow auto

        ul
          padding 10px
          border 1px solid #eee
          width 95%
          box-sizing border-box
          margin 0 auto 10px
          border-radius 15px
          box-shadow 2px 2px 2px #eee
          position relative

          li
            line-height 30px

          .opt_left, .opt_right
            position absolute
            bottom 10px

          .opt_left
            right 80px

          .opt_right
            right 10px
</style>
