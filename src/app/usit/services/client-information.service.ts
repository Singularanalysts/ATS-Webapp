import { inject, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ClientInformationService {
  private apiServ = inject(ApiService);

  constructor() { }

  getAllTcvrs(data: any) {
    return this.apiServ.post("vms/tcvr/getAll", data);
  }

  saveTcvr(entity: any) {
    return this.apiServ.post("vms/tcvr/saveTcvr", entity);
  }

  getTcvrById(id: number) {
    return this.apiServ.get(`vms/tcvr/getById/${id}`);
  }

  updateTcvr(entity: any) {
    return this.apiServ.put("vms/tcvr/updateTcvr", entity);
  }

  addORUpdateTcvr(entity: any, action: 'edit-tcvr' | 'add-tcvr'){
    return action === 'edit-tcvr' ? this.updateTcvr(entity): this.saveTcvr(entity);
  }

  deleteTcvr(id: number) {
    return this.apiServ.delete(`vms/tcvr/deletedById/${id}`);
  }
}
