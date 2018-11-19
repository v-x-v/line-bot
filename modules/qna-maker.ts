import * as request from 'request-promise';
import * as message from './message';

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
  async getAnswer(question: string, callback: (body: any) => void): Promise<any> {
    // 質問内容をJSONに変換
    let content = this.convertQuestion(question);
    // Request設定
    let options = {
      method: 'POST',
      uri: this.endpointUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'EndpointKey ' + this.accessKey,
      },
      body: content,
      json: true
    }
    // QnAMakerから回答をJSON形式で得る
    // 参考： https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9ba9
    request(options)
    .then((response) => {
      let top_answer = response.answers[0];
      console.log('get answer: ', JSON.stringify(top_answer));
      if(top_answer.score > 90) {
        callback(top_answer.answer);
        return;
      }
      // 信頼がない回答は無視する
      // TODO: キーワードから、推測される回答を表示
      callback(message.STR_QNA_NOTFOUND);
    }).catch((err) => {
      switch(err.statusCode) {
        case 404:
          // ナレッジベースに一致する回答がない場合
          callback(message.STR_QNA_NOTFOUND);
          return;
        case 401:
          // 認証エラー
          console.log('QnA apiで認証エラーが発生しました。', err.response.message);
          callback(message.STR_QNA_UNAUTHORIZED);
          return;
        case 429:
        case 403:
          // API上限エラー
          console.log('QnA apiがリクエスト上限に達しています。', err.response.message);
          callback(message.STR_QNA_LIMIT_QUOTA);
          return;
        case 408:
          // タイムアウト
          console.log('QnA apiでタイムアウトが発生しました。');
          callback(message.STR_QNA_TIMEOUT);
          return;
        default:
          return;
      }
    });
  }
};
