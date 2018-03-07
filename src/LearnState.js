import sentences from './sentences.txt'

const romajiList = ['xa', 'a', 'xi', 'i', 'xu', 'u', 'wi', 'we', 'wo', 'xe', 'e', 'xo', 'o', 'ka', 'ga', 'ki', 'kya', 'kyu', 'kyo', 'gi', 'gya', 'gyu', 'gyo', 'ku', 'gu', 'ke', 'ge', 'ko', 'go', 'sa', 'za', 'shi', 'she', 'sha', 'shu', 'sho', 'ji', 'je', 'ja', 'ju', 'jo', 'su', 'zu', 'se', 'ze', 'so', 'zo', 'ta', 'da', 'chi', 'che', 'cha', 'chu', 'cho', 'di', 'dya', 'dyu', 'dyo', 'xtsu', 'kka', 'gga', 'kki', 'kkya', 'kkyu', 'kkyo', 'ggi', 'ggya', 'ggyu', 'ggyo', 'kku', 'ggu', 'kke', 'gge', 'kko', 'ggo', 'ssa', 'zza', 'sshi', 'sshe', 'ssha', 'sshu', 'ssho', 'jji', 'jja', 'jju', 'jjo', 'ssu', 'zzu', 'sse', 'zze', 'sso', 'zzo', 'tta', 'dda', 'cchi', 'cche', 'ccha', 'cchu', 'ccho', 'ddi', 'ddya', 'ddyu', 'ddyo', 'ttsu', 'ddu', 'tte', 'tti', 'dde', 'tto', 'ddo', 'ddu', 'hha', 'bba', 'ppa', 'hhi', 'hhya', 'hhyu', 'hhyo', 'bbi', 'bbya', 'bbyu', 'bbyo', 'ppi', 'ppya', 'ppyu', 'ppyo', 'ffu', 'ffa', 'ffi', 'ffe', 'ffo', 'ffu', 'bbu', 'ppu', 'hhe', 'bbe', 'ppe', 'hho', 'bbo', 'ppo', 'yya', 'yyu', 'yyo', 'rra', 'rri', 'rrya', 'rryu', 'rryo', 'rru', 'rre', 'rro', 'vvu', 'vva', 'vvi', 'vve', 'vvo', 'tsu', 'du', 'te', 'ti', 'de', 'di', 'to', 'do', 'du', 'na', 'ni', 'nya', 'nyu', 'nyo', 'nu', 'ne', 'no', 'ha', 'ba', 'pa', 'hi', 'hya', 'hyu', 'hyo', 'bi', 'bya', 'byu', 'byo', 'pi', 'pya', 'pyu', 'pyo', 'fu', 'fa', 'fi', 'fe', 'fo', 'fu', 'bu', 'pu', 'he', 'be', 'pe', 'ho', 'bo', 'po', 'ma', 'mi', 'mya', 'myu', 'myo', 'mu', 'me', 'mo', 'xya', 'ya', 'xyu', 'yu', 'xyo', 'yo', 'ra', 'ri', 'rya', 'ryu', 'ryo', 'ru', 're', 'ro', 'xwa', 'wa', 'wi', 'we', 'wo', "n'", 'vu', 'va', 'vi', 've', 'vo', '-']

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
        this.kanaAccuracyDict = {}
        this.sentences = []
        this.possibleKanas = new Set()
    }

    async init() {
        const resp = await fetch(sentences)
        const data = await resp.text()
        this.sentences = data.split("\n").filter(String)
        for (let i = 0; i < this.sentences.length; i++) {
            this.sentences[i] = this._splitSentence(this.sentences[i])
            const kanaSentence = this.sentences[i][0]
            for (const kana of kanaSentence) {
                this.possibleKanas.add(kana)
            }
        }
        for (const kana of this.possibleKanas) {
            this.kanaAccuracyDict[kana] = {correct: 0, wrong: 0}
        }
    }

    checkSyllable(typed, correct) {
        return checkSyllable(typed, correct)
    }

    registerSyllable(typed, correct, correctKana) {
        if (typed === correct) {
            this.kanaAccuracyDict[correctKana].correct += 1
        } else {
            this.kanaAccuracyDict[correctKana].wrong += 1
        }
    }

    _splitSentence(sentence) {
        let [kana, romaji] = sentence.split(',')
        return [kana.split(' '), romaji.split(' ')]
    }

    getSentence() {
        let idx = Math.floor(Math.random() * 3)
        if (idx === 0) {
            return this._getSentenceWithLeastPracticedKana()
        } else if (idx === 1) {
            return this._getSentenceWithMostMistakenKana()
        } else {
            return this._getRandomSentence()
        }
    }

    _getRandomSentence() {
        let idx = Math.floor(Math.random() * this.sentences.length)
        return this.sentences[idx]
    }

    _getSentenceWithKana(kana) {
        let idxs = []
        for (let i = 0; i < this.sentences.length; i++) {
            if (this.sentences[i][0].indexOf(kana) !== -1) {
                idxs.push(i)
            }
        }
        let idxIdxs = Math.floor(Math.random() * idxs.length)
        return this.sentences[idxs[idxIdxs]]
    }

    _getSentenceWithLeastPracticedKana() {
        let leastKana = null
        let leastCorrect = 0
        for (const kana of this.possibleKanas) {
            if (leastKana === null || this.kanaAccuracyDict[kana].correct < leastCorrect) {
                leastCorrect = this.kanaAccuracyDict[kana].correct
                leastKana = kana
            }
        }
        return this._getSentenceWithKana(leastKana)
    }

    _getSentenceWithMostMistakenKana() {
        let mostKana = null
        let mostMistakes = 0
        for (const kana of this.possibleKanas) {
            if (mostKana === null || this.kanaAccuracyDict[kana].wrong > mostMistakes) {
                mostMistakes = this.kanaAccuracyDict[kana].wrong
                mostKana = kana
            }
        }
        return this._getSentenceWithKana(mostKana)
    }
}

export default LearnState;
