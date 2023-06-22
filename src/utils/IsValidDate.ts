export default async function isValidDate(year: number, month: number, day: number): Promise<Boolean> {

    let toReturn: Boolean;

    async function isValidYear(year: number): Promise<Boolean> {
        return year >= 1900 && year <= 2100;
    }

    toReturn = await isValidYear(year);
      
    async function isValidMonth(month: number): Promise<Boolean> {
        return month >= 1 && month <= 12;
    }

    toReturn = await isValidMonth(month);

    async function isLeapYear(year: number): Promise<Boolean> {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }
    
    async function getMaxDays(month: number, year: number): Promise<number> {
        const maxDaysByMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      
        if (await isLeapYear(year) && month === 2) {
          return 29;
        }
      
        return maxDaysByMonth[month - 1];
    }
    
    async function isValidDay(year: number, month: number, day: number): Promise<Boolean> {
        const maxDays = await getMaxDays(month, year);
    
        return day >= 1 && day <= maxDays;
    }

    toReturn = await isValidDay(year, month, day);

    return toReturn;
}