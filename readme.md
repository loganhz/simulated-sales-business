
> 注：当前项目为 Serverless Devs 应用，由于应用中会存在需要初始化才可运行的变量（例如应用部署地区、服务名、函数名等等），所以**不推荐**直接 Clone 本仓库到本地进行部署或直接复制 s.yaml 使用，**强烈推荐**通过 `s init ` 的方法或应用中心进行初始化，详情可参考[部署 & 体验](#部署--体验) 。

<description>

基于云工作流 CloudFlow + 函数计算 FC 模拟销售场景，自部署版本

</description>

<codeUrl>



</codeUrl>
<preview>



</preview>


## 前期准备

使用该项目，您需要有开通以下服务：

<service>

| 产品名称 | 控制台官网 |
| --- |  --- |
| 函数计算 FC | https://fcnext.console.aliyun.com/ |
| 云工作流 CloudFlow | https://fnf.console.aliyun.com/ |
| 专有网络 VPC | https://vpc.console.aliyun.com/ |
| 文件存储 NAS | https://nasnext.console.aliyun.com/ |
</service>

推荐您拥有以下的产品权限 / 策略：
<auth>



| 服务/业务 |  权限 |  备注  |
| --- |  --- |   --- |
| 云工作流 CloudFlow | AliyunFnFFullAccess |  工作流部署在 CloudFlow |
| 函数计算 FC | AliyunFCFullAccess |  函数部署在 FC |
| 专有网络 VPC | AliyunVPCFullAccess |  NAS 挂载点需要有 VPC |
| 文件存储 NAS | AliyunNASFullAccess |  持久化数据放在 NAS |
| 其它 | AliyunECSFullAccess |  函数计算 NAS 挂载点需要交换机和安全组， 需要有自动创建的权限 |

</auth>

<remark>



</remark>

<disclaimers>



</disclaimers>

## 部署 & 体验

<appcenter>

- :fire: 通过 [Serverless 应用中心](https://fcnext.console.aliyun.com/applications/create?template=simulated-sales-business) ，
  [![Deploy with Severless Devs](https://img.alicdn.com/imgextra/i1/O1CN01w5RFbX1v45s8TIXPz_!!6000000006118-55-tps-95-28.svg)](https://fcnext.console.aliyun.com/applications/create?template=simulated-sales-business) 该应用。

</appcenter>
<deploy>

- 通过 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install) 进行部署：
  - [安装 Serverless Devs Cli 开发者工具](https://www.serverless-devs.com/serverless-devs/install) ，并进行[授权信息配置](https://docs.serverless-devs.com/fc/config) ；
  - 初始化项目：`s init simulated-sales-business -d simulated-sales-business `
  - 进入项目，并进行项目部署：`cd simulated-sales-business && s deploy - y`

</deploy>

## 应用详情

<appdetail id="flushContent">

通过工作流和函数计算，模拟客户端和商家端进行下单流程。

</appdetail>

## 使用文档

<usedetail id="flushContent">
</usedetail>


<devgroup>


## 开发者社区

您如果有关于错误的反馈或者未来的期待，您可以在 [Serverless Devs repo Issues](https://github.com/serverless-devs/serverless-devs/issues) 中进行反馈和交流。如果您想要加入我们的讨论组或者了解 FC 组件的最新动态，您可以通过以下渠道进行：

<p align="center">

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="130px" > |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| <center>微信公众号：`serverless`</center>                                                                                         | <center>微信小助手：`xiaojiangwh`</center>                                                                                        | <center>钉钉交流群：`33947367`</center>                                                                                           |
</p>
</devgroup>
