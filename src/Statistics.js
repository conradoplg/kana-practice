import React, { Component } from 'react';
import './Statistics.css';

class Statistics extends Component {
    render() {
        const spanItems = this.props.topMistakenKana.map((stats, index) => {
            return (
                <span key={index}>
                    <span className="MistakenKana">
                        {stats[1]}
                    </span>
                    {' '}
                    <span className="MistakenKanaFrequency">
                        ({stats[0]})
                    </span>
                </span>
            )
        })
        return (
            <section className="Statistics">
                <h2>Statistics</h2>
                {spanItems.length > 0 &&
                    <section className="TopMistakenKana">
                        <h3>Top mistaken kana</h3>
                        <p>{spanItems}</p>
                    </section>
                }
            </section>
        )
    }
}

export default Statistics;
