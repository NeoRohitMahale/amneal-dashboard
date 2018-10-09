import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Screen} from '../../models/Screen';
import {API_BASE_URL} from '../../config/constants';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  constructor(private http: HttpClient) {
  }

  public getPackagingScreen(facilityId: Number, areaId: Number): Observable<Screen> {
    const URL = `GetPackagingScreen?facilityId=${facilityId}&areaId=${areaId}`;
    return this.http.post<Screen>(API_BASE_URL + URL, null);
  }
}
