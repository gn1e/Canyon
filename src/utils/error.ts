interface ErrResponse {
    errorCode: string;
    errorMessage: string;
    messageVars: string[];
    numericErrorCode: number;
    originatingService: string;
    intent: string;
    error_description: string;
    error: string;
  }
  
  function throwerr(
    errorCode: string,
    errorMessage: string,
    messageVars: string[],
    numericErrorCode: number,
    error: string,
    code: number,
    c: any
  ): Response {
    c.set({
      'X-Epic-Error-Name': errorCode,
      'X-Epic-Error-Code': numericErrorCode.toString(),
    });
  
    const response: ErrResponse = {
      errorCode,
      errorMessage,
      messageVars,
      numericErrorCode,
      originatingService: "any",
      intent: "prod",
      error_description: errorMessage,
      error,
    };
  
    return c.json(response, code);
  }
  
  
export { throwerr };
  