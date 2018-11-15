// 応答メッセージのオブジェクト定義ファイル

// .envファイルから環境変数を読み込む
import * as dotenv from "dotenv";
dotenv.config();
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