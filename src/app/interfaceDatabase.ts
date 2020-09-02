export interface Database {
  init() : any;
  userAutenticated(): Promise<boolean>;
}
