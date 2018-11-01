// LINE用botのプロトタイプ

// ================================
// ライブラリインポート
const server = require('express')();
const line   = require('@line/bot-sdk');  // LINE Messaging-API用のSDK

// ================================
// LINE接続用パラメータ
const line_config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// ================================
// Webサーバ設定
server.listen(process.env.PORT || 8080);

// ================================
// ルーティング設定
server.post('/webhook', line.middleware(line_config), (req, res, next) => {
  res.sendStatus(200);
  console.log(req.body);
});

