export class ErrorUtil extends Error {
  constructor(
    public message: string,
    public service?: string,
    protected description?: string
  ) {
    // const internalMessage = `${this.code} - ${this.description} - ${this.message}`;
    const internalMessage = `'Unexpected error by the ${service} service';`;
    super(`${internalMessage}: ${message}`);
  }
}
