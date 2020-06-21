<template xmlns="">
  <div class="body">
    <!--搜索-->
    <div class="search">
      <el-button size="small" type="warning" @click="goBack">返回</el-button>
    </div>
    <!--填充内容-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" class="content">
      <div class="content-item">
        <transition-group name="van-slide-up">
          <ul v-for="(item,index) of list" :key="index">
            <li>工序名称：{{item.WorkProcessName }}</li>
            <li>操作员：{{item.PersonName}}</li>
            <li>合格数量：{{item.CucoQuantity}}</li>
            <li>返工数量：{{item.ReworkQuantity}}</li>
            <li>应领数量：{{item.ShouldQty}}</li>
            <li>已领数量：{{item.AccumulativeQty}}</li>
            <li>检验员：{{item.QcPersonName}}</li>
          </ul>
        </transition-group>
      </div>
    </van-pull-refresh>

    <van-pagination v-model="listPage.page" :items-per-page="listPage.limit" :total-items="total" mode="simple"
                    @change="handleSizeChange"/>

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
        list: null,
        show: false,
        listPage: {
          Page: 1,
          PageSize: 10,
          BillNo: null,
        },
      }
    },
    created() {
      if(this.$route.query.BillNo){
        this.listPage.BillNo = this.$route.query.BillNo
        this.getList();
      }else{
        Dialog.confirm({
          title: '未选择流转卡',
          message: '是否先选择流转卡',
        }).then(() => {
          this.$router.push('/layout/circulationCard')
        }).catch(() => {
          Notify({ type: 'warning', message: '已取消操作' });
        });
      }
    },
    methods: {
      handleSizeChange(val) {
        this.listPage.Page = val;
        this.getList();
      },
      handleFilter() {
        this.listPage.Page = 1;
        this.getList();
      },
      getList() {
        this.show = true
        const param = {
          Page: this.listPage.Page,
          PageSize: this.listPage.PageSize,
          Entity: {
            BillNo: this.listPage.BillNo
          }
        }
        api.getprocessflowcourselitem(this.$qs.stringify(param)).then(res => {
          this.show = false
          let data = res.data;
          this.total = data.Total;
          this.list = data.Entities;
        })
      },
      onRefresh() {
        this.listPage.Page = 1;
        this.listPage.PageSize = 10;
        this.getList();
        this.isLoading = false;
      },
      goBack(){
        this.$router.go(-1)
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
      margin 20px auto 0
      font-size 16px
      color #666
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
