export class Technology {
    id!:number;
    technologyarea!:string;
    listofkeyword!:string;
    comments!:string; 
    status!:string;
    createddate!:string;
    //addedby!:number;
    remarks!:string;

    addedby = localStorage.getItem('userid');
	updatedby = localStorage.getItem('userid');
}
