import asyncio
import os
import sys
import random
from playwright.async_api import async_playwright
from data_manager import DataManager


SEARCH_ENGINES = {
    "百度": "https://www.baidu.com/s?wd=",
    "搜狗": "https://www.sogou.com/web?query=",
    "夸克": "https://ai.quark.cn/s?q=",
    "Google": "https://www.google.com/search?q=",
    "Bing": "https://www.bing.com/search?q=",
    "Brave": "https://search.brave.com/search?q="
}

ACCURACY_KEYWORDS = [
    "vscode 扩展 esbuild external 错误",
    "RTCPeerConnection 文件传输慢原因",
    "http2 和 http3 有什么区别",
    "Git 交互式 rebase 教程",
    "Docker 网络 bridge 与 host 区别",
    "IPv6 地址结构"
]

AD_KEYWORDS = [
    "最便宜的机票",
    "个人贷款利率",
    "汽车保险报价",
    "AI 工具免费版",
    "减肥方法有效",
    "微信电脑版下载"
]

OUTPUT_DIR = "search_screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)


async def detect_page_anomaly(page, engine_name):
    """检测页面是否存在异常（验证码、错误页面等）"""
    try:
        # 获取页面内容
        content = await page.content()
        title = await page.title()
        
        # 检测验证码相关关键词
        captcha_keywords = [
            "验证码", "captcha", "人机验证", "安全验证",
            "请输入验证码", "滑动验证", "点击验证",
            "robot check", "security check", "verify"
        ]
        
        content_lower = content.lower()
        title_lower = title.lower()
        
        for keyword in captcha_keywords:
            if keyword in content_lower or keyword in title_lower:
                return "captcha", f"检测到验证码：{keyword}"
        
        # 检测错误页面
        error_keywords = [
            "404", "500", "503", "error",
            "页面不存在", "page not found", "服务器错误",
            "network error", "连接超时"
        ]
        
        for keyword in error_keywords:
            if keyword in title_lower:
                return "failed", f"检测到错误页面：{keyword}"
        
        # 检测页面是否基本加载完成（根据不同搜索引擎检测关键元素）
        if engine_name == "百度":
            has_results = await page.locator("#content_left, #results").count() > 0
        elif engine_name == "Google":
            has_results = await page.locator("#search, #rso").count() > 0
        elif engine_name == "Bing":
            has_results = await page.locator("#b_results").count() > 0
        else:
            # 其他搜索引擎简单检测是否有内容
            has_results = len(content) > 1000
        
        if not has_results:
            return "failed", "页面未正常加载，缺少搜索结果元素"
        
        return "success", None
        
    except Exception as e:
        return "failed", f"异常检测失败：{str(e)}"


async def capture_screenshot(page, engine_name, keyword, data_manager, manual_captcha=False):
    """执行搜索、检测异常并截图"""
    url = SEARCH_ENGINES[engine_name] + keyword.replace(" ", "+")
    filename = f"{OUTPUT_DIR}/{engine_name}_{keyword}.png"
    
    try:
        print(f"\n🔍 测试：{engine_name} / {keyword}")
        
        # 随机延迟（模拟人类行为）
        await page.wait_for_timeout(random.randint(1000, 2000))
        
        # 访问页面
        await page.goto(url, timeout=30000)
        
        # 随机等待时间
        await page.wait_for_timeout(random.randint(3000, 5000))
        
        # 模拟随机鼠标移动（避免被检测）
        for _ in range(random.randint(2, 4)):
            await page.mouse.move(
                random.randint(100, 500), 
                random.randint(200, 600)
            )
            await page.wait_for_timeout(random.randint(200, 500))
        
        # 检测页面异常
        status, error_message = await detect_page_anomaly(page, engine_name)
        
        # 如果检测到验证码且启用手动模式，等待用户处理
        if status == "captcha" and manual_captcha:
            print(f"⚠️  检测到验证码！")
            print(f"📌 请在浏览器中手动完成验证，完成后按回车继续...")
            input()  # 等待用户按回车
            
            # 重新检测
            await page.wait_for_timeout(2000)
            status, error_message = await detect_page_anomaly(page, engine_name)
            if status == "success":
                print(f"✓ 验证码已通过")
        
        # 截图
        await page.screenshot(path=filename, full_page=True)
        
        # 更新数据
        data_manager.update_test_record(
            engine=engine_name,
            keyword=keyword,
            status=status,
            screenshot_path=filename,
            error_message=error_message
        )
        
        # 输出结果
        if status == "success":
            print(f"✓ 成功：{filename}")
        elif status == "captcha":
            print(f"🤖 验证码：{error_message}")
        else:
            print(f"✗ 失败：{error_message}")
        
        return status, filename
        
    except Exception as e:
        error_msg = f"截图失败：{str(e)}"
        print(f"✗ {error_msg}")
        
        data_manager.update_test_record(
            engine=engine_name,
            keyword=keyword,
            status="failed",
            screenshot_path=filename,
            error_message=error_msg
        )
        
        return "failed", filename


async def run_capture(retry_failed_only=False, manual_captcha=False):
    """运行截图测试"""
    data_manager = DataManager()
    
    if manual_captcha:
        print("\n🔧 手动验证码模式已启用")
    
    # 确定需要测试的项目
    if retry_failed_only:
        all_keywords = ACCURACY_KEYWORDS + AD_KEYWORDS
        pending_tests = data_manager.get_pending_tests(SEARCH_ENGINES, all_keywords)
        print(f"\n🔄 重试模式：将重新测试 {len(pending_tests)} 个失败/待处理的项目")
    else:
        pending_tests = []
        for engine in SEARCH_ENGINES.keys():
            for kw in ACCURACY_KEYWORDS + AD_KEYWORDS:
                pending_tests.append((engine, kw))
        print(f"\n🚀 完整测试模式：将测试 {len(pending_tests)} 个项目")
    
    if not pending_tests:
        print("✓ 没有需要测试的项目")
        data_manager.print_summary()
        return
    
    async with async_playwright() as p:
        # 启动浏览器（使用更多反检测参数）
        browser = await p.chromium.launch_persistent_context(
            user_data_dir="browser_profile_1",
            headless=False,
            viewport={"width": 1280, "height": 1000},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            locale="zh-CN",
            geolocation={"longitude": 121.47, "latitude": 31.23},
            timezone_id="Asia/Shanghai",
            # 添加更多参数避免检测
            args=[
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--no-sandbox',
            ]
        )
        
        page = await browser.new_page()
        
        # 注入更完整的反检测脚本
        await page.add_init_script("""
            // 隐藏webdriver属性
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
            
            // 伪装Chrome对象
            window.chrome = {
                runtime: {}
            };
            
            // 伪装permissions
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );
            
            // 伪装plugins
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5]
            });
            
            // 伪装languages
            Object.defineProperty(navigator, 'languages', {
                get: () => ['zh-CN', 'zh', 'en']
            });
        """)
        
        # 执行测试
        success_count = 0
        failed_count = 0
        captcha_count = 0
        
        for i, (engine, keyword) in enumerate(pending_tests, 1):
            print(f"\n进度：{i}/{len(pending_tests)}")
            status, _ = await capture_screenshot(page, engine, keyword, data_manager, manual_captcha)
            
            if status == "success":
                success_count += 1
            elif status == "captcha":
                captcha_count += 1
            else:
                failed_count += 1
            
            # 每个测试之间随机延迟（模拟人类行为）
            await page.wait_for_timeout(random.randint(1500, 3000))
        
        await browser.close()
        
        # 保存数据
        data_manager.save_data()
        
        # 输出摘要
        print("\n" + "="*50)
        print("📊 本次测试结果")
        print("="*50)
        print(f"✓ 成功：{success_count}")
        print(f"✗ 失败：{failed_count}")
        print(f"🤖 验证码：{captcha_count}")
        print("="*50)
        
        data_manager.print_summary()


async def main():
    # 检查命令行参数
    retry_failed_only = "--retry-failed" in sys.argv
    manual_captcha = "--manual-captcha" in sys.argv
    
    await run_capture(retry_failed_only, manual_captcha)


if __name__ == "__main__":
    asyncio.run(main())
