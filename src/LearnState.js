import sentences from './sentences.txt'

const ROMAJI_LIST = ['xa', 'a', 'xi', 'i', 'xu', 'u', 'wi', 'we', 'wo', 'xe', 'e', 'xo', 'o', 'ka', 'ga', 'ki', 'kya', 'kyu', 'kyo', 'gi', 'gya', 'gyu', 'gyo', 'ku', 'gu', 'ke', 'ge', 'ko', 'go', 'sa', 'za', 'shi', 'she', 'sha', 'shu', 'sho', 'ji', 'je', 'ja', 'ju', 'jo', 'su', 'zu', 'se', 'ze', 'so', 'zo', 'ta', 'da', 'chi', 'che', 'cha', 'chu', 'cho', 'di', 'dya', 'dyu', 'dyo', 'xtsu', 'kka', 'gga', 'kki', 'kkya', 'kkyu', 'kkyo', 'ggi', 'ggya', 'ggyu', 'ggyo', 'kku', 'ggu', 'kke', 'gge', 'kko', 'ggo', 'ssa', 'zza', 'sshi', 'sshe', 'ssha', 'sshu', 'ssho', 'jji', 'jja', 'jju', 'jjo', 'ssu', 'zzu', 'sse', 'zze', 'sso', 'zzo', 'tta', 'dda', 'cchi', 'cche', 'ccha', 'cchu', 'ccho', 'ddi', 'ddya', 'ddyu', 'ddyo', 'ttsu', 'ddu', 'tte', 'tti', 'dde', 'tto', 'ddo', 'ddu', 'hha', 'bba', 'ppa', 'hhi', 'hhya', 'hhyu', 'hhyo', 'bbi', 'bbya', 'bbyu', 'bbyo', 'ppi', 'ppya', 'ppyu', 'ppyo', 'ffu', 'ffa', 'ffi', 'ffe', 'ffo', 'ffu', 'bbu', 'ppu', 'hhe', 'bbe', 'ppe', 'hho', 'bbo', 'ppo', 'yya', 'yyu', 'yyo', 'rra', 'rri', 'rrya', 'rryu', 'rryo', 'rru', 'rre', 'rro', 'vvu', 'vva', 'vvi', 'vve', 'vvo', 'tsu', 'du', 'te', 'ti', 'de', 'di', 'to', 'do', 'du', 'na', 'ni', 'nya', 'nyu', 'nyo', 'nu', 'ne', 'no', 'ha', 'ba', 'pa', 'hi', 'hya', 'hyu', 'hyo', 'bi', 'bya', 'byu', 'byo', 'pi', 'pya', 'pyu', 'pyo', 'fu', 'fa', 'fi', 'fe', 'fo', 'fu', 'bu', 'pu', 'he', 'be', 'pe', 'ho', 'bo', 'po', 'ma', 'mi', 'mya', 'myu', 'myo', 'mu', 'me', 'mo', 'xya', 'ya', 'xyu', 'yu', 'xyo', 'yo', 'ra', 'ri', 'rya', 'ryu', 'ryo', 'ru', 're', 'ro', 'xwa', 'wa', 'wi', 'we', 'wo', "n'", 'vu', 'va', 'vi', 've', 'vo', '-']

const PARDON_VALUE = 0.25

const KANA_ACCURACY_KEY = 'kanaAccuracy-0.1.0'

function getSyllableByPrefix(entry) {
    for (const syllable of ROMAJI_LIST) {
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
        this.kanaAccuracyDict = new Map()
        this.sentences = []
        this.possibleKanas = new Set()
    }

    async init(storage) {
        this.storage = storage
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
            this.kanaAccuracyDict.set(kana, {correct: 0, wrong: 0})
        }
        if (this.storage) {
            const v = this.storage.getItem(KANA_ACCURACY_KEY)
            this.kanaAccuracyDict = new Map(JSON.parse(v))
        }
    }

    checkSyllable(typed, correct, kana) {
        const r = checkSyllable(typed, correct)
        if (r !== true) {
            this.registerSyllable(typed, correct, kana)
        }
        return r
    }

    registerSyllable(typed, correct, correctKana) {
        let kanaStats = this.kanaAccuracyDict.get(correctKana)
        if (typed === correct) {
            kanaStats.correct += 1
            kanaStats.wrong = Math.max(0, kanaStats.wrong - PARDON_VALUE)
        } else {
            kanaStats.wrong += 1
        }
        if (this.storage) {
            const v = JSON.stringify([...this.kanaAccuracyDict])
            this.storage.setItem(KANA_ACCURACY_KEY, v)
        }
    }

    _splitSentence(sentence) {
        let [kana, romaji, kanjiInfo] = sentence.split(',')
        if (kanjiInfo.length === 0) {
            kanjiInfo = []
        } else {
            kanjiInfo = kanjiInfo.split(' ').map((v) => {
                let a = v.split(':')
                return [a[0], parseInt(a[1], 10), parseInt(a[2], 10)]
            })
        }
        return [kana.split(' '), romaji.split(' '), kanjiInfo]
    }

    _computeGroups(kanaSentence, kanjiInfo) {
        let groups = []
        let pos = 0
        for (let info of kanjiInfo) {
            let [kanji, start, end] = info
            for (; pos < start; pos++) {
                groups.push(['', pos, pos+1])
            }
            groups.push([kanji, start, end])
            pos = end
        }
        for (; pos < kanaSentence.length; pos++) {
            groups.push(['', pos, pos+1])
        }
        return groups
    }

    getSentence() {
        let idx = Math.floor(Math.random() * 3)
        let r
        if (idx === 0) {
            r = this._getSentenceWithLeastPracticedKana()
        } else if (idx === 1) {
            r = this._getSentenceWithMostMistakenKana()
        } else {
            r = this._getRandomSentence()
        }
        r[2] = this._computeGroups(r[0], r[2])
        return r
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
            if (leastKana === null || this.kanaAccuracyDict.get(kana).correct < leastCorrect) {
                leastCorrect = this.kanaAccuracyDict.get(kana).correct
                leastKana = kana
            }
        }
        return this._getSentenceWithKana(leastKana)
    }

    _getSentenceWithMostMistakenKana() {
        let mostKana = null
        let mostMistakes = 0
        for (const kana of this.possibleKanas) {
            if (mostKana === null || this.kanaAccuracyDict.get(kana).wrong > mostMistakes) {
                mostMistakes = this.kanaAccuracyDict.get(kana).wrong
                mostKana = kana
            }
        }
        return this._getSentenceWithKana(mostKana)
    }

    getTopMistakenKana() {
        let kanaFreqList = []
        for (let [kana, stats] of this.kanaAccuracyDict) {
            if (stats.wrong > 0) {
                kanaFreqList.push([stats.wrong, kana])
            }
        }
        kanaFreqList.sort((a, b) => b[0] - a[0])
        return kanaFreqList
    }
}

export default LearnState;
