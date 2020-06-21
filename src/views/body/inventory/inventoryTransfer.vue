<template xmlns="">
  <div class="body">
    <!--搜索-->
    <div class="search">
      <el-input v-model="listPage.BatchNo " style="width: 150px;" clearable placeholder="请输入批号"
                size="small" @keyup.enter.native="handleFilter"></el-input>
      <el-select v-model="listPage.MaterialId" size="small" @change="handleFilter" style="width: 150px;"
                 placeholder="请选择存货">
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
                 @change="warehouseChange(listPage.WarehouseId,1)">
        <el-option
            v-for="item in warehouseSelectList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id">
        </el-option>
      </el-select>
      <el-select v-model="listPage.StorageId" size="small" style="width: 150px;" clearable filterable
                 ref="storage"
                 placeholder="请选择库位"
                 @visible-change="watchWarehouse($event,listPage.WarehouseId,1)"
                 @keyup.enter.native="enterChangeStorage('00')"
                 @change="selectStorage">
        <el-option
            v-for="item in locationSelectList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id">
        </el-option>
      </el-select>
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
            <li>转入仓库：
              <el-select v-model="item.InWarehouseId" size="small" style="width: 150px;" placeholder="请选择仓库"
                         @change="warehouseChange(item.InWarehouseId,2,item)">
                <el-option
                    v-for="item in warehouseSelectList"
                    :key="item.Id"
                    :label="item.Name"
                    :value="item.Id">
                </el-option>
              </el-select>
            </li>
            <li>转入货位：
              <el-select v-model="item.InStorageId" size="small" style="width: 150px;" clearable filterable
                         placeholder="请选择库位"
                         ref="storageId"
                         @visible-change="watchWarehouse($event,item.InWarehouseId,2,item)"
                         @keyup.enter.native="enterChangeStorage(index,item)"
              >
                <el-option
                    v-for="i in item.locationSelectList"
                    :key="i.Id"
                    :label="i.Name"
                    :value="i.Id">
                </el-option>
              </el-select>
            </li>
            <li class="dis_flex_a">转入数量：
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
        list: null,
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
      selectStorage() {
        if(this.define){
          this.$set(this.listPage, 'WarehouseId', this.define)
        }
        this.handleFilter()
      },
      enterChangeStorage(i,item) {
        this.locationSelectList = [];
        let type = null;
        if(i === '00'){
          type = this.$refs.storage.selectedLabel
        }else{
          type = this.$refs.storageId[i].selectedLabel
        }
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
          if(i === '00'){
            this.locationSelectList = data;
            if (data.length !== 0) {
              this.define = data[0].Define1;
            }
          }else{
            item.locationSelectList = data
            if (data.length !== 0) {
              item.InWarehouseId = data[0].Define1;
            }
          }

        })
      },
      watchWarehouse(event,val,num,item) {
        if (event) {
          if (val == null) {
            return Notify({type: 'warning', message: '请选择仓库或扫描库位再进行操作'});
          }
        }else{
          this.getBasicLocationData(val,num,item);
        }
      },
      warehouseChange(val, num, item) {
        if (num === 1) {
          this.listPage.WarehouseId = val
          this.listPage.StorageId = null
          this.getBasicLocationData(this.listPage.WarehouseId, 1)
          this.handleFilter()
        }
        if (num === 2) {
          item.InWarehouseId = val
          item.InStorageId = null
          this.getBasicLocationData(item.InWarehouseId, 2, item)
        }
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
            item.disable = false
            item.InStorageId = null
            item.InWarehouseId = null
            item.locationSelectList = null
          }
          this.total = data.Total;
          this.list = data.Entities;
        })
      },
      // 0:仓库 1:货位 2:供应商资料 3:存货 4:存货类别
      getBasicLocationData(val, num, item) {
        this.show = true
        const paramLocation = {
          Page: 1,
          PageSize: 200,
          Entity: {
            Parameter: '',
            Type: 1,
            DefineParameter: val
          }
        }
        api.getbasicdataitem(this.$qs.stringify(paramLocation)).then(res => {
          this.show = false
          let data = res.data.Entities;
          if (num === 1) {
            this.locationSelectList = data
          }
          if (num === 2) {
            if (data.length === 0) {
              Notify({type: 'warning', message: '该仓库无库位'});
              return
            }
            item.locationSelectList = data
          }
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
              let StkAllocationDetails = [];
              for (let item of this.list) {
                if (item.InStorageId == null && item.InWarehouseId == null) {
                  Notify({type: 'warning', message: '请选择仓库和库位在进行操作'});
                }
                if (item.num === 0) {
                  continue;
                }
                StkAllocationDetails.push({
                  MaterialId: item.MaterialId,
                  UnitId: item.UnitId,
                  OutWarehouseId: item.WarehouseId,
                  OutStorageId: item.StorageId,
                  InWarehouseId: item.InWarehouseId,
                  InStorageId: item.InStorageId,
                  OutStkAttr: item.StkAttr,
                  InStkAttr: item.StkAttr,
                  StkState: item.StkState,
                  BatchNo: item.BatchNo,
                  Quantity: item.num,
                })
              }
              const param = {
                PersonId: this.user.PersonId,
                WarehouseId: this.listPage.WarehouseId,
                SupplierId: this.listPage.SupplierId,
                CreatorId: this.user.PersonId,
                StkAllocationDetails
              };
              api.addstkallocation(this.$qs.stringify((param))).then(res => {
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
