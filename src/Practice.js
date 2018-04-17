import React, { Component } from 'react';
import KanaSentence from './KanaSentence';
import RomajiSentence from './RomajiSentence';
import Statistics from './Statistics';
import LearnState from './LearnState';
import './Practice.css';


class Practice extends Component {
    constructor(props) {
        super(props);
        this.ls = new LearnState();
        this.handleRomajiChange = this.handleRomajiChange.bind(this);
        this.state = {
            romajiSentence: [],
            kanaSentence: [],
            kanjiInfo: [],
            typedRomajiSentence: '',
            position: 0,
            correctRomajiLength: 0,
            topMistakenKana: [],
        };
    }

    componentDidMount() {
        this.ls.init(window.localStorage).then(() => {
            this.changeSentence()
        }).catch((err) => {
            console.log(err)
        })
    }

    setSentence(kanaSentence, romajiSentence, kanjiInfo) {
        this.setState({
            romajiSentence: romajiSentence,
            kanaSentence: kanaSentence,
            kanjiInfo: kanjiInfo,
            typedRomajiSentence: '',
            position: 0,
            correctRomajiLength: 0,
            topMistakenKana: this.ls.getTopMistakenKana(),
        })
    }

    changeSentence() {
        let [kanaSentence, romajiSentence, kanjiInfo] = this.ls.getSentence()
        this.setSentence(kanaSentence, romajiSentence, kanjiInfo)
    }

    handleRomajiChange(sentence) {
        const typedRomajiSyllable = sentence.substr(this.state.correctRomajiLength)
        const correctRomajiSyllable = this.state.romajiSentence[this.state.position]
        const correctKanaSyllable = this.state.kanaSentence[this.state.position]
        const status = this.ls.checkSyllable(
            typedRomajiSyllable, correctRomajiSyllable, correctKanaSyllable)
        const correctRomajiSentence = this.state.romajiSentence.join('')

        if (!sentence.startsWith(correctRomajiSentence.substr(0, this.state.correctRomajiLength))) {
            // Read-only portion was edited; restore it
            this.setState({ typedRomajiSentence: this.state.typedRomajiSentence });
        } else if (typedRomajiSyllable === correctRomajiSyllable) {
            // Got it right, advance to next syllable
            this.setState({
                position: this.state.position + 1,
                correctRomajiLength: this.state.correctRomajiLength + correctRomajiSyllable.length,
                typedRomajiSentence: sentence,
            })
            if (this.state.position === this.state.kanaSentence.length - 1) {
                this.changeSentence()
            }
        } else if (status === true) {
            // Getting it right, go on
            this.setState({ typedRomajiSentence: sentence });
        } else {
            // Got it wrong, delete wrong romaji syllable
            this.setState({ typedRomajiSentence: sentence.substring(0, this.state.correctRomajiLength) });
            if (status !== false) {
            }
        }
        this.setState({topMistakenKana: this.ls.getTopMistakenKana()})
    }

    render() {
        return (
            <div className="Practice">
                <h1 className="Title">Kana Practice</h1>
                <p className="Description">
                Practice your hiragana and katakana knowledge with full sentences
                to improve your reading speed.
                </p>
                <KanaSentence sentence={this.state.kanaSentence} kanjiInfo={this.state.kanjiInfo}
                    position={this.state.position} />
                <RomajiSentence sentence={this.state.typedRomajiSentence} onChange={this.handleRomajiChange} />
                <Statistics topMistakenKana={this.state.topMistakenKana} />
            </div>
        )
    }
}

export default Practice;
