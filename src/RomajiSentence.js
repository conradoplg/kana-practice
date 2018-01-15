import React, { Component } from 'react';

class RomajiSentence extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onChange(e.target.value);
    }

    render() {
        return (
            <fieldset>
                <legend>Type sentence in romaji:</legend>
                <input value={this.props.sentence} onChange={this.handleChange} />
            </fieldset>
        );
    }
}

export default RomajiSentence;
