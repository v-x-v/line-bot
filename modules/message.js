// 応答メッセージのオブジェクト定義ファイル

require('dotenv').config(); // .envファイルから環境変数を読み込む

// クイックメッセージ
exports.QUICK_MESSAGE = {
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
