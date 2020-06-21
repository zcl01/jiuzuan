<template xmlns="">
  <div class="body">
    <!--搜索-->
    <div class="search">
      <el-select v-model="listPage.CustomerId" size="small" ref="customer" placeholder="请选择客户" clearable filterable
                 @keyup.native="enterFilter" @change="handleFilter">
        <el-option
            v-for="item in customSelectList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" @click="handleFilter"
                 :disabled="listPage.CustomerId == null || listPage.CustomerId === ''">搜索
      </el-button>
    </div>

    <van-divider>{{contentShow?'请查看数据':'请扫入单号'}}</van-divider>
    <!--填充内容-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" class="content" v-if="contentShow">
      <div class="content-header dis_flex_a">
        <el-button size="small" type="success" @click="allSave">提交</el-button>
      </div>
      <div class="content-item">
        <transition-group name="van-slide-up">
          <ul v-for="(item,index) of list" :key="index">
            <li>存货名称：{{item.MaterialName}}</li>
            <li>规格型号：{{item.RuleType}}</li>
            <li>生产图号：{{item.ProductionDrawingNo }}</li>
            <li>待装箱数量：{{item.Quantity}}{{item.UnitName}}</li>
            <li class="dis_flex_a">本次装箱数量:
              <van-stepper v-model="item.num" input-width="100px" button-size="40px" :min="0"/>
            </li>
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
          CustomerId: null,
          WarehouseId: null,
          StkProductionOutDetails: null,
        },
        user: localStorage.getUser(),
        customSelectList: [],
        timer: null
      }
    },
    created() {
      // this.getList();
      this.getCustomData();
    },
    methods: {
      allSave() {
        Dialog.confirm({
          title: '提交',
          message: '该操作将提交当前页的所有数据，是否继续？'
        })
            .then(() => {
              let StkBoxingDetails = [];
              for (let item of this.list) {
                StkBoxingDetails.push({
                  SaleOrderNo: item.BillNo,
                  SaleOrderRowId: item.Row_Id,
                  MaterialId: item.MaterialId,
                  MaxQuantity: item.Quantity,
                  Quantity: item.num,
                })
              }
              const param = {
                PersonId: this.user.PersonId,
                CustomerId : this.listPage.CustomerId ,
                CreatorId: this.user.PersonId,
                StkBoxingDetails
              };
              api.addstkboxing(this.$qs.stringify((param))).then(res => {
                if (res.data.Success) {
                  Notify({type: 'primary', message: res.data.Message});
                  this.contentShow = false
                } else {
                  Notify({type: 'danger', message: res.data.Message});
                }
              })
            })
            .catch(() => {
              Notify({type: 'warning', message: '已取消操作'});
            });
      },
      //客户
      getCustomData(x = null) {
        this.customSelectList = []
        const paramWarehouse = {
          Page: 1,
          PageSize: 2000,
          Entity: {
            Parameter: x,
            Type: 9
          }
        };
        api.getbasicdataitem(this.$qs.stringify(paramWarehouse)).then(res => {
          this.customSelectList = res.data.Entities
        })
      },
      handleSizeChange(val) {
        this.listPage.Page = val;
        this.getList();
      },
      enterFilter() {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.getCustomData(this.$refs.customer.selectedLabel)
        }, 300)
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
            CustomerId: this.listPage.CustomerId
          }
        }
        api.getstkboxingitem(this.$qs.stringify(param)).then(res => {
          this.show = false
          let data = res.data;
          if (data.Success === false) {
            return Notify({type: 'danger', message: res.data.Message});
          }
          for (let item of data.Entities) {
            item.num = item.Quantity
          }
          this.contentShow = true;
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
