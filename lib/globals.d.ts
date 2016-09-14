declare interface IError extends Error {
  code?: number;
  stack?: string;
}
