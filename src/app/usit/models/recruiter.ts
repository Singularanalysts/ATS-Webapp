import { Employee } from "./employee";
import { Vms } from "./vms";

export class Recruiter {
    recid!: number;
    recruitertype!: string;
    recruiter!: string;
    location!: string;
    usnumber!: string;
    innumber!: string;
    country!: string;
    state!: string;
    iplogin!: string;
    fedid!: string;
    details!: string;
    email!: string;
    vmsid!: Number;
    status!: string;
    createddate!: string;
    addedby!: number;
    updatedby = localStorage.getItem('userid');
    role!: any;
    remarks!: string;
    addedbyname!: string;
    rec_stat!: string;
    user = new Employee();
    vendor = new Vms();
    id!: number;
    contactnumber!: any;
    extension!: string;
    autoInput!: string;
    alternatecontactnumber!: any;
}
