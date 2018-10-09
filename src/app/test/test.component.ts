import {Component, OnInit} from '@angular/core';

//declare $ for jquery
declare var $: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    $(function () {
      alert('Test');
    });
  }

}
