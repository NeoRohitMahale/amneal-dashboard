import {Component, Input, OnInit} from '@angular/core';
import {Package} from '../../models/Package';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {

  @Input() package: Package = new Package();

  constructor() {
  
  }

  ngOnInit() {
  }

}
