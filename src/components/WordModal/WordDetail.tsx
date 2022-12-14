import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { IWDetail } from 'app/interfaces'

import style from './worddetail.module.scss'
import React, { useRef } from 'react'
import AudioButton from 'components/AudioButton/AudioButton'

type WordDetailProps = {
    detail: IWDetail[]
}
const WordDetail = ({ detail }: WordDetailProps) => {
    return (
        <div>
            {detail.map((d, index) => (
                <div key={index} className={style.detailBlock}>
                    <div className={style.word}>{d.word}</div>

                    <div className={style.posWrapper}>
                        {d.pos.map((p, index) => (
                            <div key={index} className={style.pos}>
                                {p}
                            </div>
                        ))}
                    </div>

                    <div className={style.ipaWrapper}>
                        {d.uk && (
                            <>
                                {d.uk.pron && (
                                    <div className={style.ipaLabel}>
                                        UK: /
                                        <span className={style.ipa}>
                                            {d.uk.pron}
                                        </span>
                                        /
                                    </div>
                                )}
                                {d.uk.audio.length > 0 && (
                                    <AudioButton audio={d.uk.audio} />
                                )}
                            </>
                        )}
                        {d.us && (
                            <>
                                {d.us.pron && (
                                    <div className={style.ipaLabel}>
                                        US: /
                                        <span className={style.ipa}>
                                            {d.us.pron}
                                        </span>
                                        /
                                    </div>
                                )}
                                {d.us.audio.length > 0 && (
                                    <AudioButton audio={d.us.audio} />
                                )}
                            </>
                        )}
                    </div>

                    <div className={style.sensesWrapper}>
                        {d.senses.map((s, index) => (
                            <div key={index} className={style.senses}>
                                <div className={style.def}>{s.def}</div>

                                <ul className={style.expWrapper}>
                                    {s.examples.map((e, index) => (
                                        <li key={index} className={style.exp}>
                                            {e}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default WordDetail
