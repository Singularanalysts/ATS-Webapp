export class TimeSheet {
    timesheetId?: number; // Include the id property
    vendorid?: number;
    startDate!: string; // The start date of the timesheet in YYYY-MM-DD format
    endDate!: string; // The end date of the timesheet in YYYY-MM-DD format
    numberOfHours!: number; // Total hours worked in the timesheet
    timeSheetType!: string; // Type of timesheet (e.g., "Regular")
}

