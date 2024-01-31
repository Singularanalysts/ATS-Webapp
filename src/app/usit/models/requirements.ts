
import { Recruiter } from "./recruiter";
import { Technology } from "./technology";
import { Vms } from "./vms";

export class Requirements {
	reqnumber!:string;
	duration!:string;
    requirementid!:number;
	postedon!:string;
	vendor!:string;
	jobtitle!:string;
	category!:string;
	pocemail!:string;
	pocphonenumber!:string;
	jobdescription!:string;
	recruitername!:string;
	location!:string;
	jobexperience!:string;
    jobskills!:string;
	employmenttype!:string;
	salary!:number;
	source!:string;
	updateddate!:string;
	status!:string;
	pocname!:string;
	pocposition!:string;
	maxnumber!:string;
	updatedby = localStorage.getItem('userid');
	createddate!:string;
	technology = new Technology();
	client!:string;
	vendorimpl = new Vms();
	recruiter = new Recruiter();

	//empid:any=[];
}
