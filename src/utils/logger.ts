enum level {
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    DEBUG = 'debug',
  }
  
  const coluor = {
    info: '\x1b[34m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    debug: '\x1b[35m',
    reset: '\x1b[0m',
  };
  
  class logger {
    private log(level: level, message: string) {
      const time = new Date().toISOString();
      const msg = `${message}`;
      console.log(`[${time}]${coluor[level]} [${level.toUpperCase()}]${coluor.reset} ${msg}`); // Really bad imo, and isnt proper.
    }
  
    public info(message: string) { this.log(level.INFO, message); }
    public warn(message: string) { this.log(level.WARN, message); }
    public error(message: string) { this.log(level.ERROR, message); }
    public debug(message: string) { this.log(level.DEBUG, message); }
  }
  
  export default new logger();
  