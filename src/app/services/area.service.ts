import {Injectable} from '@angular/core';
import {API_BASE_URL} from '../../config/constants';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Area} from '../../models/Area';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor(private http: HttpClient) {
  }

  public getAllAreas(): Observable<Area[]> {
    const URL = 'GetAreas';
    return this.http.get<Area[]>(API_BASE_URL + URL);
  }
}
