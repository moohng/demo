import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

const App = () => {
  const [code, setCode] = useState('// 在这里输入TypeScript代码\nconsole.log("Hello, TypeScript!");');
  const [logs, setLogs] = useState<string[]>([]);
  const [theme, setTheme] = useState('vs-dark');
  const [language, setLanguage] = useState('typescript');

  const runCode = () => {
    try {
      // 清空日志
      setLogs([]);
      
      // 重写console方法捕获日志
      const originalConsole = { ...console };
      const customConsole = {
        log: (...args: any[]) => {
          setLogs(prev => [...prev, args.join(' ')]);
          originalConsole.log(...args);
        },
        error: (...args: any[]) => {
          setLogs(prev => [...prev, `Error: ${args.join(' ')}`]);
          originalConsole.error(...args);
        }
      };
      
      // 执行代码
      window.console = customConsole as any;
      new Function(code)();
      window.console = originalConsole;
    } catch (error) {
      setLogs(prev => [...prev, `执行错误: ${error}`]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Editor
          height="90%"
          language={language}
          theme={theme}
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            automaticLayout: true,
            minimap: { enabled: false }
          }}
        />
        <div style={{ display: 'flex', gap: '8px', margin: '8px' }}>
          <button 
            onClick={runCode} 
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            title="运行代码"
          >
            <i className="i-ri:play-fill" />
          </button>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="appearance-none pl-8 pr-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="vs">浅色主题</option>
                <option value="vs-dark">深色主题</option>
                <option value="hc-black">高对比度</option>
              </select>
              {/* <i className="i-ri:play-fill absolute left-2 top-1/2 transform -translate-y-1/2" /> */}
            </div>
            <div className="relative group">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none pl-8 pr-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
              </select>
              <i className="i-ri:code-fill absolute left-2 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', background: '#1e1e1e', color: '#fff', padding: '8px' }}>
        <h3>控制台输出</h3>
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default App;