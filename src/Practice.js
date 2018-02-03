import React, { Component } from 'react';
import KanaSentence from './KanaSentence';
import RomajiSentence from './RomajiSentence';
import './Practice.css';

class Practice extends Component {
    constructor(props) {
        super(props);
        this.handleRomajiChange = this.handleRomajiChange.bind(this);
        //ちょ っと そ こ の き み,cho tto so ko no ki mi
        this.state = {
            romajiSentence: '',
            kanaSentence: 'ちょ っと そ こ の き み'.split(' '),
            position: 1,
        };
    }

    setSentence(kanaSentence, romajiSentence) {
        this.setState({ kanaSentence: kanaSentence });
    }

    handleRomajiChange(sentence) {
        this.setState({ romajiSentence: sentence });
    }

    render() {
        return (
            <div className="Practice">
                <KanaSentence sentence={this.state.kanaSentence} position={this.state.position} />
                <RomajiSentence sentence={this.state.romajiSentence} onChange={this.handleRomajiChange} />
            </div>
        );
    }
}

export default Practice;
