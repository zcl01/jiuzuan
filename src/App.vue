<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
  }
</script>


<style>
  html, body, #app {
    height: 100%;
    font-family: "Microsoft Yahei", Arial, sans-serif;
  }


  body .el-table th.gutter {
    display: table-cell !important;
  }

  body .el-table colgroup.gutter {
    display: table-cell !important;
  }

  ::selection {
    background: #d3d3d3;
    color: #555;
  }

  ::-moz-selection {
    background: #d3d3d3;
    color: #555;
  }

  ::-webkit-selection {
    background: #d3d3d3;
    color: #555;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: #F5F5F5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #aaa;
  }

</style>
