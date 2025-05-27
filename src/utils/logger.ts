enum level {
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
  }
  
  const coluor = {
    info: '\x1b[34m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m',
  };
  
  class logger {
    private log(level: level, message: string) {
      const time = new Date().toISOString();
      const msg = `${message}`;
      console.log(`[${time}]${coluor[level]} [${level.toUpperCase()}]${coluor.reset} ${msg}`); 
    }
  
    public information(message: string) { this.log(level.INFO, message); }
    public warning(message: string) { this.log(level.WARN, message); }
    public error(message: string) { this.log(level.ERROR, message); }
  }
  
  export default new logger();
  