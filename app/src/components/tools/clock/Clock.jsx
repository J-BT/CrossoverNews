import { useEffect, useState } from 'react';
import './Clock.scss';

function Clock({ timeZone, city = '' }) {
    const [time, setTime] = useState(() =>
        new Intl.DateTimeFormat('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone
        }).format(new Date())
    );

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const formattedTime = new Intl.DateTimeFormat('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone
            }).format(now);
            setTime(formattedTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeZone]);


    return (
        <span>{SetClockContent(city, time)}</span>
    );
}

export default Clock;

/*************************************************************/
/******************** Private functions **********************/

function SetClockContent(city, time) {
    let cityIsEmpty = city === '';
    let clockContent = '';

    if (cityIsEmpty) {
        clockContent =
            <div className="clock utc" >
                <span className='utctime'> {time} </span>
                <span className='utcname'> UTC </span>
            </div >
    }

    else {
        let splitTime = time.split(':');
        time = `${splitTime[0]}:${splitTime[1]}`;
        clockContent =
            <div className="clock city" >
                <span className='cityname'>{city} </span>
                <span className='citytime'> {time} </span>
            </div >
    }

    return clockContent;
}