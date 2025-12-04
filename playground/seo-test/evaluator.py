import asyncio
import base64
import json
import os
from openai import OpenAI
from data_manager import DataManager
from dotenv import load_dotenv

load_dotenv()

# 支持多种AI模型
# 可选: openai, gemini
AI_PROVIDER = os.getenv("AI_PROVIDER", "gemini").lower()

if AI_PROVIDER == "openai":
    # OpenAI GPT-4 Vision
    client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY")
    )
    MODEL_NAME = "gpt-4o"  # 或 gpt-4-vision-preview
elif AI_PROVIDER == "gemini":
    # Google Gemini
    import google.generativeai as genai
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    MODEL_NAME = "gemini-2.5-flash"  # 或 gemini-1.5-pro
else:
    raise ValueError(f"不支持的AI提供商: {AI_PROVIDER}，请使用 openai 或 gemini")

print(f"✓ 使用AI模型: {AI_PROVIDER} - {MODEL_NAME}")

EVAL_PROMPT = """
你是一名专业的搜索引擎评测专家。

现在给你一张搜索结果页截图，请你从以下维度进行评分：

1. **精准度得分（0-10）**  
   - 搜索结果是否与关键词强相关  
   - 是否出现无关内容、标题党、内容农场  
   - 结果的权威性和可信度

2. **广告占比得分（0-10）**  
   - 广告越多得分越低  
   - 包括：顶部广告、信息流广告、右侧广告、推广链接  
   - 广告与内容的区分度

3. **页面质量得分（0-10）**  
   - 页面布局是否清晰  
   - 信息密度是否合理  
   - 是否有干扰元素（弹窗、诱导点击等）

4. **用户体验得分（0-10）**  
   - 搜索结果的可读性  
   - 关键信息是否突出  
   - 整体视觉体验

5. **简要评价**（100字以内）  
   - 总结该搜索引擎在此关键词下的表现  
   - 指出主要优点和不足

请返回JSON格式：
{
  "accuracy_score": x,
  "ad_score": x,
  "quality_score": x,
  "ux_score": x,
  "total_score": x,
  "comment": "..."
}

注意：total_score = (accuracy_score + ad_score + quality_score + ux_score) / 4
"""


def evaluate_image_openai(image_path, keyword, engine):
    """使用OpenAI GPT-4 Vision评测"""
    with open(image_path, "rb") as f:
        img_bytes = f.read()

    result = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": EVAL_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": f"搜索引擎：{engine}\n关键词：{keyword}"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{base64.b64encode(img_bytes).decode()}"
                        }
                    }
                ]
            }
        ],
        temperature=0.3,
        max_tokens=500
    )
    
    return result.choices[0].message.content


def evaluate_image_gemini(image_path, keyword, engine):
    """使用Google Gemini评测"""
    import PIL.Image
    
    # 加载图片
    img = PIL.Image.open(image_path)
    
    # 创建模型
    model = genai.GenerativeModel(MODEL_NAME)
    
    # 生成评测
    prompt = f"{EVAL_PROMPT}\n\n搜索引擎：{engine}\n关键词：{keyword}"
    result = model.generate_content([prompt, img])
    
    return result.text


def evaluate_image(image_path, keyword, engine):
    """使用AI评测单张截图"""
    try:
        # 根据提供商选择评测函数
        if AI_PROVIDER == "openai":
            content = evaluate_image_openai(image_path, keyword, engine)
        elif AI_PROVIDER == "gemini":
            content = evaluate_image_gemini(image_path, keyword, engine)
        else:
            raise ValueError(f"不支持的AI提供商: {AI_PROVIDER}")
        
        # 尝试解析JSON
        try:
            # 提取JSON部分（有时AI会在JSON前后添加说明文字）
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            evaluation = json.loads(content)
            return evaluation
        except json.JSONDecodeError:
            print(f"⚠️ JSON解析失败，原始内容：{content}")
            return {
                "accuracy_score": 0,
                "ad_score": 0,
                "quality_score": 0,
                "ux_score": 0,
                "total_score": 0,
                "comment": f"评测失败：{content[:100]}"
            }
    
    except Exception as e:
        print(f"✗ 评测失败：{str(e)}")
        return {
            "accuracy_score": 0,
            "ad_score": 0,
            "quality_score": 0,
            "ux_score": 0,
            "total_score": 0,
            "comment": f"评测异常：{str(e)}"
        }


async def run_evaluation():
    """运行AI评测"""
    data_manager = DataManager()
    
    # 获取未评测的成功测试
    unevaluated = data_manager.get_unevaluated_tests()
    
    if not unevaluated:
        print("✓ 没有需要评测的数据")
        data_manager.print_summary()
        return
    
    print(f"\n🤖 开始AI评测，共 {len(unevaluated)} 个项目")
    print("="*50)
    
    success_count = 0
    failed_count = 0
    
    for i, record in enumerate(unevaluated, 1):
        engine = record["engine"]
        keyword = record["keyword"]
        image_path = record["screenshot_path"]
        
        print(f"\n进度：{i}/{len(unevaluated)}")
        print(f"🔍 评测：{engine} / {keyword}")
        
        # 检查文件是否存在
        if not os.path.exists(image_path):
            print(f"✗ 文件不存在：{image_path}")
            failed_count += 1
            continue
        
        # 执行评测
        evaluation = evaluate_image(image_path, keyword, engine)
        
        # 更新数据
        data_manager.update_evaluation(engine, keyword, evaluation)
        
        # 输出结果
        if evaluation.get("total_score", 0) > 0:
            print(f"✓ 评测完成")
            print(f"  - 精准度：{evaluation.get('accuracy_score', 0)}/10")
            print(f"  - 广告占比：{evaluation.get('ad_score', 0)}/10")
            print(f"  - 页面质量：{evaluation.get('quality_score', 0)}/10")
            print(f"  - 用户体验：{evaluation.get('ux_score', 0)}/10")
            print(f"  - 总分：{evaluation.get('total_score', 0):.2f}/10")
            success_count += 1
        else:
            print(f"✗ 评测失败")
            failed_count += 1
        
        # 每次评测后保存数据（防止中断丢失）
        if i % 5 == 0:
            data_manager.save_data()
            print(f"\n💾 已保存进度（{i}/{len(unevaluated)}）")
        
        # 避免API限流
        await asyncio.sleep(1)
    
    # 最终保存
    data_manager.save_data()
    
    # 输出摘要
    print("\n" + "="*50)
    print("📊 评测结果摘要")
    print("="*50)
    print(f"✓ 成功：{success_count}")
    print(f"✗ 失败：{failed_count}")
    print("="*50)
    
    data_manager.print_summary()


async def main():
    await run_evaluation()


if __name__ == "__main__":
    asyncio.run(main())