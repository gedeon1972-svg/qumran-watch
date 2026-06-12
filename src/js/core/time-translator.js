export function getQumranEquivalent(date, sunriseHour) {
    const hours = date.getHours() + date.getMinutes() / 60;
    if (sunriseHour == null || isNaN(sunriseHour)) return 'current';
    if (hours < sunriseHour) return 'prev';
    return 'current';
}
