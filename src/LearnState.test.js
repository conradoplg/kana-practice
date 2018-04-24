import LearnState from './LearnState';

it('is created correctly', async () => {
    fetch.mockResponse(`ロ グ ア ウ ト す る ん じゃ な か った よ,ro gu a u to su ru n ja na ka tta yo,
ど う か し た の と ち い さ い し ろ い ウ サ ギ が き き ま し た,do u ka shi ta no to chi i sa i shi ro i u sa gi ga ki ki ma shi ta,小:7:9 白:11:13 聞:18:19
`)

    let ls = new LearnState()
    await ls.init()
    expect(ls.kanaAccuracyDict.get('ロ')).toEqual({correct: 0, wrong: 0})
})

it('initializes correctly', async () => {
    fetch.mockResponse(`ロ グ ア ウ ト す る ん じゃ な か った よ,ro gu a u to su ru n ja na ka tta yo,
ど う か し た の と ち い さ い し ろ い ウ サ ギ が き き ま し た,do u ka shi ta no to chi i sa i shi ro i u sa gi ga ki ki ma shi ta,小:7:9 白:11:13 聞:18:19
`)

    let ls = new LearnState()
    await ls.init()
    expect(ls.sentences.length).toEqual(2)
})

it('is initialized correctly with storage with null key', async () => {
    fetch.mockResponse(`ロ グ ア ウ ト す る ん じゃ な か った よ,ro gu a u to su ru n ja na ka tta yo,
ど う か し た の と ち い さ い し ろ い ウ サ ギ が き き ま し た,do u ka shi ta no to chi i sa i shi ro i u sa gi ga ki ki ma shi ta,小:7:9 白:11:13 聞:18:19
`)
    let storage = {
        getItem: (key) => {
            return null
        }
    }
    let ls = new LearnState()
    await ls.init(storage)
    expect(ls.kanaAccuracyDict.get('ロ')).toEqual({correct: 0, wrong: 0})
})

it('is initialized correctly with storage with non-null key', async () => {
    fetch.mockResponse(`ロ グ ア ウ ト す る ん じゃ な か った よ,ro gu a u to su ru n ja na ka tta yo,
ど う か し た の と ち い さ い し ろ い ウ サ ギ が き き ま し た,do u ka shi ta no to chi i sa i shi ro i u sa gi ga ki ki ma shi ta,小:7:9 白:11:13 聞:18:19
`)
    let storage = {
        getItem: (key) => {
            let m = new Map()
            m.set('ロ', {correct: 1, wrong: 1})
            return JSON.stringify([...m])
        }
    }
    let ls = new LearnState()
    await ls.init(storage)
    expect(ls.kanaAccuracyDict.get('ロ')).toEqual({correct: 1, wrong: 1})
})

it('gets sentence with specific kana', async () => {
    fetch.mockResponse(`ロ,ro,
ど,do,
`)

    let ls = new LearnState()
    await ls.init()
    for (let i = 0; i < 4; i++) {
        const [kanaSentence, romajiSentence] = ls._getSentenceWithKana('ロ')
        expect(romajiSentence[0]).toEqual('ro')
    }
})

it('gets sentence with least practiced kana', async () => {
    fetch.mockResponse(`ロ,ro,
ど,do,
`)

    let ls = new LearnState()
    await ls.init()
    ls.registerSyllable('ro', 'ro', 'ロ')
    for (let i = 0; i < 4; i++) {
        const [kanaSentence, romajiSentence] = ls._getSentenceWithLeastPracticedKana()
        expect(romajiSentence[0]).toEqual('do')
    }
})

it('gets sentence with most mistaken kana', async () => {
    fetch.mockResponse(`ロ,ro,
ど,do,
`)

    let ls = new LearnState()
    await ls.init()
    ls.registerSyllable('ru', 'ro', 'ロ')
    for (let i = 0; i < 4; i++) {
        const [kanaSentence, romajiSentence] = ls._getSentenceWithMostMistakenKana()
        expect(romajiSentence[0]).toEqual('ro')
    }
})

it('gets random sentence', async () => {
    fetch.mockResponse(`ロ,ro,
ど,do,
`)

    let ls = new LearnState()
    await ls.init()
    for (let i = 0; i < 4; i++) {
        const [kanaSentence, romajiSentence] = ls._getRandomSentence()
        expect(['ro', 'do'].indexOf(romajiSentence[0])).not.toBe(-1)
    }
})

it('pardons mistakes', async () => {
    fetch.mockResponse(`ロ,ro,
ど,do,
`)
    let ls = new LearnState()
    await ls.init()

    let romajiSentence

    ls.registerSyllable('ra', 'ro', 'ロ')
    romajiSentence = ls._getSentenceWithMostMistakenKana()[1]
    expect(romajiSentence[0]).toEqual('ro')

    ls.registerSyllable('da', 'do', 'ど')
    ls.registerSyllable('da', 'do', 'ど')
    romajiSentence = ls._getSentenceWithMostMistakenKana()[1]
    expect(romajiSentence[0]).toEqual('do')

    for (let i = 0; i < 5; i++) {
        ls.registerSyllable('do', 'do', 'ど')
    }
    romajiSentence = ls._getSentenceWithMostMistakenKana()[1]
    expect(romajiSentence[0]).toEqual('ro')
})


it('returns top mistaken kana', async () => {
    fetch.mockResponse(`ロ,ro,
ど,do,
`)
    let ls = new LearnState()
    await ls.init()

    let freqKanaList
    freqKanaList = ls.getTopMistakenKana()
    expect(freqKanaList).toEqual([])

    ls.registerSyllable('ru', 'ro', 'ロ')
    ls.registerSyllable('du', 'do', 'ど')
    ls.registerSyllable('du', 'do', 'ど')
    freqKanaList = ls.getTopMistakenKana()
    expect(freqKanaList).toEqual([[2, 'ど'], [1, 'ロ']])
})

it('splits sentences', () => {
    let ls = new LearnState()
    let sentence = 'ど う か し た の と ち い さ い し ろ い ウ サ ギ が き き ま し た,do u ka shi ta no to chi i sa i shi ro i u sa gi ga ki ki ma shi ta,小:7:9 白:11:13 聞:18:19'
    const [kanaSentence, romajiSentence, kanjiInfo] = ls._splitSentence(sentence)
    expect(kanjiInfo[0]).toEqual(['小', 7, 9])
})

it('compute groups', () => {
    let ls = new LearnState()
    let kanaSentence = 'ど う か し た の と ち い さ い し ろ い ウ サ ギ が き き ま し た'.split(' ')
    let kanjiInfo = [['小', 7, 9], ['白', 11, 13], ['聞', 18, 19]]
    const groups = ls._computeGroups(kanaSentence, kanjiInfo)
    expect(groups).toEqual([
        ['', 0, 1],
        ['', 1, 2],
        ['', 2, 3],
        ['', 3, 4],
        ['', 4, 5],
        ['', 5, 6],
        ['', 6, 7],
        ['小', 7, 9],
        ['', 9, 10],
        ['', 10, 11],
        ['白', 11, 13],
        ['', 13, 14],
        ['', 14, 15],
        ['', 15, 16],
        ['', 16, 17],
        ['', 17, 18],
        ['聞', 18, 19],
        ['', 19, 20],
        ['', 20, 21],
        ['', 21, 22],
        ['', 22, 23],
    ])
})
