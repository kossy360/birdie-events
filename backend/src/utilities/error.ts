export class AppError {
  code: number;
  message: string;
  error?: string | Record<string, unknown>;

  constructor(
    message: string,
    code: number,
    error?: string | Record<string, unknown>
  ) {
    this.code = code;
    this.message = message;
    this.error = error;
  }
}
