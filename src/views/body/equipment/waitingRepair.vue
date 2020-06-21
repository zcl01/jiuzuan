<template xmlns="">
  <div class="body">
    <!--搜索-->
    <div class="search">
      <el-input v-model="listPage.EquipmentId" style="width: 280px;" clearable placeholder="请扫入设备编码"
                size="small" @keyup.enter.native="handleFilter"></el-input>
      <el-button size="small" type="primary" @click="handleFilter" :disabled="listPage.EquipmentId == null || listPage.EquipmentId === ''">搜索</el-button>
    </div>

    <van-divider>{{contentShow?'请查看数据':'请扫入设备编码'}}</van-divider>
    <!--填充内容-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" class="content" v-if="contentShow">
      <div class="content-item">
        <transition-group name="van-slide-up">
          <ul v-for="(item,index) of list" :key="index">
            <li>设备：{{item.EquipmentName}}</li>
            <li>设备规格：{{item.EquipmentModel}}</li>
            <li>具体位置：{{item.Quantity}}</li>
            <li>故障类型：{{item.EmfaultName}}</li>
            <li>故障描述：{{item.RepairDescribe}}</li>
            <li>故障时间：{{item.RepairDate}}</li>
            <li>紧急程度：
              <span
                  :style="{color : item.IsUrgent ? '#F56C6C' : '#E6A23C'}"
                  v-text="item.IsUrgent ? '加急' : '正常'"
              >
              </span>
            </li>
            <li>备注：{{item.Remark}}</li>
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
        contentShow: false,
        listPage: {
          Page: 1,
          PageSize: 10,
          EquipmentId: null,
        },
        user: localStorage.getUser(),
      }
    },
    created() {
      // this.getList();
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
        this.list = []
        this.show = true
        const param = {
          Page: this.listPage.Page,
          PageSize: this.listPage.PageSize,
          Entity: {
            EquipmentId: this.listPage.EquipmentId
          }
        }
        api.getemrepairsitem(this.$qs.stringify(param)).then(res => {
          this.show = false
          let data = res.data;
          if (data.Success === false){
            return Notify({type: 'danger', message: res.data.Message});
          }
          this.contentShow = true;
          this.total = data.Total;
          this.list = data.Entities;
        })
      },
      onRefresh() {
        this.listPage.Page = 1;
        this.listPage.PageSize = 10;
        this.listPage.EquipmentId = null;
        this.getList();
        this.isLoading = false;
      },
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
