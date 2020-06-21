import axios from 'axios'

let baseURL;
if (process.env.NODE_ENV === 'development') {      // 开发环境
  baseURL = window.Glob.BaseUrl
} else {                                           // 编译环境
  if (process.env.type === 'test') {               // 测试环境
    baseURL = window.Glob.BaseUrl                  // 在这里使用配置文件中的域名
  } else {                                         // 正式环境
    baseURL = window.Glob.BaseUrl                  // 在这里使用配置文件中的域名
  }
}

let instance = axios.create({
  baseURL: baseURL,
  headers: {
    //'Content-type':'application/x-www-form-urlencoded'
  },
})

const api = {
  //基础数据
  getbasicdataitem: params => {
    return instance.post('basicdata/getbasicdataitem', params)
  },
  /**
   **inventorymanagement
   **/
  //配件信息查询
  getmountingsitem: params => {
    return instance.post('inventorymanagement/getmountingsitem', params)
  },
  //获取生产领料单信息
  getstkproductionoutitem: params => {
    return instance.post('inventorymanagement/getstkproductionoutitem', params)
  },
  //新增生产领料单
  addstkproductionout: params => {
    return instance.post('inventorymanagement/addstkproductionout', params)
  },
  //获取装箱单信息
  getstkboxingitem: params => {
    return instance.post('inventorymanagement/getstkboxingitem', params)
  },
  //新增装箱单
  addstkboxing: params => {
    return instance.post('inventorymanagement/addstkboxing', params)
  },
  //现存量查询
  getaccountdetailitem: params => {
    return instance.post('inventorymanagement/getaccountdetailitem', params)
  },
  //新增其他出库单
  addstkotherstockout: params => {
    return instance.post('inventorymanagement/addstkotherstockout', params)
  },
  //新增其他入库单
  addstkotherstockin: params => {
    return instance.post('inventorymanagement/addstkotherstockin', params)
  },
  //生产入库单查询
  getprocessstockinitem: params => {
    return instance.post('inventorymanagement/getprocessstockinitem', params)
  },
  //生产入库单新增
  addstkprocessstockin: params => {
    return instance.post('inventorymanagement/addstkprocessstockin', params)
  },
  //销售出库单数据
  getsalestockoutitem: params => {
    return instance.post('inventorymanagement/getsalestockoutitem', params)
  },
  //销售出库单数据
  addstksalestockout: params => {
    return instance.post('inventorymanagement/addstksalestockout', params)
  },
  //库存盘点单查询
  getstocktakingitems: params => {
    return instance.post('inventorymanagement/getstocktakingitems', params)
  },
  //库存盘点单新增
  addstkstocktaking: params => {
    return instance.post('inventorymanagement/addstkstocktaking', params)
  },
  //库存调拨单新增
  addstkallocation: params => {
    return instance.post('inventorymanagement/addstkallocation', params)
  },
  //采购到货单数据
  getProcesscardDatas: params => {
    return instance.post('inventorymanagement/getprocesscarddatas', params)
  },
  //新增到货单数据
  addPurchaseorderin: params => {
    return instance.post('inventorymanagement/addpurchaseorderin', params)
  },
  //采购入库数据
  getReceiptnoticeItem: params => {
    return instance.post('inventorymanagement/getreceiptnoticeitem', params)
  },
  //新增入货单数据
  addstkpurstockin: params => {
    return instance.post('inventorymanagement/addstkpurstockin', params)
  },
  /**
   **productiveprocess
   **/
  //工序流转卡绑定信息
  getprocessflowbindingitem: params => {
    return instance.post('productiveprocess/getprocessflowbindingitem', params)
  },
  //工序流转卡绑定
  insertprocessflowsub: params => {
    return instance.post('productiveprocess/insertprocessflowsub', params)
  },
  //工序流转卡查看
  getprocessflowitem: params => {
    return instance.post('productiveprocess/getprocessflowitem', params)
  },
  //工序流转卡过程
  getprocessflowcourselitem: params => {
    return instance.post('productiveprocess/getprocessflowcourselitem', params)
  },
  //新增设备报修单
  addemrepairs: params => {
    return instance.post('productiveprocess/addemrepairs', params)
  },
  //工序流转卡补料信息
  getprocessflowreplacementitem: params => {
    return instance.post('productiveprocess/getprocessflowreplacementitem', params)
  },
  //新增补料申请单
  addstkreplacement: params => {
    return instance.post('productiveprocess/addstkreplacement', params)
  },
  //新增退料单
  addstkreturnmaterial: params => {
    return instance.post('productiveprocess/addstkreturnmaterial', params)
  },
  //工序流转卡报工信息
  getprocessflowreportworkitem: params => {
    return instance.post('productiveprocess/getprocessflowreportworkitem', params)
  },
  //新增报工单
  addstkreportwork: params => {
    return instance.post('productiveprocess/addstkreportwork', params)
  },

  /**
   **quality
   **/
  //生产首检单信息
  getfirstinspectionitem: params => {
    return instance.post('quality/getfirstinspectionitem', params)
  },
  //新增生产首检单
  addstkfirstinspection: params => {
    return instance.post('quality/addstkfirstinspection', params)
  },
  //来料待检单报表信息
  getincominginspectionrptitem: params => {
    return instance.post('quality/getincominginspectionrptitem', params)
  },
  //来料检验单信息
  getincominginspectionitem: params => {
    return instance.post('quality/getincominginspectionitem', params)
  },
  //新增来料检验单
  addstkincominginspection: params => {
    return instance.post('quality/addstkincominginspection', params)
  },
  // 工序检验单信息
  getprocedureinspectionitem: params => {
    return instance.post('quality/getprocedureinspectionitem', params)
  },
  //新增工序检验单
  addstkprocedureinspection: params => {
    return instance.post('quality/addstkprocedureinspection', params)
  },
  //产品终检单信息
  getfinalinspectionitem: params => {
    return instance.post('quality/getfinalinspectionitem', params)
  },
  //新增产品终检单
  addqcfinalinspection: params => {
    return instance.post('quality/addqcfinalinspection', params)
  },

  /**
   * * equipment
   * */
  //待修设备报表信息
  getemrepairsitem: params => {
    return instance.post('equipment/getemrepairsitem', params)
  },
  //设备维修单信息
  getemmaintainitem: params => {
    return instance.post('equipment/getemmaintainitem', params)
  },
  //新增设备维修单
  addemmaintain: params => {
    return instance.post('equipment/addemmaintain', params)
  },
  //设备保养单信息
  getemoperationitem: params => {
    return instance.post('equipment/getemoperationitem', params)
  },
  //更新设备保养单
  updateemoperation: params => {
    return instance.post('equipment/updateemoperation', params)
  },
  //设备报废单信息
  getemscrapitem: params => {
    return instance.post('equipment/getemscrapitem', params)
  },
  //新增设备报废单
  addemscrap: params => {
    return instance.post('equipment/addemscrap', params)
  },
  //登录
  login: params => {
    return instance.post('user/login', params)
  },
};
export {api}
