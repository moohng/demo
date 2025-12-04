import json
import os
from datetime import datetime
from data_manager import DataManager


class ReportGenerator:
    """生成搜索引擎测评报告"""
    
    def __init__(self, data_manager: DataManager):
        self.data_manager = data_manager
        self.data = data_manager.data
    
    def generate_json_report(self, output_file="search_report.json"):
        """生成JSON格式的详细报告"""
        report = {
            "generated_at": datetime.now().isoformat(),
            "metadata": self.data["metadata"],
            "statistics": self._calculate_statistics(),
            "rankings": self._calculate_rankings(),
            "details": self._organize_by_engine()
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"✓ JSON报告已生成：{output_file}")
        return report
    
    def generate_markdown_report(self, output_file="search_report.md"):
        """生成Markdown格式的可读报告"""
        stats = self._calculate_statistics()
        rankings = self._calculate_rankings()
        
        md_lines = []
        md_lines.append("# 搜索引擎测评报告\n")
        md_lines.append(f"**生成时间**：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        md_lines.append("---\n")
        
        # 总体统计
        md_lines.append("## 📊 总体统计\n")
        md_lines.append(f"- **总测试数**：{stats['total_tests']}")
        md_lines.append(f"- **成功测试**：{stats['successful_tests']} ({stats['success_rate']:.1f}%)")
        md_lines.append(f"- **失败测试**：{stats['failed_tests']}")
        md_lines.append(f"- **验证码拦截**：{stats['captcha_tests']}")
        md_lines.append(f"- **已评测数**：{stats['evaluated_tests']}\n")
        
        # 搜索引擎排名
        md_lines.append("## 🏆 搜索引擎综合排名\n")
        md_lines.append("| 排名 | 搜索引擎 | 综合得分 | 精准度 | 广告占比 | 页面质量 | 用户体验 | 评测数 |")
        md_lines.append("|------|----------|----------|--------|----------|----------|----------|--------|")
        
        for i, rank in enumerate(rankings, 1):
            md_lines.append(
                f"| {i} | {rank['engine']} | "
                f"{rank['avg_total']:.2f} | "
                f"{rank['avg_accuracy']:.2f} | "
                f"{rank['avg_ad']:.2f} | "
                f"{rank['avg_quality']:.2f} | "
                f"{rank['avg_ux']:.2f} | "
                f"{rank['count']} |"
            )
        
        md_lines.append("")
        
        # 各搜索引擎详细表现
        md_lines.append("## 📝 详细评测结果\n")
        
        for engine_data in self._organize_by_engine():
            engine = engine_data["engine"]
            results = engine_data["results"]
            
            md_lines.append(f"### {engine}\n")
            
            # 统计该搜索引擎的平均分
            evaluated = [r for r in results if r.get("evaluation")]
            if evaluated:
                avg_total = sum(r["evaluation"]["total_score"] for r in evaluated) / len(evaluated)
                md_lines.append(f"**平均得分**：{avg_total:.2f}/10\n")
            
            md_lines.append("| 关键词 | 状态 | 总分 | 精准度 | 广告 | 质量 | 体验 | 评价 |")
            md_lines.append("|--------|------|------|--------|------|------|------|------|")
            
            for result in results:
                keyword = result["keyword"]
                status = result["status"]
                
                if status == "success" and result.get("evaluation"):
                    eval_data = result["evaluation"]
                    md_lines.append(
                        f"| {keyword} | ✓ | "
                        f"{eval_data['total_score']:.1f} | "
                        f"{eval_data['accuracy_score']} | "
                        f"{eval_data['ad_score']} | "
                        f"{eval_data['quality_score']} | "
                        f"{eval_data['ux_score']} | "
                        f"{eval_data.get('comment', '')[:30]}... |"
                    )
                elif status == "captcha":
                    md_lines.append(f"| {keyword} | 🤖 验证码 | - | - | - | - | - | - |")
                elif status == "failed":
                    md_lines.append(f"| {keyword} | ✗ 失败 | - | - | - | - | - | - |")
                else:
                    md_lines.append(f"| {keyword} | ⏳ 待处理 | - | - | - | - | - | - |")
            
            md_lines.append("")
        
        # 写入文件
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(md_lines))
        
        print(f"✓ Markdown报告已生成：{output_file}")
    
    def _calculate_statistics(self):
        """计算统计数据"""
        results = self.data["results"]
        
        total = len(results)
        successful = sum(1 for r in results if r["status"] == "success")
        failed = sum(1 for r in results if r["status"] == "failed")
        captcha = sum(1 for r in results if r["status"] == "captcha")
        evaluated = sum(1 for r in results if r.get("evaluation"))
        
        return {
            "total_tests": total,
            "successful_tests": successful,
            "failed_tests": failed,
            "captcha_tests": captcha,
            "evaluated_tests": evaluated,
            "success_rate": (successful / total * 100) if total > 0 else 0
        }
    
    def _calculate_rankings(self):
        """计算搜索引擎排名"""
        engine_scores = {}
        
        for result in self.data["results"]:
            if result["status"] == "success" and result.get("evaluation"):
                engine = result["engine"]
                eval_data = result["evaluation"]
                
                if engine not in engine_scores:
                    engine_scores[engine] = {
                        "total_scores": [],
                        "accuracy_scores": [],
                        "ad_scores": [],
                        "quality_scores": [],
                        "ux_scores": []
                    }
                
                engine_scores[engine]["total_scores"].append(eval_data.get("total_score", 0))
                engine_scores[engine]["accuracy_scores"].append(eval_data.get("accuracy_score", 0))
                engine_scores[engine]["ad_scores"].append(eval_data.get("ad_score", 0))
                engine_scores[engine]["quality_scores"].append(eval_data.get("quality_score", 0))
                engine_scores[engine]["ux_scores"].append(eval_data.get("ux_score", 0))
        
        # 计算平均分并排序
        rankings = []
        for engine, scores in engine_scores.items():
            rankings.append({
                "engine": engine,
                "avg_total": sum(scores["total_scores"]) / len(scores["total_scores"]),
                "avg_accuracy": sum(scores["accuracy_scores"]) / len(scores["accuracy_scores"]),
                "avg_ad": sum(scores["ad_scores"]) / len(scores["ad_scores"]),
                "avg_quality": sum(scores["quality_scores"]) / len(scores["quality_scores"]),
                "avg_ux": sum(scores["ux_scores"]) / len(scores["ux_scores"]),
                "count": len(scores["total_scores"])
            })
        
        # 按总分排序
        rankings.sort(key=lambda x: x["avg_total"], reverse=True)
        return rankings
    
    def _organize_by_engine(self):
        """按搜索引擎组织数据"""
        engine_data = {}
        
        for result in self.data["results"]:
            engine = result["engine"]
            if engine not in engine_data:
                engine_data[engine] = []
            engine_data[engine].append(result)
        
        return [{"engine": k, "results": v} for k, v in engine_data.items()]


def main():
    """生成报告"""
    data_manager = DataManager()
    
    if not data_manager.data["results"]:
        print("✗ 没有数据，请先运行测试")
        return
    
    generator = ReportGenerator(data_manager)
    
    print("\n📄 开始生成报告...")
    print("="*50)
    
    # 生成JSON报告
    generator.generate_json_report()
    
    # 生成Markdown报告
    generator.generate_markdown_report()
    
    print("="*50)
    print("✓ 报告生成完成！\n")
    
    # 显示摘要
    data_manager.print_summary()


if __name__ == "__main__":
    main()
