import React, { Component } from 'react';
import './RomajiSentence.css';

class RomajiSentence extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onChange(e.target.value);
    }

    render() {
        const label = 'Type sentence in romaji'
        return (
            <fieldset className="RomajiSentence">
                <legend>{label}:</legend>
                <input value={this.props.sentence}
                    onChange={this.handleChange} placeholder={label + "..."}
                    autoFocus />
            </fieldset>
        );
    }
}

export default RomajiSentence;
