import json
import sys
from data_manager import DataManager


def analyze_search_data():
    """分析搜索引擎评测数据并生成总结"""
    data_manager = DataManager()
    
    # 按搜索引擎分组统计
    engine_stats = {}
    
    for result in data_manager.data["results"]:
        if result["status"] != "success" or not result.get("evaluation"):
            continue
        
        engine = result["engine"]
        eval_data = result["evaluation"]
        
        # 跳过评测失败的数据
        if eval_data.get("total_score", 0) == 0:
            continue
        
        if engine not in engine_stats:
            engine_stats[engine] = {
                "count": 0,
                "accuracy_scores": [],
                "ad_scores": [],
                "quality_scores": [],
                "ux_scores": [],
                "total_scores": [],
                "comments": []
            }
        
        stats = engine_stats[engine]
        stats["count"] += 1
        stats["accuracy_scores"].append(eval_data.get("accuracy_score", 0))
        stats["ad_scores"].append(eval_data.get("ad_score", 0))
        stats["quality_scores"].append(eval_data.get("quality_score", 0))
        stats["ux_scores"].append(eval_data.get("ux_score", 0))
        stats["total_scores"].append(eval_data.get("total_score", 0))
        stats["comments"].append(eval_data.get("comment", ""))
    
    # 计算平均分
    engine_summaries = []
    for engine, stats in engine_stats.items():
        if stats["count"] == 0:
            continue
        
        summary = {
            "engine": engine,
            "count": stats["count"],
            "avg_accuracy": sum(stats["accuracy_scores"]) / stats["count"],
            "avg_ad": sum(stats["ad_scores"]) / stats["count"],
            "avg_quality": sum(stats["quality_scores"]) / stats["count"],
            "avg_ux": sum(stats["ux_scores"]) / stats["count"],
            "avg_total": sum(stats["total_scores"]) / stats["count"],
            "comments": stats["comments"]
        }
        engine_summaries.append(summary)
    
    # 按总分排序
    engine_summaries.sort(key=lambda x: x["avg_total"], reverse=True)
    
    return engine_summaries


def generate_summary_prompt(engine_summaries):
    """生成AI总结的提示词"""
    prompt = """请根据以下搜索引擎评测数据，为每个搜索引擎生成简短的文字总结（每个100字以内）。

评测维度说明：
- 精准度（0-10）：搜索结果与关键词的相关性和权威性
- 广告占比（0-10）：广告越少分数越高
- 页面质量（0-10）：布局清晰度、信息密度
- 用户体验（0-10）：可读性、关键信息突出度

评测数据：

"""
    
    for i, summary in enumerate(engine_summaries, 1):
        prompt += f"{i}. **{summary['engine']}**\n"
        prompt += f"   - 评测数量：{summary['count']}个\n"
        prompt += f"   - 综合得分：{summary['avg_total']:.2f}/10\n"
        prompt += f"   - 精准度：{summary['avg_accuracy']:.2f}/10\n"
        prompt += f"   - 广告占比：{summary['avg_ad']:.2f}/10\n"
        prompt += f"   - 页面质量：{summary['avg_quality']:.2f}/10\n"
        prompt += f"   - 用户体验：{summary['avg_ux']:.2f}/10\n"
        prompt += f"   - 部分评价摘录：\n"
        # 随机选择3条评价
        import random
        sample_comments = random.sample(summary['comments'], min(3, len(summary['comments'])))
        for comment in sample_comments:
            prompt += f"     * {comment[:80]}...\n"
        prompt += "\n"
    
    prompt += """
请为每个搜索引擎生成一段简短总结（100字以内），包括：
1. 整体表现特点
2. 主要优势
3. 主要不足

请以JSON格式返回：
{
  "搜索引擎名": "总结文字",
  ...
}
"""
    
    return prompt


def main():
    print("📊 正在分析评测数据...")
    
    # 分析数据
    engine_summaries = analyze_search_data()
    
    if not engine_summaries:
        print("✗ 没有可用的评测数据")
        return
    
    # 生成提示词
    prompt = generate_summary_prompt(engine_summaries)
    
    # 保存提示词到文件
    with open("summary_prompt.txt", "w", encoding="utf-8") as f:
        f.write(prompt)
    
    print(f"✓ 已生成AI总结提示词，保存到 summary_prompt.txt")
    print(f"✓ 共分析了 {len(engine_summaries)} 个搜索引擎")
    print("\n" + "="*50)
    print("📈 搜索引擎排名（按综合得分）：")
    print("="*50)
    
    for i, summary in enumerate(engine_summaries, 1):
        print(f"{i}. {summary['engine']}: {summary['avg_total']:.2f}/10")
        print(f"   精准度:{summary['avg_accuracy']:.2f} | 广告:{summary['avg_ad']:.2f} | 质量:{summary['avg_quality']:.2f} | 体验:{summary['avg_ux']:.2f}")
        print()
    
    print("="*50)
    print("\n💡 下一步：")
    print("1. 查看 summary_prompt.txt 文件")
    print("2. 将内容复制到AI模型（如ChatGPT、Claude等）")
    print("3. 获取总结后，可以添加到报告中")


if __name__ == "__main__":
    main()
