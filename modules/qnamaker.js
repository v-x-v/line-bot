// QnA Maker接続用クラス

let request = require('request');
exports = class QnaMaker {
  constructor() {
    this.endpointUrl = process.env.QNA_ENDPOINT_URL;
    this.accessKey = process.env.QNA_ACCESS_KEY;
  }
  convertQuestion(question) {
    let content = {
      'question': question,
      'top': 1
    }

    return JSON.stringify(content);
  }

  /**
   * 質問文をQnA Makerに投げ、回答を取得する
   * @param {string}  question 質問文
   * @param {function}
   * @returns {string} 質問に対応した、登録済みの回答
   */
  getAnswer(question, callback) {
    // 質問内容をJSONに変換
    let content = this.convertQuestion(question);
    // Request設定
    let requestParameters = {
      url: this.endpointUrl,
      header: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content),
        'Authorization': 'EndpointKey ' + this.accessKey,
      },
      form: content
    }
    request.post(requestParameters, function(err, res, body) {
      if(!err && res.statusCode === 200) {
        callback(body);
      }
    });
  }
}