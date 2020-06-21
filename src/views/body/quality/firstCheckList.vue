<template xmlns="">
  <div class="body">
    <!--搜索-->
    <div class="search">
      <el-input v-model="listPage.BillNo" style="width: 280px;" clearable placeholder="请扫入单号"
                size="small" @keyup.enter.native="getList"></el-input>
      <el-button
          size="small"
          type="primary"
          @click="handleFilter"
          :disabled="listPage.BillNo == null || listPage.BillNo === ''">搜索</el-button>
    </div>
    <van-divider>{{contentShow === false ? '请先输入单号': '请查看、填写数据'}}</van-divider>
    <!--填充内容-->
    <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh"
        success-text="刷新成功"
        class="content"
        v-if="contentShow">
      <div class="content-header">
        <el-button size="small" type="success" @click="handleSubmit">提交</el-button>
      </div>
      <div class="content-item">
        <ul>
          <li>工序流转卡号：{{list.BillNo}}</li>
          <li>存货：{{list.MaterialName}}</li>
          <li>规格：{{list.RuleType}}</li>
          <li class="dis_flex_a">
            工序：
            <el-select
                v-model="list.WorkProcessId"
                size="small"
                filterable
                clearable
                placeholder="请选择"
                @change="changeWorkProcess(list.WorkProcesss,list.WorkProcessId,list)">
              <el-option
                  v-for="i in list.WorkProcesss"
                  :key="i.Id"
                  :label="i.Name"
                  :value="i.Id">
              </el-option>
            </el-select>
          </li>
          <li class="dis_flex_a">
            检验结果：
            <el-select
                v-model="list.TestingResult"
                size="small"
                filterable
                clearable
                placeholder="请选择">
              <el-option label="合格" :value="1"></el-option>
              <el-option label="不合格" :value="2"></el-option>
            </el-select>
          </li>
          <li class="dis_flex_a">
            检验结论：
            <el-input v-model="list.IspectionResult" style="width: 193px;" clearable placeholder="请输入"
                      size="small"></el-input>
          </li>
          <li class="dis_flex_a">
            备注：
            <el-input v-model="list.Remark" style="width: 193px;" clearable placeholder="请输入"
                      size="small"></el-input>
          </li>
          <li>
            <ol v-for="(item,index) of list.FirstInspectionDetails">
              <li>检测项名称：{{item.CheckItemName}}</li>
              <li>检验指标名称：{{item.DefectName}}</li>
              <li>检验指标类型：{{item.IndexType}}</li>
              <li>检验指标类型名称：{{item.IndexTypeName}}</li>
              <li>上限值：{{item.UpLimit}}</li>
              <li>下限值：{{item.LowLimit}}</li>
              <li>标准值：{{item.Standard}}</li>
              <li class="dis_flex_a">
                检验判断：
                <el-select v-model="item.DtestingConclusion" size="small"
                           filterable clearable placeholder="请选择">
                  <el-option label="合格" :value="1"></el-option>
                  <el-option label="不合格" :value="2"></el-option>
                </el-select>
              </li>
              <li class="dis_flex_a">
                检验值：
                <el-input v-model="item.DtestingResult" style="width: 193px;" clearable placeholder="请输入"
                          size="small"></el-input>
              </li>
              <li class="dis_flex_a">
                备注：
                <el-input v-model="item.Remark" style="width: 193px;" clearable placeholder="请输入"
                          size="small"></el-input>
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
          BillNo: null,
        },
      }
    },
    created() {
      // this.getList()
    },
    methods: {
      changeWorkProcess(list, id, data) {
        for (let item of list) {
          if (item.Id === id) {
            data.FormBillRow = item.Define1
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
      getList() {
        this.show = true;
        const param = {
          BillNo: this.listPage.BillNo
        };
        api.getfirstinspectionitem(this.$qs.stringify(param)).then(res => {
          this.show = false;
          let data = res.data;
          if(data.Success === false){
            Notify({type: 'danger', message: data.Message});
          }else{
            data.PersonId = localStorage.getUser().PersonId;
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
        this.list.FormBillNo= this.list.BillNo;
        this.list.StkFirstInspectionDetails = this.list.FirstInspectionDetails;
        delete this.list.BillNo;
        delete this.list.FirstInspectionDetails;
        Dialog.confirm({
          title: '提交',
          message: '该操作将保存当前页的所有数据',
        })
            .then(() => {
              const param = this.list
              api.addstkfirstinspection(this.$qs.stringify((param))).then(res => {
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
