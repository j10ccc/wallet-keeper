declare namespace Common {
  interface IResponse<T> {
    code: number;
    msg: string;
    data: T;
  }
}
