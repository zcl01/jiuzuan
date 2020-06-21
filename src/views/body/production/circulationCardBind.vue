<template xmlns="">
  <div class="body">
    <!--搜索-->
    <div class="search">
      <el-input v-model="listPage.BillNo" style="width: 280px;" clearable placeholder="请扫入单号"
                size="small" @keyup.enter.native="getList"></el-input>
      <el-button size="small" type="primary" @click="handleFilter" :disabled="listPage.BillNo == null || listPage.BillNo === ''">搜索</el-button>
    </div>
    <van-divider>{{contentShow === false ? '请先输入单号': '请查看、填写数据'}}</van-divider>
    <!--填充内容-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" class="content" v-if="contentShow">
      <div class="content-header">
        <el-button size="small" type="success" @click="handleSubmit">提交申请</el-button>
        <el-button size="small" type="warning" @click="handleAdd">新增一行</el-button>
      </div>
      <div class="content-item">
        <ul v-for="(item,index) of list">
          <li>工序流转卡号：{{item.BillNo}}</li>
          <li>当前工序：{{item.WorkProcessName}}</li>
          <li>生产图号：{{item.ProductionDrawingNo }}</li>
          <li>存货：{{item.MaterialName}}</li>
          <li>规格：{{item.RuleType}}</li>
          <li class="dis_flex_a">
            工序：
            <el-select v-model="item.WorkProcessId" size="small" filterable clearable placeholder="请选择库位"
                       @change="changeWorkProcess(item.WorkProcesss,item.WorkProcessId,item)">
              <el-option
                  v-for="i in item.WorkProcesss"
                  :key="i.Id"
                  :label="i.Name"
                  :value="i.Id">
              </el-option>
            </el-select>
          </li>
          <li class="dis_flex_a">
            人员：
            <el-select v-model="item.PersonId" size="small" filterable clearable placeholder="请选择人员">
              <el-option
                  v-for="i in personSelectList"
                  :key="i.Id"
                  :label="i.Name+','+i.Id"
                  :value="i.Id">
              </el-option>
            </el-select>
          </li>
          <li>待派工数量：{{item.num}}</li>
          <li class="dis_flex_a">申请数量：
            <van-stepper v-model="item.ShouldQty" input-width="100px" button-size="32px" :min="0" :max="item.num"/>
          </li>
          <li class="opt_top">
            <el-button size="small" type="danger" icon="el-icon-delete" circle
                       @click="handleDelete(index)"></el-button>
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
        list: [],
        show: false,
        contentShow: false,
        listPage: {
          // BillNo: '20200407000001',
          BillNo: null,
          PersonId: localStorage.getUser().PersonId
        },
        personSelectList: null,
      }
    },
    created() {
      // this.getList()
      this.getPersonData()
    },
    methods: {
      handleAdd() {
        let data = Object.assign({}, this.list[0])
        data.PersonId = null
        this.list.push(data);
      },
      getPersonData() {
        const param = {
          Page: 1,
          PageSize: 20000,
          Entity: {
            Type: 8
          }
        }
        api.getbasicdataitem(this.$qs.stringify(param)).then(res => {
          this.personSelectList = res.data.Entities
        })
      },
      changeWorkProcess(list, id, data) {
        for (let item of list) {
          if (item.Id === id) {
            data.num = item.Define1
            data.ParentRowId = item.Define2
          }
        }
      },
      handleFilter() {
        if (this.listPage.BillNo == null || this.listPage.BillNo === '') {
          Notify({type: 'warning', message: '请先扫入单号再搜索'});
        } else {
          this.getList()
        }
      },
      handleDelete(i) {
        if (this.list.length === 1) {
          return Notify({type: 'danger', message: '必须留有一条'});
        }
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
      getList() {
        this.show = true
        const param = {
          BillNo: this.listPage.BillNo,
          PersonId: this.listPage.PersonId,
        }
        api.getprocessflowbindingitem(this.$qs.stringify(param)).then(res => {
          this.show = false
          let data = res.data;
          if (data.Success === false){
            return Notify({type: 'danger', message: res.data.Message});
          }
          this.contentShow = true;
          if (data.length > 0) {
            for (let items of res.data) {
              for (let item of items.WorkProcesss) {
                if (items.WorkProcessId === item.Id) {
                  items.ParentRowId = item.Define2
                  items.num = item.Define1
                }
              }
            }
            let data = res.data;
            this.list = data;
          }
        })
      },
      onRefresh() {
        this.getList();
        this.isLoading = false;
      },
      handleSubmit() {
        Dialog.confirm({
          title: '提交',
          message: '该操作将提交当前页的所有数据，是否继续？'
        })
            .then(() => {
              let ProcessFlowSubDetails = [];
              for (let item of this.list) {
                ProcessFlowSubDetails.push({
                  ParentRowId: item.ParentRowId,
                  WorkProcessId: item.WorkProcessId,
                  PersonId: item.PersonId,
                  StartQuantity: item.ShouldQty,
                })
              }
              const param = {
                BillNo: this.list[0].BillNo,
                ProcessFlowSubDetails
              }
              api.insertprocessflowsub(this.$qs.stringify((param))).then(res => {
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
          position relative

          li
            line-height 30px

          .opt_left, .opt_top
            position absolute

          .opt_top
            right 0px
            top 0px
</style>
