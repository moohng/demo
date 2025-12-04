# 重试失败的AI评测

## 问题说明

从您的测试结果看，遇到了Gemini API的配额限制：
- **每分钟限制**：Gemini 2.5 Pro 免费版每分钟只能请求2次
- **每天限制**：每天只能请求50次

## 解决方案

### 方案1：重试失败的评测（推荐）

我已经添加了 `--retry-failed` 参数支持：

```bash
# 只重新评测失败的项目（total_score为0的）
python evaluator.py --retry-failed
```

系统会：
1. 自动识别评测失败的项目（`total_score` 为 0）
2. 只对这些项目重新评测
3. 自动添加30秒延迟，避免触发速率限制

### 方案2：使用Gemini 1.5 Flash（更高配额）

修改 `evaluator.py` 中的模型：

```python
MODEL_NAME = "gemini-1.5-flash"  # 改回1.5 Flash
```

**Gemini 1.5 Flash 配额**：
- 每分钟：15次请求
- 每天：1500次请求

比 2.5 Pro 高很多！

### 方案3：切换到OpenAI（付费但稳定）

修改 `.env` 文件：

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
```

**优点**：
- 无严格速率限制
- 质量更稳定
- 速度更快

**成本**：约 $0.72 - $1.44 (72张图片)

## 使用步骤

### 当前情况分析

从您的数据看：
- 已成功评测：**50个** ✅
- 评测失败：**22个** ❌（触发配额限制）

### 推荐操作流程

#### 选项A：继续使用Gemini（免费）

1. **等待配额重置**（第二天）

2. **改用Gemini 1.5 Flash**（更高配额）：
```bash
# 修改 evaluator.py 第25行
MODEL_NAME = "gemini-1.5-flash"
```

3. **重试失败的评测**：
```bash
python evaluator.py --retry-failed
```

系统会自动：
- 只评测失败的22个项目
- 每次请求间隔30秒
- 总耗时约 11分钟（22 × 30秒）

#### 选项B：切换到OpenAI（快速完成）

1. **配置OpenAI**：
```bash
# .env文件
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
```

2. **重试失败的评测**：
```bash
python evaluator.py --retry-failed
```

**优点**：
- 2-3分钟完成
- 无需等待
- 质量更好

**成本**：约 $0.22（22张图片）

## 命令说明

```bash
# 评测所有未评测的项目
python evaluator.py

# 只重试失败的项目（推荐）
python evaluator.py --retry-failed
```

## 速率限制对比

| 模型 | 每分钟 | 每天 | 成本 |
|------|--------|------|------|
| Gemini 2.5 Pro | 2次 | 50次 | 免费 |
| Gemini 1.5 Flash | 15次 | 1500次 | 免费 |
| OpenAI GPT-4o | 无限制* | 无限制* | $0.01/张 |

*OpenAI有账户级别的限制，但对于72张图片完全够用

## 建议

**立即操作**：
```bash
# 1. 改用Gemini 1.5 Flash（修改evaluator.py第25行）
MODEL_NAME = "gemini-1.5-flash"

# 2. 重试失败的评测
python evaluator.py --retry-failed
```

这样可以在免费额度内快速完成所有评测！
