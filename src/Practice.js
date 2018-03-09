import React, { Component } from 'react';
import KanaSentence from './KanaSentence';
import RomajiSentence from './RomajiSentence';
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
            typedRomajiSentence: '',
            position: 0,
            correctRomajiLength: 0,
        };
    }

    componentDidMount() {
        this.ls.init().then(() => {
            this.changeSentence()
        }).catch((err) => {
            console.log(err)
        })
    }

    setSentence(kanaSentence, romajiSentence) {
        this.setState({
            romajiSentence: romajiSentence,
            kanaSentence: kanaSentence,
            typedRomajiSentence: '',
            position: 0,
            correctRomajiLength: 0,
        });
    }

    changeSentence() {
        let [kanaSentence, romajiSentence] = this.ls.getSentence()
        this.setSentence(kanaSentence, romajiSentence)
    }

    handleRomajiChange(sentence) {
        const typedRomajiSyllable = sentence.substr(this.state.correctRomajiLength)
        const correctRomajiSyllable = this.state.romajiSentence[this.state.position]
        const status = this.ls.checkSyllable(typedRomajiSyllable, correctRomajiSyllable)

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
                console.log('Typed ' + status + ', should be ' + correctRomajiSyllable)
            }
        }
    }

    render() {
        return (
            <div className="Practice">
                <h1 className="Title">Kana Practice</h1>
                <p className="Description">
                Practice your hiragana and katakana knowledge with full sentences
                to improve your reading speed.
                </p>
                <KanaSentence sentence={this.state.kanaSentence} position={this.state.position} />
                <RomajiSentence sentence={this.state.typedRomajiSentence} onChange={this.handleRomajiChange} />
            </div>
        );
    }
}

export default Practice;
