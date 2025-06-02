import { Component } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog';
import { EmployeeManagementService } from 'src/app/usit/services/employee-management.service';
interface TreeNode {
  name: string;
  pseudo: string;
  role: string;
  children?: TreeNode[];
}

@Component({
  selector: 'app-team-flow',
  templateUrl: './team-flow.component.html',
  styleUrls: ['./team-flow.component.scss']
})
export class TeamFlowComponent {
constructor(public dialogRef: MatDialogRef<TeamFlowComponent>,private service:EmployeeManagementService) {}
ngOnInit(){
  this.getDropdown()
}





selectedMember: any = null;
teamMembers: any[] = [];

getDropdown() {
  this.service.getManageListDropdown().subscribe((res: any) => {
    if (res && res.data) {
      this.teamMembers = res.data;
    }
  });
}

currentTree: TreeNode | any = null;

onManagerSelected() {
  if (this.selectedMember && this.selectedMember.userid) {
    this.service.ManagerSelection(this.selectedMember.userid).subscribe((res: any) => {
      const data = res.data;

      const managerNode: TreeNode = {
        name: this.selectedMember.fullname,
        pseudo: this.selectedMember.pseudoname,
        role: this.selectedMember.role,
        children: []
      };

      if (data.teamLeads && data.teamLeads.length) {
        const teamLeadNodes: TreeNode[] = data.teamLeads.map((tl: any, index: number) => {
          const showVerticalArrow = index === 0;

          const executives = (tl.executives || []).map((exec: any, execIndex: number) => ({
            name: exec.name,
            pseudo: exec.pseudoname,
            role: exec.role,
            showHorizontalArrow: execIndex === 0  // first exec only for each team lead
          }));

          return {
            name: tl.name,
            pseudo: tl.pseudoname,
            role: tl.role,
            children: executives,
            showVerticalArrow
          };
        });

        managerNode.children!.push(...teamLeadNodes);
      }

      if (data.directExecutives && data.directExecutives.length) {
        const directExecNodes: TreeNode[] = data.directExecutives.map((exec: any, index: number) => ({
          name: exec.name,
          pseudo: exec.pseudoname,
          role: exec.role,
          showHorizontalArrow: index === 0
        }));

        managerNode.children!.push(...directExecNodes);
      }

      this.currentTree = managerNode;
    });
  }
}



hasDirectExecutives(children: any[]): boolean {
  return children?.some(child => !child.children || child.children.length === 0);
}

hasTeamLeads(children: any[]): boolean {
  return children?.some(child => child.children && child.children.length > 0);
}

shouldShowRightArrow(index: number): boolean {
  const children = this.currentTree.children;
  const current = children[index];
  const next = children[index + 1];
  return (
    !current?.children?.length &&
    !!next &&
    !next?.children?.length
  );
}



}
