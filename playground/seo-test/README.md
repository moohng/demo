# 搜索引擎测评系统

一个基于AI的搜索引擎自动化测评系统，支持截图、异常检测、AI评测和报告生成。

## 功能特性

- ✅ **自动截图**：自动访问多个搜索引擎并截图保存
- ✅ **异常检测**：智能检测验证码、错误页面等异常情况
- ✅ **增量更新**：只重新处理失败的测试，提高效率
- ✅ **AI评测**：使用大模型对截图进行多维度评分
- ✅ **报告生成**：自动生成JSON和Markdown格式的详细报告
- ✅ **数据持久化**：所有测试数据保存为JSON，支持断点续传

## 系统架构

```
seo-test/
├── data_manager.py       # 数据管理模块
├── test.py              # 截图测试模块
├── evaluator.py         # AI评测模块
├── report_generator.py  # 报告生成模块
├── search_data.json     # 测试数据（自动生成）
├── search_report.json   # JSON报告（自动生成）
├── search_report.md     # Markdown报告（自动生成）
└── search_screenshots/  # 截图目录（自动生成）
```

## 环境要求

- Python 3.8+
- Playwright
- OpenAI SDK

## 安装依赖

```bash
# 安装Python依赖
pip install playwright openai

# 安装Playwright浏览器
playwright install chromium
```

## 配置

设置环境变量 `DP_API_KEY` 为你的DeepSeek API密钥：

```bash
# Windows
set DP_API_KEY=your_api_key_here

# Linux/Mac
export DP_API_KEY=your_api_key_here
```

## 使用方法

### 1. 运行截图测试

**首次运行（测试所有项目）：**

```bash
python test.py
```

**重试失败项目：**

```bash
python test.py --retry-failed
```

系统会：
- 自动访问各个搜索引擎
- 检测页面是否正常加载
- 保存截图到 `search_screenshots/` 目录
- 将测试结果保存到 `search_data.json`

### 2. 运行AI评测

```bash
python evaluator.py
```

系统会：
- 读取所有成功的截图
- 使用AI模型进行多维度评分
- 更新评测结果到 `search_data.json`

### 3. 生成报告

```bash
python report_generator.py
```

系统会生成：
- `search_report.json` - 详细的JSON格式报告
- `search_report.md` - 可读的Markdown格式报告

## 测试覆盖

### 搜索引擎

- 百度
- 搜狗
- 夸克
- Google
- Bing
- Brave

### 测试关键词

**精准度测试**（技术类关键词）：
- vscode 扩展 esbuild external 错误
- RTCPeerConnection 文件传输慢原因
- http2 和 http3 有什么区别
- Git 交互式 rebase 教程
- Docker 网络 bridge 与 host 区别
- IPv6 地址结构

**广告测试**（商业类关键词）：
- 最便宜的机票
- 个人贷款利率
- 汽车保险报价
- AI 工具免费版
- 减肥方法有效
- 微信电脑版下载

## 评测维度

AI评测包含以下4个维度（每项0-10分）：

1. **精准度得分**：搜索结果与关键词的相关性、权威性
2. **广告占比得分**：广告数量和干扰程度（分数越高表示广告越少）
3. **页面质量得分**：页面布局、信息密度、干扰元素
4. **用户体验得分**：可读性、关键信息突出度、视觉体验

**综合得分** = (精准度 + 广告占比 + 页面质量 + 用户体验) / 4

## 数据格式

### search_data.json

```json
{
  "metadata": {
    "last_updated": "2025-12-04T18:57:21+08:00",
    "total_tests": 72,
    "success": 60,
    "failed": 10,
    "captcha": 2
  },
  "results": [
    {
      "engine": "百度",
      "keyword": "vscode 扩展 esbuild external 错误",
      "status": "success",
      "screenshot_path": "search_screenshots/百度_vscode 扩展 esbuild external 错误.png",
      "timestamp": "2025-12-04T18:30:00+08:00",
      "error_message": null,
      "evaluation": {
        "accuracy_score": 8,
        "ad_score": 6,
        "quality_score": 7,
        "ux_score": 7,
        "total_score": 7.0,
        "comment": "搜索结果较为准确，但广告较多..."
      }
    }
  ]
}
```

## 异常处理

系统会自动检测以下异常情况：

- **验证码拦截**：检测到人机验证页面，状态标记为 `captcha`
- **页面错误**：404、500等错误页面，状态标记为 `failed`
- **加载失败**：页面未正常加载，状态标记为 `failed`

异常数据会被标记，可以使用 `--retry-failed` 参数重新测试。

## 工作流程

```
1. 运行 test.py
   ↓
   访问搜索引擎 → 检测异常 → 截图 → 保存数据
   ↓
2. 运行 evaluator.py
   ↓
   读取成功截图 → AI评测 → 更新数据
   ↓
3. 运行 report_generator.py
   ↓
   统计分析 → 生成排名 → 输出报告
```

## 注意事项

1. **浏览器配置**：系统使用持久化浏览器配置（`browser_profile/`），可以保持登录状态
2. **反检测**：已配置反爬虫检测脚本，但某些搜索引擎仍可能触发验证码
3. **API限流**：评测时会自动延迟1秒，避免API限流
4. **数据备份**：建议定期备份 `search_data.json` 文件

## 扩展开发

### 添加新的搜索引擎

在 `test.py` 中修改 `SEARCH_ENGINES` 字典：

```python
SEARCH_ENGINES = {
    "新引擎": "https://example.com/search?q=",
    # ...
}
```

### 添加新的测试关键词

在 `test.py` 中修改 `ACCURACY_KEYWORDS` 或 `AD_KEYWORDS` 列表：

```python
ACCURACY_KEYWORDS = [
    "新关键词1",
    "新关键词2",
    # ...
]
```

### 自定义评测维度

在 `evaluator.py` 中修改 `EVAL_PROMPT` 提示词，添加新的评测维度。

## 许可证

MIT License
