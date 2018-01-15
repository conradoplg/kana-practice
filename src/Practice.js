import React, { Component } from 'react';
import logo from './logo.svg';
import KanaSentence from './KanaSentence';
import RomajiSentence from './RomajiSentence';

class Practice extends Component {
    constructor(props) {
        super(props);
        this.handleRomajiChange = this.handleRomajiChange.bind(this);
        this.state = { romajiSentence: '', kanaSentence: '' };
    }

    setKanaSentence(sentence) {
        this.setState({ kanaSentence: sentence });
    }

    handleRomajiChange(sentence) {
        this.setState({ romajiSentence: sentence });
    }

    render() {
        return (
            <div className="Practice">
                <KanaSentence sentence={this.state.kanaSentence} />
                <RomajiSentence sentence={this.state.romajiSentence} onChange={this.handleRomajiChange} />
            </div>
        );
    }
}

export default Practice;
