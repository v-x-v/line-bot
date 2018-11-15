import * as rp from 'request-promise';

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
   * @returns {any} JSON形式の文字列
   */
  private convertQuestion(question: string): any {
    let content = {
      'question': question
    }

    return content;
  }

  /**
   * 質問文をQnA Makerに投げ、回答を取得する
   * @param {string}  question 質問文
   * @param {function} コールバック関数
   * @returns {string} 質問に対応した、登録済みの回答
   */
  async getAnswer(question: string, callback: (body: any) => Promise<any>): Promise<any> {
    // 質問内容をJSONに変換
    let content = this.convertQuestion(question);
    // Request設定
    let options = {
      method: 'POST',
      uri: this.endpointUrl,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'EndpointKey ' + this.accessKey,
      },
      body: content,
      json: true
    }
    rp(options)
    .then((body) => callback(body))
    .catch((err) => {
      if(err.response) {
        console.log('error-response', err.response);
      }
      console.log(err);
    });
  }
};
