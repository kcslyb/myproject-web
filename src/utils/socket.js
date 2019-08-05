import user from '../store/modules/user'

/**
 * socketUtil
 *
 * @returns {WebSocket}
 */
const socketUtil = () => {
  let socket;
  let url = 'ws://127.0.0.1:8088/socket/';
  if (!user.state.userId) {
    return null;
  }
  url = url + user.state.userId;
  if(typeof(WebSocket) == "undefined") { // 浏览器不支持WebSocket
    return null;
  }else {
    //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
    //等同于socket = new WebSocket("ws://127.0.0.1:8088/socket/{id});
    socket = new WebSocket(url);
    //打开事件
    socket.onopen = function () {
      // console.log("Socket 已打开");
      //socket.send("这是来自客户端的消息" + location.href + new Date());
    };
    //获得消息事件
    // socket.onmessage = function (msg) {
    //   console.log(msg.data);
    //   //发现消息进入,开始处理前端触发逻辑
    // };
    //关闭事件
    socket.onclose = function () {
      // console.error("Socket已关闭");
    };
    //发生了错误事件
    socket.onerror = function (e) {
      console.error("Socket发生了错误:" + e);
      //此时可以尝试刷新页面
    };
  }
  return socket;
};
export {
  socketUtil
}
