import React, { Component } from 'react';

class KanaSentence extends Component {
    render() {
        const divItems = this.props.kanjiInfo.map((info, index) => {
            let spanItems = []
            let [kanji, start, end] = info
            for (let i = start; i < end; i++) {
                let className = 'unsolved';
                if (i < this.props.position) {
                    className = 'solved';
                } else if (i === this.props.position) {
                    className = 'solving';
                }
                let syllable = this.props.sentence[i]
                let span = <span className={className} key={i}>{syllable}</span>
                spanItems.push(span)
            }
            let topP, bottomP
            if (kanji === '') {
                bottomP = <p>{spanItems}</p>
            } else {
                let className = (this.props.position >= end ? 'solved' : 'unsolved')
                topP = <p className="Furigana">{spanItems}</p>
                bottomP = <p className={className}>{kanji}</p>
            }
            return (
                <div className="Element" key={index}>
                    {topP}
                    {bottomP}
                </div>
            )
        })
        return (
            <div className="KanaSentence">
                {divItems}
            </div>
        )
    }
}

export default KanaSentence;
