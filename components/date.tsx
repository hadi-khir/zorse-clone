const DateDisplay = () => {

    const formatDate = (date: Date): string => {

        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

        const day = date.getDate();
        const suffix =
            day % 10 === 1 && day != 11
                ? 'st'
                : day % 10 === 2 && day !== 12
                    ? 'nd'
                    : day % 10 === 3 && day != 13
                        ? 'rd'
                        : 'th';

        return formattedDate.replace(`${day}`, `${day}${suffix}`);
    };

    const today = new Date();

    return <span className="text-3xl hidden md:block">{formatDate(today)}</span>;
}

export default DateDisplay;