export interface CrudResponse<T = unknown> {
  module: string;
  action: string;
  data?: T;
  message?: string;
}

export function response<T>(module: string, action: string, data?: T): CrudResponse<T> {
  return {
    module,
    action,
    data,
    message: `${module}.${action} scaffold ready`,
  };
}
