let request = require('request');

export class QnAMaker {
  private endpointUrl: string;
  private accessKey: string;

  constructor() {
    this.endpointUrl = process.env.QNA_ENDPOINT_URL;
    this.accessKey = process.env.QNA_ACCESS_KEY;
  }
  /**
   * 質問文をQnA Makerに投げるためのJSON形式に変換
   * @param {string} question 質問文
   * @returns {string} JSON形式の文字列
   */
  private convertQuestion(question: string): string {
    let content = {
      'question': question,
      'top': 1
    }

    return JSON.stringify(content);
  }

  /**
   * 質問文をQnA Makerに投げ、回答を取得する
   * @param {string}  question 質問文
   * @param {function} コールバック関数
   * @returns {string} 質問に対応した、登録済みの回答
   */
  async getAnswer(question: string, callback): Promise<any> {
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
      body: content
    }
    request.post(requestParameters, function(err, res, body) {
      if(!err && res.statusCode === 200) {
        console.log('### QnA Completed ###\n' + body);
        callback(body);
      }
    });
  }
};
