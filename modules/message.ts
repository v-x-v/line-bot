// 応答メッセージのオブジェクト定義ファイル

// .envファイルから環境変数を読み込む
import * as dotenv from "dotenv";
dotenv.config();
// 404エラー時応答メッセージ
export var STR_QNA_NOTFOUND:string = "まだ回答がないよ。学習するまで待ってね！";
// 401エラー時応答メッセージ
export var STR_QNA_UNAUTHORIZED:string = "エラーが発生したよ。管理者に問い合わせてね！";
// 403エラー時応答メッセージ
export var STR_QNA_LIMIT_QUOTA:string = "アクセスが集中しているよ。時間をあけてもう一度尋ねてね！";
// 408エラー時応答メッセージ
export var STR_QNA_TIMEOUT:string = "アクセスが集中しているよ。時間をあけてもう一度尋ねてね！";

// クイックメッセージ
export var QUICK_MESSAGE:any = {
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