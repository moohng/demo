# 解决验证码问题的方案

## 已实现的改进

### 1. 增强反检测能力

**随机行为模拟**：
- 随机延迟（1-2秒访问，3-5秒等待加载）
- 随机鼠标移动（2-4次，随机位置）
- 随机测试间隔（1.5-3秒）

**浏览器参数优化**：
```python
args=[
    '--disable-blink-features=AutomationControlled',  # 禁用自动化控制特征
    '--disable-dev-shm-usage',
    '--no-sandbox',
]
```

**更完整的反检测脚本**：
- 隐藏 `navigator.webdriver` 属性
- 伪装 `window.chrome` 对象
- 伪装 `navigator.permissions`
- 伪装 `navigator.plugins`
- 伪装 `navigator.languages`

### 2. 手动验证码处理模式

**使用方法**：
```bash
# 启用手动验证码处理
python test.py --retry-failed --manual-captcha
```

**工作流程**：
1. 系统检测到验证码时会暂停
2. 提示用户在浏览器中手动完成验证
3. 用户完成验证后按回车继续
4. 系统重新检测并继续测试

## 使用建议

### 方案1：手动处理验证码（推荐用于Google和Brave）

```bash
# 只重试失败的项目，并启用手动验证码处理
python test.py --retry-failed --manual-captcha
```

**优点**：
- 100%成功率
- 不需要额外工具
- 适合小批量测试

**缺点**：
- 需要人工干预
- 不适合大规模自动化

### 方案2：使用代理IP（推荐用于大规模测试）

修改 `test.py` 中的浏览器配置：

```python
browser = await p.chromium.launch_persistent_context(
    user_data_dir="browser_profile_1",
    headless=False,
    viewport={"width": 1280, "height": 1000},
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    locale="zh-CN",
    geolocation={"longitude": 121.47, "latitude": 31.23},
    timezone_id="Asia/Shanghai",
    proxy={
        "server": "http://your-proxy-server:port",
        "username": "username",  # 可选
        "password": "password"   # 可选
    },
    args=[
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
    ]
)
```

**推荐代理服务**：
- 亮数据（Bright Data）
- Smartproxy
- Oxylabs
- 国内：阿布云、快代理

### 方案3：分批测试

将容易触发验证码的搜索引擎单独测试：

```python
# 在 test.py 中临时注释掉Google和Brave
SEARCH_ENGINES = {
    "百度": "https://www.baidu.com/s?wd=",
    "搜狗": "https://www.sogou.com/web?query=",
    "夸克": "https://ai.quark.cn/s?q=",
    # "Google": "https://www.google.com/search?q=",
    # "Bing": "https://www.bing.com/search?q=",
    # "Brave": "https://search.brave.com/search?q="
}
```

然后单独测试Google和Brave：
```bash
# 先测试国内搜索引擎
python test.py

# 再启用手动模式测试Google和Brave
python test.py --retry-failed --manual-captcha
```

### 方案4：使用Stealth插件（实验性）

安装插件：
```bash
pip install playwright-stealth
```

修改 `test.py`：
```python
from playwright_stealth import stealth_async

# 在创建页面后
page = await browser.new_page()
await stealth_async(page)  # 应用stealth
```

## 当前测试结果分析

根据您的测试结果：
- **成功**：55/72 (76.4%)
- **验证码**：17/72 (23.6%)
  - Google：12个全部触发验证码
  - Brave：5个触发验证码

**建议策略**：
1. 对于国内搜索引擎（百度、搜狗、夸克、Bing）：正常运行 ✅
2. 对于Google：使用手动验证码模式或代理IP
3. 对于Brave：使用手动验证码模式或代理IP

## 完整工作流程示例

```bash
# 步骤1：首次运行（测试所有搜索引擎）
python test.py

# 步骤2：查看失败项目
# 查看 search_data.json 中的 captcha 状态

# 步骤3：手动处理验证码重试
python test.py --retry-failed --manual-captcha

# 步骤4：运行AI评测
python evaluator.py

# 步骤5：生成报告
python report_generator.py
```

## 命令行参数说明

```bash
# 完整测试模式
python test.py

# 只重试失败的项目
python test.py --retry-failed

# 启用手动验证码处理
python test.py --manual-captcha

# 组合使用
python test.py --retry-failed --manual-captcha
```

## 注意事项

1. **手动验证码模式**：需要在浏览器窗口中手动完成验证，完成后在终端按回车
2. **代理IP**：需要购买代理服务，成本较高但效果最好
3. **随机延迟**：已自动启用，无需额外配置
4. **浏览器配置**：使用持久化配置可以保持登录状态，减少验证码触发
