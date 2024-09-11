import { inject, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AllFilesService {
  private apiServ = inject(ApiService);

  constructor() { }

  getAllFiles(data: any) {
    return this.apiServ.post(`dropbox/dropboxfolder/list`, data);
  }

  saveFolderOrFileName(data: any) {
    return this.apiServ.post("dropbox/dropboxfolder/savefolder   ", data);
  }

  updateFolderOrFileName(data: any) {
    return this.apiServ.put("dropbox/dropboxfolder/updatefolder", data);
  }

  addORUpdateFolderOrFileName(entity: any, action: string){
    return action === 'edit-folder' ? this.updateFolderOrFileName(entity): this.saveFolderOrFileName(entity);
  }
}
