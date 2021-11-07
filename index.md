自动聊天机器人
    var socket;
    if ("WebSocket" in window) {
      var ws = new WebSocket("ws://127.0.0.1:8080");
      socket = ws;
      ws.onopen = function() {
        console.log('连接成功');
      };
      // 获取到服务端返回的信息
      ws.onmessage = function(evt) {
        var received_msg = evt.data;
        var txt="<div class=\"message-item message-item--left\">  <img class=\"avatar\" src=\"./img/girl.png\" alt=\"头像\"><div class=\"message-bubble\">"+ received_msg +"</div> </div>";  
        $(".message-list").append(txt);
        document.getElementById("mes").value="";
      };
      ws.onclose = function() {
        alert("断开了连接");
      };
    } else {
      alert("浏览器不支持WebSocket");
    }

    // 信息发送到服务端
    function sendMeg(){
      var message=document.getElementById("mes").value;
      var txt="<div class=\"message-item message-item--right\">  <img class=\"avatar\" src=\"./img/boy.png\" alt=\"头像\"><div class=\"message-bubble\">"+ message +"</div> </div>";  
        $(".message-list").append(txt);
      socket.send(message);
    }
  
聊天

# python - AI机器人

![头像](./img/girl.png)
你住的 巷子里 我租了一间公寓

![头像](./img/girl.png)
为了想与你不期而遇

![头像](./img/boy.png)
高中三年 我为什么 为什么不好好读书 没考上跟你一样的大学

发送
