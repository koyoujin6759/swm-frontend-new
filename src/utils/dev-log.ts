type LogLevel = 'info' | 'warn' | 'error' | 'debug';
type LogData = string | number | Record<string, unknown> | unknown;

interface DevLogOptions {
  level?: LogLevel;
  timestamp?: boolean;
  stackTrace?: boolean;
}

export const devLog = {
  info: (from: string, data: LogData, options?: DevLogOptions) => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const timestamp = options?.timestamp ? `[${new Date().toISOString()}]` : '';
    console.log(
      `%c${timestamp} 📘 INFO [${from}]:`,
      'color: #2196F3; font-weight: bold;',
      data,
    );
    if (options?.stackTrace) console.trace('Stack trace:');
  },

  warn: (from: string, data: LogData, options?: DevLogOptions) => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const timestamp = options?.timestamp ? `[${new Date().toISOString()}]` : '';
    console.warn(
      `%c${timestamp} ⚠️ WARNING [${from}]:`,
      'color: #FFC107; font-weight: bold;',
      data,
    );
    if (options?.stackTrace) console.trace('Stack trace:');
  },

  error: (from: string, data: LogData, options?: DevLogOptions) => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const timestamp = options?.timestamp ? `[${new Date().toISOString()}]` : '';
    console.error(
      `%c${timestamp} 🔥 ERROR [${from}]:`,
      'color: #F44336; font-weight: bold;',
      data,
    );
    if (options?.stackTrace) console.trace('Stack trace:');
  },

  debug: (from: string, data: LogData, options?: DevLogOptions) => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const timestamp = options?.timestamp ? `[${new Date().toISOString()}]` : '';
    console.debug(
      `%c${timestamp} 🔍 DEBUG [${from}]:`,
      'color: #9C27B0; font-weight: bold;',
      data,
    );
    if (options?.stackTrace) console.trace('Stack trace:');
  },

  table: (from: string, data: Record<string, unknown>[]) => {
    if (process.env.NODE_ENV !== 'development') return;
    
    console.log(`📊 TABLE [${from}]:`);
    console.table(data);
  },

  time: (label: string) => {
    if (process.env.NODE_ENV !== 'development') return;
    console.time(`⏱️ ${label}`);
  },

  timeEnd: (label: string) => {
    if (process.env.NODE_ENV !== 'development') return;
    console.timeEnd(`⏱️ ${label}`);
  },
};
