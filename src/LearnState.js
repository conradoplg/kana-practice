import sentences from './sentences.txt'

const romajiList = ['xa', 'a', 'xi', 'i', 'xu', 'u', 'wi', 'we', 'wo', 'xe', 'e', 'xo', 'o', 'ka', 'ga', 'ki', 'kya', 'kyu', 'kyo', 'gi', 'gya', 'gyu', 'gyo', 'ku', 'gu', 'ke', 'ge', 'ko', 'go', 'sa', 'za', 'shi', 'she', 'sha', 'shu', 'sho', 'ji', 'je', 'ja', 'ju', 'jo', 'su', 'zu', 'se', 'ze', 'so', 'zo', 'ta', 'da', 'chi', 'che', 'cha', 'chu', 'cho', 'di', 'dya', 'dyu', 'dyo', 'xtsu', 'kka', 'gga', 'kki', 'kkya', 'kkyu', 'kkyo', 'ggi', 'ggya', 'ggyu', 'ggyo', 'kku', 'ggu', 'kke', 'gge', 'kko', 'ggo', 'ssa', 'zza', 'sshi', 'sshe', 'ssha', 'sshu', 'ssho', 'jji', 'jja', 'jju', 'jjo', 'ssu', 'zzu', 'sse', 'zze', 'sso', 'zzo', 'tta', 'dda', 'cchi', 'cche', 'ccha', 'cchu', 'ccho', 'ddi', 'ddya', 'ddyu', 'ddyo', 'ttsu', 'ddu', 'tte', 'tti', 'dde', 'tto', 'ddo', 'ddu', 'hha', 'bba', 'ppa', 'hhi', 'hhya', 'hhyu', 'hhyo', 'bbi', 'bbya', 'bbyu', 'bbyo', 'ppi', 'ppya', 'ppyu', 'ppyo', 'ffu', 'ffa', 'ffi', 'ffe', 'ffo', 'ffu', 'bbu', 'ppu', 'hhe', 'bbe', 'ppe', 'hho', 'bbo', 'ppo', 'yya', 'yyu', 'yyo', 'rra', 'rri', 'rrya', 'rryu', 'rryo', 'rru', 'rre', 'rro', 'vvu', 'vva', 'vvi', 'vve', 'vvo', 'tsu', 'du', 'te', 'ti', 'de', 'di', 'to', 'do', 'du', 'na', 'ni', 'nya', 'nyu', 'nyo', 'nu', 'ne', 'no', 'ha', 'ba', 'pa', 'hi', 'hya', 'hyu', 'hyo', 'bi', 'bya', 'byu', 'byo', 'pi', 'pya', 'pyu', 'pyo', 'fu', 'fa', 'fi', 'fe', 'fo', 'fu', 'bu', 'pu', 'he', 'be', 'pe', 'ho', 'bo', 'po', 'ma', 'mi', 'mya', 'myu', 'myo', 'mu', 'me', 'mo', 'xya', 'ya', 'xyu', 'yu', 'xyo', 'yo', 'ra', 'ri', 'rya', 'ryu', 'ryo', 'ru', 're', 'ro', 'xwa', 'wa', 'wi', 'we', 'wo', "n'", 'vu', 'va', 'vi', 've', 'vo', '-']
const katakanaList = ['ァ', 'ア', 'ィ', 'イ', 'ゥ', 'ウ', 'ウィ', 'ウェ', 'ウォ', 'ェ', 'エ', 'ォ', 'オ', 'カ', 'ガ', 'キ', 'キャ', 'キュ', 'キョ', 'ギ', 'ギャ', 'ギュ', 'ギョ', 'ク', 'グ', 'ケ', 'ゲ', 'コ', 'ゴ','サ', 'ザ', 'シ', 'シェ', 'シャ', 'シュ', 'ショ', 'ジ', 'ジェ', 'ジャ', 'ジュ', 'ジョ', 'ス', 'ズ', 'セ', 'ゼ', 'ソ', 'ゾ', 'タ', 'ダ', 'チ', 'チェ', 'チャ', 'チュ', 'チョ', 'ヂ', 'ヂャ', 'ヂュ', 'ヂョ', 'ッ', 'ッカ', 'ッガ', 'ッキ', 'ッキャ', 'ッキュ', 'ッキョ', 'ッギ', 'ッギャ', 'ッギュ', 'ッギョ', 'ック', 'ッグ', 'ッケ', 'ッゲ', 'ッコ', 'ッゴ', 'ッサ', 'ッザ', 'ッシ', 'ッシェ', 'ッシャ', 'ッシュ', 'ッショ', 'ッジ', 'ッジャ', 'ッジュ', 'ッジョ', 'ッス', 'ッズ', 'ッセ', 'ッゼ', 'ッソ', 'ッゾ', 'ッタ', 'ッダ', 'ッチ', 'ッチェ', 'ッチャ', 'ッチュ', 'ッチョ', 'ッヂ', 'ッヂャ', 'ッヂュ', 'ッヂョ', 'ッツ', 'ッヅ', 'ッテ', 'ッティ', 'ッデ', 'ット', 'ッド', 'ッドゥ', 'ッハ', 'ッバ', 'ッパ', 'ッヒ', 'ッヒャ', 'ッヒュ', 'ッヒョ', 'ッビ', 'ッビャ', 'ッビュ', 'ッビョ','ッピ', 'ッピャ', 'ッピュ', 'ッピョ', 'ッフ', 'ッファ', 'ッフィ', 'ッフェ', 'ッフォ', 'ッフュ', 'ッブ', 'ップ', 'ッヘ', 'ッベ', 'ッペ', 'ッホ', 'ッボ', 'ッポ', 'ッヤ', 'ッユ', 'ッヨ', 'ッラ', 'ッリ', 'ッリャ', 'ッリュ', 'ッリョ', 'ッル', 'ッレ', 'ッロ', 'ッヴ', 'ッヴァ', 'ッヴィ', 'ッヴェ', 'ッヴォ', 'ツ', 'ヅ', 'テ', 'ティ', 'デ', 'ディ', 'ト', 'ド', 'ドゥ', 'ナ', 'ニ', 'ニャ', 'ニュ', 'ニョ', 'ヌ', 'ネ', 'ノ', 'ハ', 'バ', 'パ', 'ヒ', 'ヒャ', 'ヒュ', 'ヒョ', 'ビ', 'ビャ', 'ビュ', 'ビョ', 'ピ', 'ピャ', 'ピュ', 'ピョ', 'フ', 'ファ', 'フィ', 'フェ', 'フォ', 'フュ', 'ブ', 'プ', 'ヘ', 'ベ', 'ペ', 'ホ', 'ボ', 'ポ', 'マ', 'ミ', 'ミャ', 'ミュ', 'ミョ', 'ム', 'メ', 'モ', 'ャ', 'ヤ', 'ュ', 'ユ', 'ョ', 'ヨ', 'ラ', 'リ', 'リャ', 'リュ', 'リョ', 'ル', 'レ', 'ロ', 'ヮ', 'ワ', 'ヰ', 'ヱ', 'ヲ', 'ン', 'ヴ', 'ヴァ', 'ヴィ', 'ヴェ', 'ヴォ', 'ー']
const hiraganaList = ['ぁ', 'あ', 'ぃ', 'い', 'ぅ', 'う', 'う゛', 'う゛ぁ', 'う゛ぃ', 'う゛ぇ', 'う゛ぉ', 'ぇ', 'え', 'ぉ', 'お', 'か', 'が', 'き', 'きゃ', 'きゅ', 'きょ', 'ぎ', 'ぎゃ', 'ぎゅ', 'ぎょ', 'く', 'ぐ','け', 'げ', 'こ', 'ご', 'さ', 'ざ', 'し', 'しゃ', 'しゅ', 'しょ', 'じ', 'じぇ', 'じゃ', 'じゅ', 'じょ', 'す', 'ず', 'せ', 'ぜ', 'そ', 'ぞ', 'た', 'だ', 'ち', 'ちぇ', 'ちゃ', 'ちゅ', 'ちょ', 'ぢ', 'ぢゃ', 'ぢゅ', 'ぢょ', 'っ', 'っう゛', 'っう゛ぁ', 'っう゛ぃ', 'っう゛ぇ', 'っう゛ぉ', 'っか', 'っが', 'っき', 'っきゃ', 'っきゅ', 'っきょ', 'っぎ', 'っぎゃ', 'っぎゅ', 'っぎょ', 'っく', 'っぐ', 'っけ', 'っげ', 'っこ', 'っご', 'っさ', 'っざ', 'っし', 'っしゃ', 'っしゅ', 'っしょ', 'っじ', 'っじゃ', 'っじゅ', 'っじょ', 'っす', 'っず', 'っせ', 'っぜ', 'っそ', 'っぞ', 'った', 'っだ', 'っち', 'っちぇ', 'っちゃ', 'っちゅ', 'っちょ', 'っぢ', 'っぢゃ', 'っぢゅ', 'っぢょ', 'っつ', 'っづ', 'って', 'っで', 'っと', 'っど', 'っは', 'っば', 'っぱ', 'っひ', 'っひゃ', 'っひゅ', 'っひょ', 'っび', 'っびゃ', 'っびゅ', 'っびょ', 'っぴ', 'っぴゃ', 'っぴゅ', 'っぴょ', 'っふ', 'っふぁ', 'っふぃ', 'っふぇ', 'っふぉ', 'っぶ', 'っぷ', 'っへ', 'っべ', 'っぺ', 'っほ', 'っぼ', 'っぽ','っや', 'っゆ', 'っよ', 'っら', 'っり', 'っりゃ', 'っりゅ', 'っりょ', 'っる', 'っれ', 'っろ', 'つ', 'づ', 'て', 'で', 'でぃ', 'と', 'ど', 'な', 'に', 'にゃ', 'にゅ', 'にょ', 'ぬ', 'ね', 'の', 'は', 'ば', 'ぱ', 'ひ', 'ひゃ', 'ひゅ', 'ひょ', 'び', 'びゃ', 'びゅ', 'びょ', 'ぴ', 'ぴゃ', 'ぴゅ', 'ぴょ', 'ふ', 'ふぁ', 'ふぃ', 'ふぇ', 'ふぉ', 'ぶ', 'ぷ', 'へ', 'べ', 'ぺ', 'ほ', 'ぼ', 'ぽ','ま', 'み', 'みゃ', 'みゅ', 'みょ', 'む', 'め', 'も', 'ゃ', 'や', 'ゅ', 'ゆ', 'ょ', 'よ', 'ら', 'り', 'りゃ', 'りゅ', 'りょ', 'る', 'れ', 'ろ', 'ゎ', 'わ', 'ゐ', 'ゑ', 'を', 'ん', 'ー']
const kanaList = katakanaList + hiraganaList

function getSyllableByPrefix(entry) {
    for (const syllable of romajiList) {
        if (syllable.startsWith(entry)) {
            return syllable
        }
    }
    return undefined
}

function checkSyllable(typedSyllable, correctSyllable) {
    const prefixedSyllable = getSyllableByPrefix(typedSyllable)
    if (prefixedSyllable === undefined) {
        //it's not a prefix of a valid syllable: got it wrong
        return false
    } else if (correctSyllable.startsWith(typedSyllable)) {
        //it's a prefix of a valid syllable
        //it's a prefix of the correct syllable: getting it right
        return true
    } else if (typedSyllable === prefixedSyllable) {
        //it's a prefix of a valid syllable
        //it's not a prefix of the correct syllable
        //it's equal a valid syllable: got it wrong
        return prefixedSyllable
    } else {
        //it's a prefix of a valid syllable
        //it's not a prefix of the correct syllable
        //it's not equal a valid syllable: got it wrong, but let's wait for the full syllable
        return true
    }
}

class LearnState {
    constructor() {
        this.wrongCountDict = {}
        for (const kana of kanaList) {
            this.wrongCountDict[kana] = {correct: 0, wrong: 0}
        }
        this.sentences = []
    }

    async init() {
        let resp = await fetch(sentences)
        let data = await resp.text()
        this.sentences = data.split("\n").filter(String)
    }

    checkSyllable(typed, correct) {
        return checkSyllable(typed, correct)
    }

    registerSyllable(typed, correct, correctKana) {
        if (typed === correct) {
            this.wrongCountDict[correctKana].correct += 1
        } else {
            this.wrongCountDict[correctKana].wrong += 1
        }
    }

    getSentence() {
        let idx = Math.floor(Math.random() * this.sentences.length)
        let [kana, romaji] = this.sentences[idx].split(',')
        return [kana.split(' '), romaji.split(' ')]
    }
}

export default LearnState;
