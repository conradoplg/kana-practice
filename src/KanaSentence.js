import React, { Component } from 'react';

class KanaSentence extends Component {
    render() {
        const spanItems = this.props.sentence.map((syllable, index) => {
            let className = 'unsolved';
            if (index < this.props.position) {
                className = 'solved';
            } else if (index === this.props.position) {
                className = 'solving';
            }
            return <span key={index} className={className}>{syllable}</span>
        })
        return (
            <p className="KanaSentence">
                {spanItems}
            </p>
        )
    }
}

export default KanaSentence;
