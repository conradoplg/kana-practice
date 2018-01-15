import React, { Component } from 'react';

class KanaSentence extends Component {
    render() {
        return (
            <p className="KanaSentence">
                {this.props.sentence}
            </p>
        );
    }
}

export default KanaSentence;
