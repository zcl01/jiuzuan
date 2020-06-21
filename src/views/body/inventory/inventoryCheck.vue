<template xmlns="">
  <div class="body">
    <!--搜索-->
    <div class="search">
      <el-input v-model="listPage.BatchNo " style="width: 150px;" size="small" clearable placeholder="请输入批号"
                @keyup.enter.native="handleFilter"></el-input>
      <el-select v-model="listPage.MaterialId" size="small" style="width: 150px;" @change="handleFilter"
                 placeholder="请选择存货" clearable>
        <el-option
            v-for="item in stockSelectList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" @click="handleFilter">搜索</el-button>
    </div>
    <div class="search">

      <el-select v-model="listPage.WarehouseId" size="small" style="width: 150px;" placeholder="请选择仓库"
                 @change="warehouseChange">
        <el-option
            v-for="item in warehouseSelectList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id">
        </el-option>
      </el-select>
      <el-select v-model="listPage.StorageId" size="small" style="width: 150px;" filterable clearable placeholder="请选择库位"
                 ref="storageId"
                 @visible-change="watchWarehouse"
                 @keyup.enter.native="enterChangeStorage()"
                 @change="selectStorage">
        <el-option
            v-for="item in locationSelectList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id">
        </el-option>
      </el-select>
      <el-button size="small" type="success" @click="handleAdd">新增</el-button>
    </div>
    <van-divider>{{contentShow === false ? '请先按条件查询': '请查看、填写数据'}}</van-divider>
    <!--填充内容-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" class="content" v-if="contentShow">
      <div class="content-header">
        <el-button size="small" type="success" @click="allSave">全部保存</el-button>
      </div>

      <div class="content-item">
        <transition-group name="van-slide-up">
          <ul v-for="(item,index) of list" :key="index">
            <li>存货名称：{{item.MaterialName }}</li>
            <li>货位名称：{{item.StorageName }}</li>
            <li>规格型号：{{item.RuleType}}</li>
            <li>批号：{{item.BatchNo}}</li>
            <li>账面数量：{{item.Quantity}}{{item.UnitName }}</li>
            <li class="dis_flex_a">实盘数量：
              <van-stepper :disabled="item.disable" v-model="item.num" input-width="100px" button-size="40px" :min="0"/>
            </li>
            <li class="opt_right">
              <el-button size="small" type="warning" @click="handleEditDis(item)" v-show="item.disable">编辑</el-button>
              <el-button size="small" type="success" @click="handleEditDis(item)" v-show="!item.disable">保存</el-button>
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
        list: [],
        show: false,
        contentShow: false,
        listPage: {
          Page: 1,
          PageSize: 10,
          CompanyId: 'JZ',
          WarehouseId: null,
          MaterialId: null,
          StorageId: null,
          BatchNo: null,
        },
        user: localStorage.getUser(),
        warehouseSelectList: [],
        supplierSelectList: [],
        locationSelectList: [],
        stockSelectList: [],
        define:null
      }
    },
    created() {
      // this.getList();
      this.getBasicWarehouseData();
      this.getSupplierData();
      this.getStockData();
    },
    methods: {
      handleAdd(){
        this.$router.push('/layout/inventorySurplus')
      },
      selectStorage() {
        if(this.define){
          this.$set(this.listPage, 'WarehouseId', this.define)
        }
      },
      enterChangeStorage() {
        this.locationSelectList = []
        let type = this.$refs.storageId.selectedLabel
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
          this.handleFilter()
        }
      },
      warehouseChange() {
        this.listPage.StorageId = null
        this.getBasicLocationData();
        this.handleFilter()
      },
      // 0:仓库 1:货位 2:供应商资料 3:存货 4:存货类别
      getBasicLocationData() {
        const paramLocation = {
          Page: 1,
          PageSize: 200,
          Entity: {
            Parameter: '',
            Type: 1,
            DefineParameter: this.listPage.WarehouseId
          }
        }
        api.getbasicdataitem(this.$qs.stringify(paramLocation)).then(res => {
          let data = res.data.Entities;
          this.locationSelectList = data
        })
      },
      getBasicWarehouseData() {
        const paramWarehouse = {
          Page: 1,
          PageSize: 200,
          Entity: {
            Parameter: this.listPage.WarehouseId,
            Type: 0
          }
        }
        api.getbasicdataitem(this.$qs.stringify(paramWarehouse)).then(res => {
          this.warehouseSelectList = res.data.Entities
        })
      },
      getSupplierData() {
        const paramSupplier = {
          Page: 1,
          PageSize: 200,
          Entity: {
            Parameter: this.listPage.SupplierId,
            Type: 2
          }
        }
        api.getbasicdataitem(this.$qs.stringify(paramSupplier)).then(res => {
          this.supplierSelectList = res.data.Entities
        })
      },
      getStockData() {
        const paramSupplier = {
          Page: 1,
          PageSize: 200,
          Entity: {
            Parameter: this.listPage.SupplierId,
            Type: 3
          }
        }
        api.getbasicdataitem(this.$qs.stringify(paramSupplier)).then(res => {
          this.stockSelectList = res.data.Entities
        })
      },
      handleSizeChange(val) {
        this.listPage.Page = val;
        this.getList();
      },
      handleFilter() {
        if (this.listPage.WarehouseId == null) {
          Notify({type: 'warning', message: '请选择仓库再进行操作'});
          return;
        }
        this.listPage.Page = 1;
        this.getList();
      },
      getList() {
        this.show = true
        const param = {
          Page: this.listPage.Page,
          PageSize: this.listPage.PageSize,
          Entity: {
            CompanyId: this.listPage.CompanyId,
            WarehouseId: this.listPage.WarehouseId,
            MaterialId: this.listPage.MaterialId,
            StorageId: this.listPage.StorageId,
            BatchNo: this.listPage.BatchNo,
          }
        };
        api.getstocktakingitems(this.$qs.stringify(param)).then(res => {
          this.show = false
          let data = res.data;
          if (data.Success === false){
            return Notify({type: 'danger', message: res.data.Message});
          }
          this.contentShow = true;
          for (let item of data.Entities) {
            item.num = item.Quantity;
            item.disable = true
          }
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
      handleEditDis(item) {
        item.disable = !item.disable
      },
      allSave() {
        Dialog.confirm({
          title: '提交',
          message: '该操作将提交当前页的所有数据，是否继续？'
        })
            .then(() => {
              let StkStocktakingDetails = [];
              for (let item of this.list) {
                if (item.num === 0) {
                  continue;
                }
                StkStocktakingDetails.push({
                  WarehouseId: item.WarehouseId,
                  StkAttr: item.StkAttr,
                  StkState: item.StkState,
                  UnitId: item.UnitId,
                  StorageId: item.StorageId,
                  BatchNo: item.BatchNo,
                  MaterialId: item.MaterialId,
                  AccountQuantity: item.Quantity,
                  StockQuantity: item.num,
                })
              }
              const param = {
                PersonId: this.user.PersonId,
                WarehouseId: this.listPage.WarehouseId,
                SupplierId: this.listPage.SupplierId,
                CreatorId: this.user.PersonId,
                StkStocktakingDetails
              };
              api.addstkstocktaking(this.$qs.stringify((param))).then(res => {
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
