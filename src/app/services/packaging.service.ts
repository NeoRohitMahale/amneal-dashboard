import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Package} from '../../models/Package';
import {API_BASE_URL} from '../../config/constants';

@Injectable({
  providedIn: 'root'
})
export class PackagingService {

  constructor(private http: HttpClient) {
  }

  //fetch all pacakging info
  public getAllPackagingInfo(screenId: Number): Observable<Package[]> {
    const URL = `GetPackagingLineInfo?screenId=${screenId}`;
    return this.http.post<Package[]>(API_BASE_URL + URL, null);
  }
}
