import React, { Component } from 'react';
import KanaSentence from './KanaSentence';
import RomajiSentence from './RomajiSentence';
import './Practice.css';

const romajiList = ['-', 'a', 'ba', 'bba', 'bbe', 'bbi', 'bbo', 'bbu', 'bbya', 'bbyo', 'bbyu', 'be', 'bi', 'bo', 'bu', 'bya', 'byo', 'byu', 'ccha', 'cche', 'cchi', 'ccho', 'cchu', 'cha', 'che', 'chi', 'cho', 'chu', 'da', 'dda', 'dde', 'ddi', 'ddo', 'ddu', 'ddya', 'ddyo', 'ddyu', 'de', 'di', 'do', 'du', 'dya', 'dyi', 'dyo', 'dyu', 'e', 'fa', 'fe', 'ffa', 'ffe', 'ffi', 'ffo', 'ffu', 'fi', 'fo', 'fu', 'ga', 'ge', 'gga', 'gge', 'ggi', 'ggo', 'ggu', 'ggya', 'ggyo', 'ggyu', 'gi', 'go', 'gu', 'gya', 'gyo', 'gyu', 'ha', 'he', 'hha', 'hhe', 'hhi', 'hho', 'hhu', 'hhya', 'hhyo', 'hhyu', 'hi', 'ho', 'hu', 'hya', 'hyo', 'hyu', 'i', 'ja', 'je', 'ji', 'jja', 'jji', 'jjo', 'jju', 'jo', 'ju', 'ka', 'ke', 'ki', 'kka', 'kke', 'kki', 'kko', 'kku', 'kkya', 'kkyo', 'kkyu', 'ko', 'ku', 'kya', 'kyo', 'kyu', 'ma', 'me', 'mi', 'mo', 'mu', 'mya', 'myo', 'myu', 'n', "n'", 'na', 'ne', 'ni', 'no', 'nu', 'nya', 'nyo', 'nyu', 'o', 'pa', 'pe', 'pi', 'po', 'ppa', 'ppe', 'ppi', 'ppo', 'ppu', 'ppya', 'ppyo', 'ppyu', 'pu', 'pya', 'pyo', 'pyu', 'ra', 're', 'ri', 'ro', 'rra', 'rre', 'rri', 'rro', 'rru', 'rrya', 'rryo', 'rryu', 'ru', 'rya', 'ryo', 'ryu', 'sa', 'se', 'sha', 'she', 'shi', 'sho', 'shu', 'si', 'so', 'ssa', 'sse', 'ssha', 'sshe', 'sshi', 'ssho', 'sshu', 'ssi', 'sso', 'ssu', 'ssya', 'ssye', 'ssyo', 'ssyu', 'su', 'sya', 'sye', 'syo', 'syu', 'ta', 'te', 'ti', 'to', 'tsu', 'tta', 'tte', 'tti', 'tto', 'ttsu', 'ttu', 'ttya', 'ttye', 'ttyo', 'ttyu', 'tu', 'tya', 'tye', 'tyo', 'tyu', 'u', 'va', 've', 'vi', 'vo', 'vu', 'vva', 'vve', 'vvi', 'vvo', 'vvu', 'wa', 'we', 'wi', 'wo', 'xa', 'xe', 'xi', 'xo', 'xtsu', 'xtu', 'xu', 'xwa', 'xya', 'xyo', 'xyu', 'ya', 'yo', 'yu', 'yya', 'yyo', 'yyu', 'za', 'ze', 'zi', 'zo', 'zu', 'zya', 'zye', 'zyo', 'zyu', 'zza', 'zze', 'zzi', 'zzo', 'zzu', 'zzya', 'zzyo', 'zzyu'];

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

class Practice extends Component {
    constructor(props) {
        super(props);
        this.handleRomajiChange = this.handleRomajiChange.bind(this);
        //ちょ っと そ こ の き み,cho tto so ko no ki mi
        this.state = {
            romajiSentence: 'cho tto so ko no ki mi'.split(' '),
            kanaSentence: 'ちょ っと そ こ の き み'.split(' '),
            typedRomajiSentence: '',
            position: 0,
            correctRomajiLength: 0,
        };
    }

    setSentence(kanaSentence, romajiSentence) {
        this.setState({ kanaSentence: kanaSentence });
    }

    handleRomajiChange(sentence) {
        const typedRomajiSyllable = sentence.substr(this.state.correctRomajiLength)
        const correctRomajiSyllable = this.state.romajiSentence[this.state.position]
        const status = checkSyllable(typedRomajiSyllable, correctRomajiSyllable)

        if ((sentence.length < this.state.correctRomajiLength)
                || !sentence.startsWith(this.state.typedRomajiSentence)) {
            // Read-only portion was edited; restore it
            this.setState({ typedRomajiSentence: this.state.typedRomajiSentence });
        } else if (typedRomajiSyllable === correctRomajiSyllable) {
            // Got it right, advance to next syllable
            this.setState({
                position: this.state.position + 1,
                correctRomajiLength: this.state.correctRomajiLength + correctRomajiSyllable.length,
                typedRomajiSentence: sentence,
            })
        } else if (status === true) {
            // Getting it right, go on
            this.setState({ typedRomajiSentence: sentence });
        } else {
            // Got it wrong, delete wrong romaji syllable
            this.setState({ typedRomajiSentence: sentence.substring(0, this.state.correctRomajiLength) });
            if (status !== false) {
                console.log('Typed ' + status + ', should be ' + correctRomajiSyllable)
            }
        }
    }

    render() {
        return (
            <div className="Practice">
                <KanaSentence sentence={this.state.kanaSentence} position={this.state.position} />
                <RomajiSentence sentence={this.state.typedRomajiSentence} onChange={this.handleRomajiChange} />
            </div>
        );
    }
}

export default Practice;
