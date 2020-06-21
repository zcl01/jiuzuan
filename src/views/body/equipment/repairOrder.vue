<template xmlns="">
  <div class="body">
    <!--搜索-->
    <div class="search">
      <el-input v-model="listPage.EquipmentId" style="width: 280px;" clearable placeholder="请扫入设备编码"
                size="small" @keyup.enter.native="handleFilter"></el-input>
      <el-button size="small" type="primary" @click="handleFilter" :disabled="listPage.EquipmentId == null || listPage.EquipmentId === ''">搜索</el-button>
    </div>
    <van-divider>{{contentShow === false ? '请先扫入设备编码': '请查看、填写数据'}}</van-divider>
    <!--填充内容-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" class="content" v-if="contentShow">
      <div class="content-header">
        <el-button size="small" type="success" @click="handleSubmit">提交</el-button>
        <el-button size="small" type="warning" @click="handleAddParts">配件新增</el-button>
      </div>
      <div class="content-item">
        <ul>
          <li>设备：{{list.EquipmentName}}</li>
          <li>设备规格：{{list.EquipmentModel}}</li>
          <li>故障类型：{{list.EmfaultName}}</li>
          <li>故障描述：{{list.RepairDescribe}}</li>
          <li>故障部位：{{list.RepairPlace}}</li>
          <li>故障描述：<el-input v-model="list.EmMaintainDescribe" style="width: 200px;" size="small" placeholder="请输入"></el-input></li>
          <li>
            维修结束时间：
            <el-date-picker
                size="small"
                style="width: 200px;"
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="list.PlanEndTime"
                type="datetime"
                placeholder="选择日期时间">
            </el-date-picker>
          </li>
          <li>
            <ol v-for="(item,index) of list.EmMaintainDetails" :key="index">
              <li>配件：
                <el-select v-model="item.MaterialId" @change="addUnit(item.MaterialId,item)"
                           ref="partList"
                           @keyup.native="watchEditInput(item,index,list.EmMaintainDetails)" size="small" filterable clearable placeholder="请选择配件">
                  <el-option
                      v-for="i in item.parts"
                      :key="i.MaterialId"
                      :label="i.MaterialName"
                      :value="i.MaterialId">
                  </el-option>
                </el-select>
              </li>
              <li>
                库存：{{item.num}}
              </li>
              <li class="dis_flex_a">数量：
                <van-stepper v-model="item.Quantity" input-width="100px" button-size="32px" :min="0"/>
              </li>
              <li class="opt_top">
                <el-button size="small" type="danger" icon="el-icon-delete" circle
                           @click="handleDelete(index)"></el-button>
              </li>
            </ol>
          </li>
        </ul>
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
        list: null,
        show: false,
        contentShow: false,
        listPage: {
          EquipmentId: null,
        },
        parts: [],
        time: null,
      }
    },
    created() {
      this.getParts();
    },
    methods: {
      watchEditInput(item,index,list) {
        item.parts = [];
        if (this.time) {
          clearTimeout(this.time);
        }
        let selectedLabel = this.$refs.partList[index].selectedLabel;
        if (selectedLabel) {
          this.time = setTimeout(() => {
            const param = {
              page: 1,
              pagesize: 1000,
              Entity: {
                MaterialParameter: selectedLabel
              }
            }
            api.getmountingsitem(this.$qs.stringify(param)).then(res => {
              let data = res.data.Entities;
              if(data.length === 0){
               return Notify({type: 'danger', message: '没有该配件'});
              }
              this.$set(item,'parts',data);
              this.$forceUpdate();
            })
          }, 500);
        }
      },
      addUnit(id, data) {
        for (let item of this.parts) {
          if (item.MaterialId === id) {
            data.UnitId = item.UnitId
            data.num = item.Quantity
          }
        }
      },
      handleAddParts() {
        this.list.EmMaintainDetails.push({
          MaterialId: null,
          Quantity: null,
          parts:this.parts
        })
      },
      getParts() {
        const param = {
          page: 1,
          pagesize: 1000,
          Entity: {
            MaterialParameter: null
          }
        }
        api.getmountingsitem(this.$qs.stringify(param)).then(res => {
          let data = res.data.Entities;
          this.parts = data
        })
      },
      handleDelete(i) {
        Dialog.confirm({
          title: '删除',
          message: '是否删除该块数据',
        })
            .then(() => {
              Notify({type: 'primary', message: '删除成功'});
              this.list.EmMaintainDetails.splice(i, 1)
            })
            .catch(() => {
              Notify({type: 'warning', message: '已取消操作'});
            });
      },
      handleFilter() {
        if (this.listPage.EquipmentId == null || this.listPage.EquipmentId === '') {
          Notify({type: 'warning', message: '请先扫入设备编码'});
        } else {
          this.getList()
        }
      },
      getList() {
        this.show = true;
        const param = {
          EquipmentId: this.listPage.EquipmentId
        };
        api.getemmaintainitem(this.$qs.stringify(param)).then(res => {
          this.show = false;
          let data = res.data;
          if (data.Success === false) {
            Notify({type: 'danger', message: data.Message});
          } else {
            data.PersonId = localStorage.getUser().PersonId;
            data.PlanStartTime = this.$moment().format('yyyy-MM-DD HH:mm:ss');
            data.EmMaintainDetails = [
              {
                MaterialId: null,
                Quantity: null,
                parts:this.parts
              }
            ]
            this.list = data;
            this.contentShow = true;
          }
        })
      },
      onRefresh() {
        this.getList();
        this.isLoading = false;
      },
      handleSubmit() {
        this.list.FromBillNo  = this.list.BillNo;
        delete this.list.BillNo;
        Dialog.confirm({
          title: '提交',
          message: '该操作将提交当前页的所有数据，是否继续？'
        })
            .then(() => {
              const param = this.list
              api.addemmaintain(this.$qs.stringify((param))).then(res => {
                if (res.data.Success) {
                  Notify({type: 'primary', message: res.data.Message});
                  this.contentShow = false
                  this.listPage.EquipmentId = null
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

        ul
          color #333

          li
            margin-bottom 5px

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

          li
            line-height 30px

            ol
              position relative
              padding 10px
              border 1px solid #eee
              width 95%
              box-sizing border-box
              margin 10px auto 0
              border-radius 15px
              box-shadow 2px 2px 2px #eee

              .opt_left, .opt_top
                position absolute

              .opt_top
                right 0px
                top 0px
</style>
