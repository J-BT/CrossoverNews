import './Header.scss';
import Clock from '../clock/Clock'

function Header() {

    const timezones = [
        { city: 'Paris', timeZone: 'Europe/Paris' },
        { city: 'Tokyo', timeZone: 'Asia/Tokyo' },
        { city: 'Brasilia', timeZone: 'America/Sao_Paulo' },
        { city: 'New York', timeZone: 'America/New_York' }
    ];

    return (
        <header className="header">
            <h1>CROSSOVER NEWS <span className='version'>v1.1</span></h1>
            <div className="timezones">
                <div className="utc-clock"><Clock timeZone={'UTC'} /> </div>
                <div className="city-clock">
                    {timezones.map((timezone) => (
                        <Clock
                            key={timezone.city}
                            city={timezone.city}
                            timeZone={timezone.timeZone}
                        />
                    ))}
                </div>
            </div>
        </header>
    );
}

export default Header;