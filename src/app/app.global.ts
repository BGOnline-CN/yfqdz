import { Storage } from '@ionic/storage';

export class AppGlobal {
  private static instance: AppGlobal = new AppGlobal();
  
  /**是否是调试状态 */
  isDebug: boolean = true;
  rootUrl: string = this.isDebug ? "http://192.168.2.43/api/api.php" : "http://localhost";

  // 登录态
  loginStatus: any = this.loginStatus || false;

  constructor() {
    if(AppGlobal.instance) {
      throw new Error("错误: 请使用AppGlobal.getInstance() 代替使用new.");
    }
    AppGlobal.instance = this;
  }

  /**
   * 获取当前实例
   * 
   * @static
   * @returns {AppGlobal}
   */
  public static getInstance(): AppGlobal {
    return AppGlobal.instance;
  }
}