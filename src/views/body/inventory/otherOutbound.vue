<template xmlns="">
  <div class="body">
    <!--搜索-->
    <div class="search">
      <el-button size="small" type="warning" @click="handleAdd">新增一行</el-button>
      <el-button size="small" type="success" @click="allSave">全部保存</el-button>
    </div>
    <div class="search">

      <el-select v-model="listPage.WarehouseId" size="small" style="width: 180px;" filterable placeholder="请选择仓库"
                 @change="warehouseChange">
        <el-option
            v-for="item in warehouseSelectList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id">
        </el-option>
      </el-select>
      <el-select v-model="listPage.SendingAndReceivingID " size="small" style="width: 180px;" filterable clearable
                 placeholder="请选择收发类别">
        <el-option
            v-for="item in receiveSelectList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id">
        </el-option>
      </el-select>
    </div>
    <!--填充内容-->
    <div class="content">
      <div class="content-item">
        <transition-group name="van-slide-up">
          <ul v-for="(item,index) of list" :key="index">
            <li>
              存货：
              <el-select v-model="item.MaterialId" @change="changeStorage(item.MaterialId,stockSelectList,item)"
                         size="small" style="width: 180px;" placeholder="请选择" :disabled="item.disabled">
                <el-option
                    v-for="item in stockSelectList"
                    :key="item.Id"
                    :label="item.Name+' ('+item.Define2+')'"
                    :value="item.Id">
                </el-option>
              </el-select>
            </li>
            <li>
              货位：
              <el-select v-model="item.StorageId" size="small" filterable clearable placeholder="请选择库位"
                         :disabled="item.disable" @visible-change="watchWarehouse" ref="storageId"
                         @keyup.enter.native="enterChangeStorage(index)" @change="selectStorage">
                <el-option
                    v-for="item in locationSelectList"
                    :key="item.Id"
                    :label="item.Name"
                    :value="item.Id">
                </el-option>
              </el-select>
            </li>
            <li>
              批号：
              <el-input placeholder="请输入" v-model="item.BatchNo" clearable style="width: 180px;" size="small"
                        :disabled="item.disabled"></el-input>
            </li>
            <li class="dis_flex_a">
              数量：
              <van-stepper :disabled="item.disabled" v-model="item.Quantity" input-width="100px" button-size="40px"
                           :min="0"/>
            </li>
            <li class="opt_top">
              <el-button size="small" type="danger" icon="el-icon-delete" circle
                         @click="handleDelete(index)"></el-button>
            </li>
            <li class="opt_right">
              <el-button size="small" type="warning" @click="handleEditDis(item)" v-show="item.disable">编辑</el-button>
              <el-button size="small" type="success" @click="handleEditDis(item)" v-show="!item.disable">保存</el-button>
            </li>

          </ul>
        </transition-group>
      </div>
    </div>

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
        list: [
          {
            WarehouseId: null,
            UnitId: null,
            StorageId: null,
            BatchNo: null,
            MaterialId: null,
            Quantity: 1,
            disabled: false,
            UnitName: null
          }
        ],
        show: false,
        listPage: {
          WarehouseId: null,
          SendingAndReceivingID: null,
        },
        user: localStorage.getUser(),
        warehouseSelectList: [],
        supplierSelectList: [],
        locationSelectList: [],
        stockSelectList: [],
        receiveSelectList: [],
        num: 0,
        define:null
      }
    },
    created() {
      this.getBasicWarehouseData();
      this.getSupplierData();
      this.getStockData();
      this.getBasicReceiveData();
    },
    methods: {
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
            console.log(this.listPage.WarehouseId,data[0].Define1);
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
      warehouseChange() {
        for (let item of this.list) {
          item.StorageId = null
        }
        this.num = 0
        this.getBasicLocationData();
      },
      changeStorage(id, data, list) {
        for (let item of data) {
          if (item.Id === id) {
            list.UnitName = item.Define2
            list.UnitId = item.Define1
          }
        }
      },
      handleAdd() {
        this.list.push({
          WarehouseId: null,
          UnitId: null,
          StorageId: null,
          BatchNo: null,
          MaterialId: null,
          Quantity: 1,
          disabled: false,
        })
      },
      handleDelete(i) {
        Dialog.confirm({
          title: '删除',
          message: '是否删除该块数据',
        })
            .then(() => {
              Notify({type: 'primary', message: '删除成功'});
              this.list.splice(i, 1)
            })
            .catch(() => {
              Notify({type: 'warning', message: '已取消操作'});
            });
      },
      handleEditDis(item) {
        item.disabled = !item.disabled
      },
      allSave() {
        Dialog.confirm({
          title: '全部保存',
          message: '该操作将保存当前页的所有数据',
        })
            .then(() => {
              let StkOtherStockOutDetails = [];
              for (let item of this.list) {
                StkOtherStockOutDetails.push({
                  WarehouseId: this.listPage.WarehouseId,
                  UnitId: item.UnitId,
                  StorageId: item.StorageId,
                  BatchNo: item.BatchNo,
                  MaterialId: item.MaterialId,
                  Quantity: item.Quantity,
                })
              }
              const param = {
                PersonId: this.user.PersonId,
                WarehouseId: this.listPage.WarehouseId,
                SendingAndReceivingID: this.listPage.SendingAndReceivingID,
                CreatorId: this.user.PersonId,
                StkOtherStockOutDetails
              };
              api.addstkotherstockout(this.$qs.stringify((param))).then(res => {
                if (res.data.Success) {
                  Notify({type: 'primary', message: res.data.Message});
                  this.list = [{
                    WarehouseId: null,
                    UnitId: null,
                    StorageId: null,
                    BatchNo: null,
                    MaterialId: null,
                    Quantity: 1,
                    disabled: false,
                  }]
                  this.listPage.WarehouseId = null
                  this.listPage.SendingAndReceivingID = null
                } else {
                  Notify({type: 'danger', message: res.data.Message});
                }
              })
            })
            .catch(() => {
              Notify({type: 'warning', message: '已取消操作'});
            });
      },
      // 0:仓库 1:货位 2:供应商资料 3:存货 4:存货类别
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
      getBasicWarehouseData() {
        const param = {
          Page: 1,
          PageSize: 200,
          Entity: {
            Type: 0
          }
        }
        api.getbasicdataitem(this.$qs.stringify(param)).then(res => {
          this.warehouseSelectList = res.data.Entities
        })
      },
      getSupplierData() {
        const param = {
          Page: 1,
          PageSize: 200,
          Entity: {
            Type: 2
          }
        }
        api.getbasicdataitem(this.$qs.stringify(param)).then(res => {
          this.supplierSelectList = res.data.Entities
        })
      },
      getStockData() {
        const param = {
          Page: 1,
          PageSize: 200,
          Entity: {
            Parameter: this.listPage.SupplierId,
            Type: 3
          }
        }
        api.getbasicdataitem(this.$qs.stringify(param)).then(res => {
          this.stockSelectList = res.data.Entities
        })
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

          .opt_top, .opt_right
            position absolute

          .opt_top
            right 0px
            top 0px

          .opt_right
            right 10px
            bottom 10px
</style>
