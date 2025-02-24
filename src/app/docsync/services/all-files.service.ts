import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AllFilesService {
  
  private apiServ = inject(ApiService);
  private http = inject(HttpClient);

  constructor() { }

  getAllFiles(data: any) {
    return this.apiServ.post(`dropbox/dropboxfolder/list`, data);
  }

  saveFolderOrFileName(data: any) {
    return this.apiServ.post("dropbox/dropboxfolder/savefolder", data);
  }

  updateFolderOrFileName(data: any) {
    return this.apiServ.post("dropbox/dropboxfolder/fUpdate", data);
  }

  addORUpdateFolderOrFileName(entity: any, action: string){
    return action === 'rename-folder' || action === 'rename-file' ? this.updateFolderOrFileName(entity): this.saveFolderOrFileName(entity);
  }

  uploadFiles(parentFolderId: any, userId: any, data: any) {
    return this.apiServ.post(`dropbox/dropboxfolder/uploadMultiple/${parentFolderId}/${userId}`, data);
  }

  downloadFoldersAndFiles(data: any): Observable<Blob> {
    return this.http.post<Blob>(`${this.apiServ.apiUrl}dropbox/dropboxfile/download-files`, data, {
      responseType: 'blob' as 'json',
    });
  }

  deleteFoldersAndFiles(data: any) {
    return this.http.post(`${this.apiServ.apiUrl}dropbox/dropboxfolder/delete`, data);
  }

  getFoldersandFilesByFolderId(folderId: any, userId: any) {
    return this.apiServ.get(`dropbox/dropboxfolder/rootFolders/${folderId}/${userId}`);
  }

}
