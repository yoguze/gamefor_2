export type MatchOptionIndex = 0 | 1;

export type MatchQuestion = {
  id: number;
  prompt: string;
  options: [string, string];
};

export const MATCH_QUESTION_POOL: MatchQuestion[] = [
  { id: 1, prompt: "休日はどっち？", options: ["家で過ごす", "外に出る"] },
  { id: 2, prompt: "旅行するならどっち？", options: ["国内", "海外"] },
  { id: 3, prompt: "旅行先はどっち？", options: ["海", "山"] },
  { id: 4, prompt: "好きな季節はどっち？", options: ["夏", "冬"] },
  { id: 5, prompt: "活動時間はどっち？", options: ["朝型", "夜型"] },
  { id: 6, prompt: "食事の主食はどっち？", options: ["米", "パン"] },
  { id: 7, prompt: "麺ならどっち？", options: ["ラーメン", "うどん"] },
  { id: 8, prompt: "味の好みはどっち？", options: ["甘い", "辛い"] },
  { id: 9, prompt: "焼肉の味付けはどっち？", options: ["タレ", "塩"] },
  { id: 10, prompt: "飲み物はどっち？", options: ["コーヒー", "紅茶"] },
  { id: 11, prompt: "娯楽はどっち？", options: ["ゲーム", "アニメ・映画"] },
  { id: 12, prompt: "ゲームならどっち？", options: ["対戦", "協力"] },
  { id: 13, prompt: "作品の好みはどっち？", options: ["王道", "マニアック"] },
  { id: 14, prompt: "YouTubeはどっち？", options: ["Shorts", "長い動画"] },
  { id: 15, prompt: "イベントはどっち？", options: ["大人数", "少人数"] },
  { id: 16, prompt: "会話ではどっち？", options: ["喋る", "聞く"] },
  { id: 17, prompt: "友達との距離感はどっち？", options: ["広く浅く", "狭く深く"] },
  { id: 18, prompt: "約束の仕方はどっち？", options: ["計画して遊ぶ", "ノリで遊ぶ"] },
  { id: 19, prompt: "一人時間はどっち？", options: ["必要", "あまり必要ない"] },
  {
    id: 20,
    prompt: "初対面のときはどっち？",
    options: ["自分から話す", "相手を待つ"],
  },
  { id: 21, prompt: "仕事で重視するのはどっち？", options: ["高収入", "自由時間"] },
  { id: 22, prompt: "働き方はどっち？", options: ["安定", "挑戦"] },
  { id: 23, prompt: "人生で大事なのはどっち？", options: ["面白さ", "安定"] },
  { id: 24, prompt: "成功するならどっち？", options: ["名声", "お金"] },
  {
    id: 25,
    prompt: "能力の理想はどっち？",
    options: ["一つを極める", "何でもできる"],
  },
  { id: 26, prompt: "才能のイメージはどっち？", options: ["天才", "努力家"] },
  { id: 27, prompt: "判断の仕方はどっち？", options: ["論理", "直感"] },
  { id: 28, prompt: "勝負ではどっち？", options: ["勝ちたい", "楽しみたい"] },
  { id: 29, prompt: "将来住むならどっち？", options: ["都会", "田舎"] },
  {
    id: 30,
    prompt: "住居のスタイルはどっち？",
    options: ["一人暮らし", "誰かと暮らす"],
  },
  {
    id: 31,
    prompt: "1億円もらったらどっち？",
    options: ["仕事を続ける", "辞める"],
  },
  {
    id: 32,
    prompt: "タイムマシンがあったらどっち？",
    options: ["過去へ行く", "未来へ行く"],
  },
  {
    id: 33,
    prompt: "超能力を得るならどっち？",
    options: ["瞬間移動", "時間停止"],
  },
  {
    id: 34,
    prompt: "能力を得るならどっち？",
    options: ["頭脳", "身体能力"],
  },
  {
    id: 35,
    prompt: "生まれ変わるならどっち？",
    options: ["同じ人生", "全く違う人生"],
  },
  {
    id: 36,
    prompt: "自分のいつ死ぬか、知りたい？",
    options: ["知りたい", "知りたくない"],
  },
  {
    id: 37,
    prompt: "どちらか無料ならどっち？",
    options: ["一生食費0円", "一生交通費0円"],
  },
  { id: 38, prompt: "どちらが大事？", options: ["睡眠", "食事"] },
  {
    id: 39,
    prompt: "無人島に持っていくならどっち？",
    options: ["スマホ", "ナイフ"],
  },
  {
    id: 40,
    prompt: "一生どちらか禁止なら？",
    options: ["YouTube禁止", "ゲーム禁止"],
  },
  { id: 41, prompt: "一生どちらかだけなら？", options: ["米", "麺"] },
  {
    id: 42,
    prompt: "君はどっち？",
    options: ["100万円今もらう", "50%で300万円"],
  },
  { id: 43, prompt: "好きな教科はどっち？", options: ["社会", "理科"] },
  { id: 44, prompt: "どっちに行く？", options: ["ディズニー", "ユニバ"] },
  {
    id: 45,
    prompt: "有名になるならどっち？",
    options: ["顔が知られる", "名前だけ知られる"],
  },
  {
    id: 46,
    prompt: "君はどっち？",
    options: ["100歳まで普通に生きる", "60歳まで超刺激的に生きる"],
  },
  { id: 47, prompt: "欲しいものはどっち？", options: ["才能", "運"] },
  {
    id: 48,
    prompt: "評価されるならどっち？",
    options: ["頭がいい", "面白い"],
  },
  {
    id: 49,
    prompt: "人から言われたい言葉は？",
    options: ["「すごい」", "「一緒にいて楽しい」"],
  },
  {
    id: 50,
    prompt: "人生の主人公ならどっち？",
    options: ["王道成功ルート", "波乱万丈ルート"],
  },
  {
    id: 51,
    prompt: "食べるならどっち？",
    options: ["きのこの里", "たけのこの里"],
  },
  { id: 52, prompt: "好きなのはどっち？", options: ["マンガ", "アニメ"] },
  {
    id: 53,
    prompt: "仕事を選ぶならどっち？",
    options: ["好きな仕事で400万円", "嫌いな仕事で2000万円"],
  },
  {
    id: 54,
    prompt: "物事に向き合うならどっち？",
    options: ["リスクを避ける", "チャンスを取りにいく"],
  },
  {
    id: 55,
    prompt: "成長の仕方はどっち？",
    options: ["得意なことを伸ばす", "苦手なことを克服する"],
  },
  {
    id: 56,
    prompt: "なりたいのはどっち？",
    options: ["専門家になりたい", "リーダーになりたい"],
  },
  {
    id: 57,
    prompt: "締め切りへの向き合い方は？",
    options: ["締切ギリギリで集中する", "早めに終わらせる"],
  },
  {
    id: 58,
    prompt: "意見が違うときはどっち？",
    options: ["意見が違えば議論する", "できるだけ衝突を避ける"],
  },
  {
    id: 59,
    prompt: "信念やプライドはあったほうがいい？",
    options: ["YES", "No"],
  },
  {
    id: 60,
    prompt: "休日はどっち？",
    options: ["予定を入れる", "何もしない"],
  },
  {
    id: 61,
    prompt: "付き合うならどっち？",
    options: ["面白い人", "優しい人"],
  },
  {
    id: 62,
    prompt: "恋人との連絡はどっち？",
    options: ["毎日連絡", "必要なときだけ"],
  },
  {
    id: 63,
    prompt: "どっちがいい？",
    options: ["1億円もらえる", "10歳若返る"],
  },
  { id: 64, prompt: "食べるならどっち？", options: ["焼肉", "寿司"] },
  {
    id: 65,
    prompt: "より好きなのはどっち？",
    options: ["声優", "俳優"],
  },
  {
    id: 66,
    prompt: "より好きなのはどっち？",
    options: ["YouTuber", "お笑い芸人"],
  },
];

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export const MATCH_ROUND_SIZE = 25;

export function pickMatchRound(count = MATCH_ROUND_SIZE): MatchQuestion[] {
  const size = Math.min(count, MATCH_QUESTION_POOL.length);
  return shuffle(MATCH_QUESTION_POOL).slice(0, size);
}
