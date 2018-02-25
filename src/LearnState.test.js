import LearnState from './LearnState';

it('is created correctly', () => {
    let ls = new LearnState()
    expect(ls.wrongCountDict['も']).toEqual({correct: 0, wrong: 0})
})

it('initializes correctly', async () => {
    fetch.mockResponse(`ロ グ ア ウ ト す る ん じゃ な か った よ,ro gu a u to su ru n ja na ka tta yo
ど う か し た の と ち い さ い し ろ い ウ サ ギ が き き ま し た,do u ka shi ta no to chi i sa i shi ro i u sa gi ga ki ki ma shi ta
`)

    let ls = new LearnState()
    await ls.init()
    expect(ls.sentences.length).toEqual(2)
})
