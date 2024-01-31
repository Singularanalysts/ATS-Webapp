export class Role {
  roleid!: number;

  rolename!: string;

  roleno!: string;

  description!: string;

  status!: string;

  remarks!: string;
  ///info:info=[];
  //hero = new Employee();
  addedby = localStorage.getItem('userid');
  updatedby = localStorage.getItem('userid');
}
