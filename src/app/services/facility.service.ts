import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Facility} from '../../models/Facility';
import {API_BASE_URL} from '../../config/constants';

/*//cors
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Origin, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  })
};*/

@Injectable({
  providedIn: 'root'
})
export class FacilityService {

  constructor(private http: HttpClient) {
  }

  public getAllFacilities(): Observable<Facility[]> {
    const URL = 'GetFacilities';
    return this.http.get<Facility[]>(API_BASE_URL + URL);
  }
}
