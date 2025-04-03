import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Editor from '@monaco-editor/react';

const App = () => {
  const [code, setCode] = useState('// 在这里输入TypeScript代码\nconsole.log("Hello, TypeScript!");');
  const [logs, setLogs] = useState<string[]>([]);

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
          defaultLanguage="typescript"
          value={code}
          onChange={(value) => setCode(value || '')}
        />
        <button onClick={runCode} style={{ padding: '8px 16px', margin: '8px' }}>
          运行代码
        </button>
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

ReactDOM.render(<App />, document.getElementById('app'));