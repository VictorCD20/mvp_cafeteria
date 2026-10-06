const TIME_ZONE = 'America/Mexico_City';

/** Fecha de hoy en hora de México (YYYY-MM-DD), no UTC. */
export const todayInMexico = (date: Date = new Date()): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(date);

/** Hora actual en México en formato 24 h (HH:MM). */
export const timeInMexico = (date: Date = new Date()): string =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);

/** true si la fecha cae en viernes en hora de México. */
export const isFridayInMexico = (date: Date = new Date()): boolean =>
  new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, weekday: 'short' }).format(date) === 'Fri';

/** Fecha (YYYY-MM-DD) de hace `days` días en hora de México. */
export const daysAgoInMexico = (days: number, date: Date = new Date()): string =>
  todayInMexico(new Date(date.getTime() - days * 24 * 60 * 60 * 1000));
