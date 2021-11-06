import asyncio
import websockets
import json
# 腾讯云智能API类库
from tencentcloud.common import credential
from tencentcloud.common.profile.client_profile import ClientProfile
from tencentcloud.common.profile.http_profile import HttpProfile
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
from tencentcloud.tbp.v20190627 import tbp_client, models


# 服务器通过websocket与客户端建立连接
async def run(websocket, path):
    while True:
        try:
            await recv_user_msg(websocket)
        except websockets.ConnectionClosed:
            # 链接断开
            break
        except websockets.InvalidState:
            # 无效状态
            break
        except Exception as e:
            print("Exception:", e)


# 接收客户端消息并处理
async def recv_user_msg(websocket):
    # 一直循环，监听客户端发送的消息
    while True:
        recv_text = await websocket.recv()

        # 处理接收到的消息，然后发送给腾讯云智能API
        response_text = processText(recv_text)

        # 把得到的值，发送给客户端
        await websocket.send(response_text)


# 处理接收到的消息，然后发送给腾讯云智能API
def processText(recv_text):
    # 秘钥
    cred = credential.Credential("AKID65rQmuoTt45rOgjY8TYOdfU5SaS5TdXC", "ThgRxEG3bx4wZx61h8LJ2WllW3LOCl5A")

    httpProfile = HttpProfile()
    httpProfile.endpoint = "tbp.tencentcloudapi.com"
    clientProfile = ClientProfile()
    clientProfile.httpProfile = httpProfile
    client = tbp_client.TbpClient(cred, "", clientProfile)

    # 发送请求到腾讯云api
    req = models.TextProcessRequest()
    params = {
        "BotId": "dd453533-d11b-4484-8f38-8edbe36bad4d",
        "BotEnv": "dev",
        "TerminalId": "123",
        "InputText": recv_text
    }
    # 解析返回的值
    req.from_json_string(json.dumps(params))
    response = client.TextProcess(req).to_json_string()
    # json处理
    # {
    #     "DialogStatus": "",
    #     "BotName": "",
    #     "IntentName": "",
    #     "SlotInfoList": [],
    #     "InputText": "周杰伦",
    #     "ResponseMessage": {
    #         "GroupList": [{
    #             "ContentType": "text/plain",
    #             "Url": "",
    #             "Content": "昆凌"
    #         }]
    #     },
    #     "SessionAttributes": "",
    #     "ResultType": "3",
    #     "RequestId": "83a2f47f-bf88-4f9d-9c33-ba7fd56b057d"
    # }
    # 将json字符串转化为一个字典
    response_dict = json.loads(response)
    text = response_dict.get('ResponseMessage').get('GroupList')[0].get('Content')
    return text


if __name__ == '__main__':
    print("启动服务端 地址是 127.0.0.1:8080")
    asyncio.get_event_loop().run_until_complete(websockets.serve(run, "127.0.0.1", 8080))
    asyncio.get_event_loop().run_forever()
