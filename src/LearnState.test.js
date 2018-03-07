import LearnState from './LearnState';

it('is created correctly', async () => {
    fetch.mockResponse(`ロ グ ア ウ ト す る ん じゃ な か った よ,ro gu a u to su ru n ja na ka tta yo
ど う か し た の と ち い さ い し ろ い ウ サ ギ が き き ま し た,do u ka shi ta no to chi i sa i shi ro i u sa gi ga ki ki ma shi ta
`)

    let ls = new LearnState()
    await ls.init()
    expect(ls.kanaAccuracyDict['ロ']).toEqual({correct: 0, wrong: 0})
})

it('initializes correctly', async () => {
    fetch.mockResponse(`ロ グ ア ウ ト す る ん じゃ な か った よ,ro gu a u to su ru n ja na ka tta yo
ど う か し た の と ち い さ い し ろ い ウ サ ギ が き き ま し た,do u ka shi ta no to chi i sa i shi ro i u sa gi ga ki ki ma shi ta
`)

    let ls = new LearnState()
    await ls.init()
    expect(ls.sentences.length).toEqual(2)
})

it('gets sentence with specific kana', async () => {
    fetch.mockResponse(`ロ,ro
ど,do
`)

    let ls = new LearnState()
    await ls.init()
    for (let i = 0; i < 4; i++) {
        const [kanaSentence, romajiSentence] = ls._getSentenceWithKana('ロ')
        expect(romajiSentence[0]).toEqual('ro')
    }
})

it('gets sentence with least practiced kana', async () => {
    fetch.mockResponse(`ロ,ro
ど,do
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
    fetch.mockResponse(`ロ,ro
ど,do
`)

    let ls = new LearnState()
    await ls.init()
    ls.registerSyllable('ro', 'ru', 'ロ')
    for (let i = 0; i < 4; i++) {
        const [kanaSentence, romajiSentence] = ls._getSentenceWithMostMistakenKana()
        expect(romajiSentence[0]).toEqual('ro')
    }
})

it('gets random sentence', async () => {
    fetch.mockResponse(`ロ,ro
ど,do
`)

    let ls = new LearnState()
    await ls.init()
    for (let i = 0; i < 4; i++) {
        const [kanaSentence, romajiSentence] = ls._getRandomSentence()
        expect(['ro', 'do'].indexOf(romajiSentence[0])).not.toBe(-1)
    }
})
