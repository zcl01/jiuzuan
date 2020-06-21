<template xmlns="">
  <div class="body">
    <!--搜索-->
    <div class="search">
      <el-input v-model="listPage.BillNo" style="width: 280px;" clearable placeholder="请扫入单号"
                size="small" @keyup.enter.native="handleFilter"></el-input>
      <el-button size="small" type="primary" @click="handleFilter"
                 :disabled="listPage.BillNo == null || listPage.BillNo === ''">搜索
      </el-button>
    </div>

    <van-divider>{{contentShow?'请查看数据':'请扫入单号'}}</van-divider>
    <!--填充内容-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" class="content" v-if="contentShow">
      <div class="content-header dis_flex_a">
        <el-select v-model="listPage.WarehouseId" size="small"  placeholder="请选择仓库" clearable @change="warehouseChange">
          <el-option
              v-for="item in warehouseSelectList"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id">
          </el-option>
        </el-select>
        <el-select v-model="listPage.SendingAndReceivingID" size="small" placeholder="请选择收发类别" clearable>
          <el-option
              v-for="item in receiveSelectList"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id">
          </el-option>
        </el-select>

        <el-button size="small" type="success" @click="allSave">提交</el-button>
      </div>
      <div class="content-item">
        <transition-group name="van-slide-up">
          <ul v-for="(item,index) of list" :key="index">
            <li>存货名称：{{item.MaterialName}}</li>
            <li>规格型号：{{item.RuleType}}</li>
            <li>生产图号：{{item.ProductionDrawingNo }}</li>
            <li>数量：{{item.Quantity}}{{item.UnitName}}</li>
            <li>库位:
              <el-select v-model="item.StorageId" size="small" style="width: 200px;" placeholder="请选择存货"
                         clearable filterable ref="storageId"
                         @visible-change="watchWarehouse"
                         @keyup.enter.native="enterChangeStorage(index)"
                         @change="selectStorage(item.StorageId,locationSelectList)">
                <el-option
                    v-for="item in locationSelectList"
                    :key="item.Id"
                    :label="item.Name"
                    :value="item.Id">
                </el-option>
              </el-select>
            </li>
            <li >批号:
              <el-input v-model="item.BatchNo" style="width: 200px;" clearable placeholder="请扫输入"
                        size="small"></el-input>
            </li>
            <li class="dis_flex_a">数量:
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
          BillNo: 'RY001',
          WarehouseId: null,
          StkProductionOutDetails: null,
        },
        user: localStorage.getUser(),
        warehouseSelectList: null,
        locationSelectList: null,
        receiveSelectList: null,
        num: 0,
      }
    },
    created() {
      this.getList();
      this.getBasicWarehouseData();
      this.getBasicReceiveData();
    },
    methods: {
      warehouseChange() {
        this.num = 0;
        for (let item of this.list) {
          item.StorageId = null
        }
        this.getBasicLocationData();
      },
      selectStorage() {
        this.num = this.num + 1
        if(this.define){
          this.$set(this.listPage, 'WarehouseId', this.define)
        }
        for (let item of this.list) {
          item.disable = false
        }
      },
      enterChangeStorage(i) {
        this.locationSelectList = []
        let type = this.$refs.storageId[i].selectedLabel
        const paramLocation = {
          Page: 1,
          PageSize: 200,
          Entity: {
            Parameter: type,
            Type: 1,
          }
        }
        api.getbasicdataitem(this.$qs.stringify(paramLocation)).then(res => {
          let data = res.data.Entities;
          if(this.num>0){
            if(this.listPage.WarehouseId !== data[0].Define1){
              return Notify({type: 'danger', message: '两次扫描库位的仓库不同，禁止操作'});
            }
          }
          this.locationSelectList = data;
          if (data.length !== 0) {
            this.define = data[0].Define1;
          }
        })
      },
      watchWarehouse(down) {
        if (down) {
          if (this.listPage.WarehouseId == null) {
            return Notify({type: 'warning', message: '请选择仓库或扫描库位再进行操作'});
          }
        }else{
          this.getBasicLocationData();
        }
      },
      allSave() {
        Dialog.confirm({
          title: '提交',
          message: '该操作将提交当前页的所有数据，是否继续？'
        })
            .then(() => {
              let StkProductionOutDetails = [];
              for (let item of this.list) {
                StkProductionOutDetails.push({
                  WarehouseId: this.listPage.WarehouseId,
                  FromBillNo: item.BillNo,
                  FromRowId: item.Row_Id,
                  UnitId: item.UnitId,
                  StorageId: item.StorageId,
                  BatchNo: item.BatchNo ,
                  MaterialId: item.MaterialId,
                  Quantity: item.num,
                })
              }
              const param = {
                PersonId: this.user.PersonId,
                WarehouseId: this.listPage.WarehouseId,
                SendingAndReceivingID : this.listPage.SendingAndReceivingID,
                CreatorId: this.user.PersonId,
                StkProductionOutDetails
              };
              api.addstkproductionout(this.$qs.stringify((param))).then(res => {
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
      //仓库
      getBasicWarehouseData() {
        const paramWarehouse = {
          Page: 1,
          PageSize: 200,
          Entity: {
            Parameter: null,
            Type: 0
          }
        }
        api.getbasicdataitem(this.$qs.stringify(paramWarehouse)).then(res => {
          this.warehouseSelectList = res.data.Entities
        })
      },
      //库位
      getBasicLocationData() {
        const param = {
          Page: 1,
          PageSize: 200,
          Entity: {
            Parameter: '',
            Type: 1,
            DefineParameter: this.listPage.WarehouseId
          }
        }
        api.getbasicdataitem(this.$qs.stringify(param)).then(res => {
          let data = res.data.Entities;
          this.locationSelectList = data
        })
      },
      //收发类别
      getBasicReceiveData() {
        const param = {
          Page: 1,
          PageSize: 200,
          Entity: {
            Type: 5,
          }
        }
        api.getbasicdataitem(this.$qs.stringify(param)).then(res => {
          let data = res.data.Entities;
          this.receiveSelectList = data
        })
      },
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
            BillNo: this.listPage.BillNo
          }
        }
        api.getstkproductionoutitem(this.$qs.stringify(param)).then(res => {
          this.show = false
          let data = res.data;
          if (data.Success === false) {
            return Notify({type: 'danger', message: res.data.Message});
          }
          for(let item of data.Entities){
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
