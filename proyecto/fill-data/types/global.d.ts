declare interface IEnvironmentVariables {
  ORACLE_CONNECT_STRING: string;
}

declare namespace NodeJS {
  export interface ProcessEnv extends IEnvironmentVariables {
    TZ?: string | undefined;
  }
}
