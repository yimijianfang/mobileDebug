## 移动端调试工具

#### 测试地址
PC调试端 [http://mobile.liuning.xyz/nodepush/](http://mobile.liuning.xyz/nodepush/)
移动端  [http://mobile.liuning.xyz/demo](http://mobile.liuning.xyz/demo)

#### 已完成

- [x] 单点调试
- [x] 输出console.log内容
- [x] 发送指令给移动端
- [x] 输出监听同步和异步报错
- [x] 实现对localStorage操作

#### 未完成

- [ ] 移动端强制刷新（同ctrl+F5）
- [ ] 短时间内移动端刷新后MID不改变
- [ ] 移动端和PC端的连接关系迁移到redis

#### 功能展示
- 日志
  ![](http://mobile.liuning.xyz/images/consolelog_mobile.png)
  ![](http://mobile.liuning.xyz/images/consolelog_pc.png)
- 同步报错
  ![](http://mobile.liuning.xyz/images/sync_mobile.png)
  ![](http://mobile.liuning.xyz/images/sync_pc.png)
- 异步报错
  ![](http://mobile.liuning.xyz/images/async_mobile.png)
  ![](http://mobile.liuning.xyz/images/async_pc.png)
- localStorage
  ![](http://mobile.liuning.xyz/images/localStorage_mobile.png)
  ![](http://mobile.liuning.xyz/images/localStorage_pc.png)
- PC端发送指令
  ![](http://mobile.liuning.xyz/images/command_pc.png)
  ![](http://mobile.liuning.xyz/images/command_mobile.png)

#### 使用方法
1. 
  ```npm install 
  nodejs-websocket
  ```
2. 
  ```
  cd mobileDebug
  node index.js
  ```

3. 
   ```
   根据情况设置以下两个参数：
   window.socketurl = "自己的socket地址"
   window.delaytime = "延迟时间" //延迟时间保证刚加载的报错和日志保存到内存中，默认1s，可根据情况调整。
   页面引入mobile.debug.js
   ```

4. 
  ```
  设置PC端socket地址。
  /nodepush/index.html:378附近
  ```
#### 可能出现的问题
- node index.js后服务已开启，但移动端不能连接
  1. 查看防火墙
  2. 查看js路径
