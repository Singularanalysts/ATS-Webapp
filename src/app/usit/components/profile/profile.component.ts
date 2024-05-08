import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultantService } from '../../services/consultant.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private consultantServ = inject(ConsultantService);
  profiledata: any;

  ngOnInit(): void {
    const userid = localStorage.getItem('userid');
    this.consultantServ.getProfile(userid).subscribe((res: any) => {
    this.profiledata = res.data;
    })
    
  }

}
