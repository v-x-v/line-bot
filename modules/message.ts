// 応答メッセージのオブジェクト定義ファイル
import * as Moment from "moment";
// .envファイルから環境変数を読み込む
import * as dotenv from "dotenv";
dotenv.config();

//======= QnA Makerのエラーメッセージ =======//
export namespace QnA {
  // 404エラー時応答メッセージ
  export const NOTFOUND: string = "まだ回答がないよ。学習するまで待ってね！";
  // 401エラー時応答メッセージ
  export const UNAUTHORIZED: string = "エラーが発生したよ。管理者に問い合わせてね！";
  // 403エラー時応答メッセージ
  export const LIMIT_QUOTA: string = "アクセスが集中しているよ。時間をあけてもう一度尋ねてね！";
  // 408エラー時応答メッセージ
  export const TIMEOUT: string = "アクセスが集中しているよ。時間をあけてもう一度尋ねてね！";
};

//======= LUISのエラーメッセージ =======//
export namespace LUIS {
  // エラー時応答メッセージ
  export const NOTFOUND: string = "notfound";
};

export namespace Template {
  // クイックメッセージ
  export var QUICK_MESSAGE: any = {
    type: 'text',
    text: '好きなアクションを選んでね！',
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'location',
            label: '位置情報'
          }
        },
        {
          type: 'action',
          action: {
            type: 'camera',
            label: 'カメラ起動'
          }
        },
        {
          type: 'action',
          action: {
            type: 'cameraRoll',
            label: 'ギャラリー'
          }
        }
      ]
    }
  };

  // 日時選択メッセージ
  export var DATEPICKER_MESSAGE: any = {
    "type": "datetimepicker",
    "label": "Select date",
    "data": "storeId=12345",
    "mode": "date",
    "initial": Moment().format("YYYY-MM-DD"),
    "max": "2100-12-31",
    "min": "2017-01-01"
  };

}
