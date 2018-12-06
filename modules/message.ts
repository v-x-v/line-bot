// tslint:disable:no-namespace
// 応答メッセージのオブジェクト定義ファイル
// .envファイルから環境変数を読み込む
import * as dotenv from "dotenv";
import * as Moment from "moment";
dotenv.config();

// ======= QnA Makerのエラーメッセージ =======//
export namespace QnA {
  // 404エラー時応答メッセージ
  export const NO_ANSWER: string = "まだ回答がないよ。学習するまで待ってね！";
  // 401エラー時応答メッセージ
  export const UNAUTHORIZED: string = "エラーが発生したよ。管理者に問い合わせてね！";
  // 403エラー時応答メッセージ
  export const LIMIT_QUOTA: string = "アクセスが集中しているよ。時間をあけてもう一度尋ねてね！";
  // 408エラー時応答メッセージ
  export const TIMEOUT: string = "アクセスが集中しているよ。時間をあけてもう一度尋ねてね！";
}

// ======= LUISのエラーメッセージ =======//
export namespace LUIS {
  // エラー時応答メッセージ
  export const NOTFOUND: string = "notfound";
  // 該当する結果がない場合のインテント名
  export const INTENT_NONE: string = "NONE";
  // 該当する結果がない場合の応答メッセージ
  export const NO_ANSWER: string = "まだ回答がないよ。学習するまで待ってね！";
}

export namespace Template {
  // クイックメッセージ
  export let QUICK_MESSAGE: any = {
    quickReply: {
      items: [
        {
          action: {
            label: "位置情報",
            type: "location",
          },
          type: "action",
        },
        {
          action: {
            label: "カメラ起動",
            type: "camera",
          },
          type: "action",
        },
        {
          action: {
            label: "ギャラリー",
            type: "cameraRoll",
          },
          type: "action",
        },
      ],
    },
    text: "好きなアクションを選んでね！",
    type: "text",
  };

  // 日時選択メッセージ
  export let DATEPICKER_MESSAGE: any = {
    data: "storeId=12345",
    initial: Moment().format("YYYY-MM-DD"),
    label: "Select date",
    max: "2100-12-31",
    min: "2017-01-01",
    mode: "date",
    type: "datetimepicker",
  };

}
