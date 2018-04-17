import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
    fetch.mockResponse(`ロ グ ア ウ ト す る ん じゃ な か った よ,ro gu a u to su ru n ja na ka tta yo,
ど う か し た の と ち い さ い し ろ い ウ サ ギ が き き ま し た,do u ka shi ta no to chi i sa i shi ro i u sa gi ga ki ki ma shi ta,小:7:9 白:11:13 聞:18:19
`)
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
})
