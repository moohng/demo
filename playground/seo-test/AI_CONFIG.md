# AI评测配置说明

## 问题说明

DeepSeek API 不支持图像输入（视觉能力），只支持文本。因此需要使用支持视觉能力的AI模型。

## 支持的AI模型

### 1. OpenAI GPT-4 Vision（推荐）

**优点**：
- 视觉能力强大
- 响应速度快
- 稳定性好

**配置方法**：

1. 在 `.env` 文件中添加：
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
```

2. 运行评测：
```bash
python evaluator.py
```

**费用**：
- GPT-4o: $2.50 / 1M input tokens, $10.00 / 1M output tokens
- 每张图片约 $0.01 - $0.02

### 2. Google Gemini

**优点**：
- 免费额度较大
- 支持中文
- 性能不错

**配置方法**：

1. 安装依赖：
```bash
pip install google-generativeai pillow
```

2. 在 `.env` 文件中添加：
```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
```

3. 运行评测：
```bash
python evaluator.py
```

**费用**：
- Gemini 1.5 Flash: 免费额度 15 RPM (每分钟请求数)
- Gemini 1.5 Pro: 免费额度 2 RPM

## 获取API密钥

### OpenAI API Key

1. 访问 https://platform.openai.com/api-keys
2. 登录或注册账号
3. 点击 "Create new secret key"
4. 复制密钥并保存

### Gemini API Key

1. 访问 https://makersuite.google.com/app/apikey
2. 登录Google账号
3. 点击 "Create API Key"
4. 复制密钥并保存

## .env 文件示例

创建 `.env` 文件在项目根目录：

```bash
# 选择AI提供商: openai 或 gemini
AI_PROVIDER=openai

# OpenAI配置
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Gemini配置（如果使用Gemini）
# GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxx
```

## 使用建议

### 小规模测试（<100张图片）
推荐使用 **Gemini 1.5 Flash**（免费）

### 大规模测试（>100张图片）
推荐使用 **OpenAI GPT-4o**（付费但更稳定）

### 预算有限
使用 **Gemini 1.5 Flash**，注意免费额度限制（15 RPM）

## 完整工作流程

```bash
# 1. 安装依赖
pip install openai python-dotenv
# 如果使用Gemini
pip install google-generativeai pillow

# 2. 配置.env文件
# 添加 AI_PROVIDER 和对应的 API_KEY

# 3. 运行评测
python evaluator.py

# 4. 生成报告
python report_generator.py
```

## 故障排除

### 问题1：API密钥无效
- 检查 `.env` 文件中的密钥是否正确
- 确认密钥没有过期
- OpenAI需要充值才能使用

### 问题2：速率限制
- Gemini免费版：降低并发，添加延迟
- OpenAI：升级到付费计划

### 问题3：图片太大
- 系统会自动处理
- 如果仍有问题，可以在代码中添加图片压缩

## 成本估算

### 72张图片的评测成本

**OpenAI GPT-4o**：
- 约 $0.72 - $1.44 (每张 $0.01-$0.02)

**Gemini 1.5 Flash**：
- 免费（在免费额度内）

## 注意事项

1. **API密钥安全**：不要将 `.env` 文件提交到Git仓库
2. **速率限制**：注意API的速率限制，避免被封禁
3. **成本控制**：使用OpenAI时注意成本，可以先小批量测试
4. **网络问题**：国内访问OpenAI可能需要代理
