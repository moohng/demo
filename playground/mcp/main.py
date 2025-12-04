import json
from typing import List, Dict
import asyncio
from llm_client import LLMClient
from mcp_client import UserClient
# from math_client import MathClient
from fastmcp import Client
from openai import OpenAI

async def main():
    async with Client("http://127.0.0.1:8001/sse") as mcp_client:
        # 初始化LLM客户端，使用deepseek
        llm_client = LLMClient(model_name='deepseek-chat', api_key=os.getenv("DP_API_KEY"),
                               url='https://api.deepseek.com')

        # 获取可用工具列表并格式化为系统提示的一部分
        tools = await mcp_client.list_tools()
        dict_list = [tool.__dict__ for tool in tools]
        tools_description = json.dumps(dict_list, ensure_ascii=False)

        # 系统提示，指导LLM如何使用工具和返回响应
        system_message = f'''
                你是一个智能助手，严格遵循以下协议返回响应：

                可用工具：{tools_description}

                响应规则：
                1、当需要计算时，返回严格符合以下格式的纯净JSON：
                {{
                    "tool": "tool-name",
                    "arguments": {{
                        "argument-name": "value"
                    }}
                }}
                2、禁止包含以下内容：
                 - Markdown标记（如```json）
                 - 自然语言解释（如"结果："）
                 - 格式化数值（必须保持原始精度）
                 - 单位符号（如元、kg）

                校验流程：
                ✓ 参数数量与工具定义一致
                ✓ 数值类型为number
                ✓ JSON格式有效性检查

                正确示例：
                用户：单价88.5买235个多少钱？
                响应：{{"tool":"multiply","arguments":{{"a":88.5,"b":235}}}}

                错误示例：
                用户：总金额是多少？
                错误响应：总价500元 → 含自然语言
                错误响应：```json{{...}}``` → 含Markdown

                3、在收到工具的响应后：
                 - 将原始数据转化为自然、对话式的回应
                 - 保持回复简洁但信息丰富
                 - 聚焦于最相关的信息
                 - 使用用户问题中的适当上下文
                 - 避免简单重复使用原始数据
                '''
        # 启动聊天会话
        chat_session = UserClient(llm_client=llm_client, mcp_client=mcp_client)
        await chat_session.start(system_message=system_message)

if __name__ == "__main__":
    asyncio.run(main())