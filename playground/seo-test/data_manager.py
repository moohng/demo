import json
import os
from datetime import datetime
from typing import List, Dict, Optional


class DataManager:
    """管理搜索引擎测试数据的持久化存储"""
    
    def __init__(self, data_file: str = "search_data.json"):
        self.data_file = data_file
        self.data = self._load_data()
    
    def _load_data(self) -> Dict:
        """加载现有数据，如果文件不存在则创建新数据结构"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                print(f"警告：{self.data_file} 格式错误，将创建新文件")
        
        return {
            "metadata": {
                "last_updated": None,
                "total_tests": 0,
                "success": 0,
                "failed": 0,
                "captcha": 0,
                "pending": 0
            },
            "results": []
        }
    
    def save_data(self):
        """保存数据到文件"""
        self.data["metadata"]["last_updated"] = datetime.now().isoformat()
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
        print(f"✓ 数据已保存到 {self.data_file}")
    
    def get_test_record(self, engine: str, keyword: str) -> Optional[Dict]:
        """获取指定测试的记录"""
        for record in self.data["results"]:
            if record["engine"] == engine and record["keyword"] == keyword:
                return record
        return None
    
    def update_test_record(self, engine: str, keyword: str, 
                          status: str, screenshot_path: str, 
                          error_message: Optional[str] = None):
        """更新或创建测试记录"""
        record = self.get_test_record(engine, keyword)
        
        if record:
            # 更新现有记录
            old_status = record["status"]
            record["status"] = status
            record["screenshot_path"] = screenshot_path
            record["timestamp"] = datetime.now().isoformat()
            record["error_message"] = error_message
            
            # 更新统计
            if old_status != status:
                self.data["metadata"][old_status] = max(0, self.data["metadata"].get(old_status, 0) - 1)
                self.data["metadata"][status] = self.data["metadata"].get(status, 0) + 1
        else:
            # 创建新记录
            new_record = {
                "engine": engine,
                "keyword": keyword,
                "status": status,
                "screenshot_path": screenshot_path,
                "timestamp": datetime.now().isoformat(),
                "error_message": error_message,
                "evaluation": None
            }
            self.data["results"].append(new_record)
            
            # 更新统计
            self.data["metadata"]["total_tests"] += 1
            self.data["metadata"][status] = self.data["metadata"].get(status, 0) + 1
    
    def update_evaluation(self, engine: str, keyword: str, evaluation: Dict):
        """更新测试记录的AI评测结果"""
        record = self.get_test_record(engine, keyword)
        if record:
            record["evaluation"] = evaluation
            record["evaluated_at"] = datetime.now().isoformat()
    
    def get_pending_tests(self, engines: Dict[str, str], keywords: List[str]) -> List[tuple]:
        """获取需要测试的项目（新测试或失败的测试）"""
        pending = []
        
        for engine in engines.keys():
            for keyword in keywords:
                record = self.get_test_record(engine, keyword)
                
                # 如果没有记录，或者状态为失败/验证码，则需要重新测试
                if not record or record["status"] in ["failed", "captcha", "pending"]:
                    pending.append((engine, keyword))
        
        return pending
    
    def get_successful_tests(self) -> List[Dict]:
        """获取所有成功的测试记录"""
        return [r for r in self.data["results"] if r["status"] == "success"]
    
    def get_unevaluated_tests(self) -> List[Dict]:
        """获取所有未评测的成功测试"""
        return [r for r in self.data["results"] 
                if r["status"] == "success" and r["evaluation"]["comment"].startswith("评测异常：")]
    
    def get_statistics(self) -> Dict:
        """获取统计信息"""
        stats = {
            "total": len(self.data["results"]),
            "success": 0,
            "failed": 0,
            "captcha": 0,
            "pending": 0,
            "evaluated": 0
        }
        
        for record in self.data["results"]:
            status = record["status"]
            stats[status] = stats.get(status, 0) + 1
            if record.get("evaluation"):
                stats["evaluated"] += 1
        
        return stats
    
    def print_summary(self):
        """打印数据摘要"""
        stats = self.get_statistics()
        print("\n" + "="*50)
        print("📊 测试数据摘要")
        print("="*50)
        print(f"总测试数：{stats['total']}")
        print(f"✓ 成功：{stats['success']}")
        print(f"✗ 失败：{stats['failed']}")
        print(f"🤖 验证码：{stats['captcha']}")
        print(f"⏳ 待处理：{stats['pending']}")
        print(f"📝 已评测：{stats['evaluated']}")
        print("="*50 + "\n")
