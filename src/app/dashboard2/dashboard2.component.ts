import {Component, OnInit} from '@angular/core';
import {Facility} from '../../models/Facility';
import {Area} from '../../models/Area';
import {FacilityService} from '../services/facility.service';
import {AreaService} from '../services/area.service';
import {Screen} from '../../models/Screen';
import {Package} from '../../models/Package';
import {ScreenService} from '../services/screen.service';
import {PackagingService} from '../services/packaging.service';
import {HUB_URL} from '../../config/constants';

declare let $: any;

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements OnInit {

  selectedFacilityId: Number;
  selectedAreaId: Number;
  statusCounts: any[] = [];

  facilities: Facility[] = [];
  areas: Area[] = [];
  screen: Screen;
  packages: Package[] = [];
  finalFilteredPackages: any;
  minHeight:any;


  constructor(private faciltyService: FacilityService, private areaService: AreaService,
              private screenService: ScreenService, private packagingService: PackagingService) {

    this.selectedAreaId = sessionStorage.getItem('AreaId') ? Number(sessionStorage.getItem('AreaId')) : 1;
    this.selectedFacilityId = sessionStorage.getItem('FacilityId') ? Number(sessionStorage.getItem('FacilityId')) : 1;
    console.log(this.selectedFacilityId,this.selectedAreaId);

    //initialize Array
    this.finalFilteredPackages = new Array<Package>(5);
    for (let i = 0; i < 5; i++) {
      this.finalFilteredPackages[i] = new Array<Package>(5);
    }
  }

  ngOnInit() {
    //fetch areas
    this.getAreas();
    //fetch facilities
    this.getFacilities();
    //screen
    this.getScreen();
    //  console.log(this.finalFilteredPackages);

  }

  //get faclilities
  getFacilities(): void {
    this.faciltyService.getAllFacilities()
      .subscribe(res => {
        this.facilities = res;
        console.log(this.facilities);
      }, err => {
        console.error(err);
      });
  }

  //get faclilities
  getAreas(): void {
    this.areaService.getAllAreas()
      .subscribe(res => {
        this.areas = res;
        console.log(this.areas);
      }, err => {
        console.error(err);
      });
  }

  //get current screen based on packaging location and amneal site
  getScreen() {

    //set values
    sessionStorage.setItem('AreaId', this.selectedAreaId.toString());
    sessionStorage.setItem('FacilityId', this.selectedFacilityId.toString());

    this.screenService.getPackagingScreen(
      this.selectedFacilityId, this.selectedAreaId
    ).subscribe(res => {
      console.log(res);
      this.screen = res;

      //get all packaging info
      if (!this.screen.ScreenId) {
        //  alert('Unable to fetch Screen/Port Number from the API Endpoint');
        this.packages = [];
        this.mapPackagesToArray();
        return;
      }
      console.log(this.getPackagingLineInfo(this.screen.ScreenId, false));
    }, err => {
      console.log(err);
    });
  }

  //Get all packaging line info
  getPackagingLineInfo(screenId: Number, reload: boolean) {
    console.log(screenId,reload);
    this.packagingService.getAllPackagingInfo(screenId)
      .subscribe(res => {
        console.log(res);

        this.packages = res[0]['PackagingLineInfo'];
        this.statusCounts = res[0]['Counts']['Status'];
        //  console.log(this.lineCounts[0].Total);

        //map to 2d
        this.mapPackagesToArray();

        if (!reload) {
          //connect to signalr
          this.startHub();
        }

      }, err => {
        console.error(err);
      });
  }

  mapPackagesToArray() {

     // this.packages = [
     //    {
     //      Count: ""
     //      ItemName: "Completed1"
     //      ItemStatus: "1"
     //      ItemStatusTime: "9/18/2018 9:30:49 AM"
     //      LineStatus: "Completed"
     //      ModifiedOn: "9/11/2018 12:22:30 PM"
     //      PackagingLine: "Line 1"
     //      ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414) "
     //      ShippingForecastPackagingId: "50"
     //    },
     //    {
     //      Count: ""
     //      ItemName: "Completed2"
     //      ItemStatus: "1"
     //      ItemStatusTime: "9/18/2018 9:30:49 AM"
     //      LineStatus: "Completed"
     //      ModifiedOn: "9/11/2018 12:22:30 PM"
     //      PackagingLine: "Line 1"
     //      ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
     //      ShippingForecastPackagingId: "50"
     //    },
     //    {
     //      Count: ""
     //      ItemName: "Warehouse"
     //      ItemStatus: "1"
     //      ItemStatusTime: "9/18/2018 9:30:49 AM"
     //      LineStatus: "Warehouse & QA"
     //      ModifiedOn: "9/11/2018 12:22:30 PM"
     //      PackagingLine: "Line 1"
     //      ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
     //      ShippingForecastPackagingId: "50"
     //    },
     //    {
     //      Count: ""
     //      ItemName: "Warehouse"
     //      ItemStatus: "1"
     //      ItemStatusTime: "9/18/2018 9:30:49 AM"
     //      LineStatus: "Warehouse & QA"
     //      ModifiedOn: "9/11/2018 12:22:30 PM"
     //      PackagingLine: "Line 1"
     //      ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
     //      ShippingForecastPackagingId: "50"
     //    },
     //      {
     //      Count: ""
     //      ItemName: "Ready"
     //      ItemStatus: "1"
     //      ItemStatusTime: "9/18/2018 9:30:49 AM"
     //      LineStatus: "Ready For Process"
     //      ModifiedOn: "9/11/2018 12:22:30 PM"
     //      PackagingLine: "Line 1"
     //      ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
     //      ShippingForecastPackagingId: "50"
     //    },
     //      {
     //      Count: ""
     //      ItemName: "Ready"
     //      ItemStatus: "1"
     //      ItemStatusTime: "9/18/2018 9:30:49 AM"
     //      LineStatus: "Ready For Process"
     //      ModifiedOn: "9/11/2018 12:22:30 PM"
     //      PackagingLine: "Line 1"
     //      ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
     //      ShippingForecastPackagingId: "50"
     //    },
     //      {
     //      Count: ""
     //      ItemName: "Scheduled1"
     //      ItemStatus: "1"
     //      ItemStatusTime: "9/18/2018 9:30:49 AM"
     //      LineStatus: "Scheduled"
     //      ModifiedOn: "9/11/2018 12:22:30 PM"
     //      PackagingLine: "Line 2"
     //      ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
     //      ShippingForecastPackagingId: "50"
     //    },
     //    {
     //      Count: ""
     //      ItemName: "Scheduled2"
     //      ItemStatus: "1"
     //      ItemStatusTime: "9/18/2018 9:30:49 AM"
     //      LineStatus: "Scheduled"
     //      ModifiedOn: "9/11/2018 12:22:30 PM"
     //      PackagingLine: "Line 2"
     //      ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
     //      ShippingForecastPackagingId: "50"
     //    },
     //    {
     //      Count: ""
     //      ItemName: "In-Progress1"
     //      ItemStatus: "1"
     //      ItemStatusTime: "9/18/2018 9:30:49 AM"
     //      LineStatus: "In-Progress"
     //      ModifiedOn: "9/11/2018 12:22:30 PM"
     //      PackagingLine: "Line 2"
     //      ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
     //      ShippingForecastPackagingId: "50"
     //    },
     //      {
     //      Count: ""
     //      ItemName: "In-Progress2"
     //      ItemStatus: "1"
     //      ItemStatusTime: "9/18/2018 9:30:49 AM"
     //      LineStatus: "In-Progress"
     //      ModifiedOn: "9/11/2018 12:22:30 PM"
     //      PackagingLine: "Line 2"
     //      ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
     //      ShippingForecastPackagingId: "50"
     //    }
     //    ]
        this.minHeight = (window.innerHeight - 155) /5 + 'px';

    //line 1 --
    this.finalFilteredPackages[0][0] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 1' && pkg.LineStatus.toUpperCase() === 'Completed'.toUpperCase();
    });

    this.finalFilteredPackages[0][1] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 1' && pkg.LineStatus.toUpperCase() === 'In-Progress'.toUpperCase();
    });

    this.finalFilteredPackages[0][2] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 1' && pkg.LineStatus.toUpperCase() === 'Ready For Process'.toUpperCase();
    });

    this.finalFilteredPackages[0][3] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 1' && pkg.LineStatus.toUpperCase() === 'Scheduled'.toUpperCase();
    });

    this.finalFilteredPackages[0][4] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 1' && pkg.LineStatus.toUpperCase() === 'Warehouse & QA'.toUpperCase();
    });

    //line 2
    this.finalFilteredPackages[1][0] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 2' && pkg.LineStatus.toUpperCase() === 'Completed'.toUpperCase();
    });

    this.finalFilteredPackages[1][1] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 2' && pkg.LineStatus.toUpperCase() === 'In-Progress'.toUpperCase();
    });

    this.finalFilteredPackages[1][2] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 2' && pkg.LineStatus.toUpperCase() === 'Ready For Process'.toUpperCase();
    });

    this.finalFilteredPackages[1][3] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 2' && pkg.LineStatus.toUpperCase() === 'Scheduled'.toUpperCase();
    });

    this.finalFilteredPackages[1][4] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 2' && pkg.LineStatus.toUpperCase() === 'Warehouse & QA'.toUpperCase();
    });

    //line 3
    this.finalFilteredPackages[2][0] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 3' && pkg.LineStatus.toUpperCase() === 'Completed'.toUpperCase();
    });

    this.finalFilteredPackages[2][1] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 3' && pkg.LineStatus.toUpperCase() === 'In-Progress'.toUpperCase();
    });

    this.finalFilteredPackages[2][2] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 3' && pkg.LineStatus.toUpperCase() === 'Ready For Process'.toUpperCase();
    });

    this.finalFilteredPackages[2][3] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 3' && pkg.LineStatus.toUpperCase() === 'Scheduled'.toUpperCase();
    });

    this.finalFilteredPackages[2][4] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 3' && pkg.LineStatus.toUpperCase() === 'Warehouse & QA'.toUpperCase();
    });

    //line 4
    this.finalFilteredPackages[3][0] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 4' && pkg.LineStatus.toUpperCase() === 'Completed'.toUpperCase();
    });

    this.finalFilteredPackages[3][1] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 4' && pkg.LineStatus.toUpperCase() === 'In-Progress'.toUpperCase();
    });

    this.finalFilteredPackages[3][2] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 4' && pkg.LineStatus.toUpperCase() === 'Ready For Process'.toUpperCase();
    });

    this.finalFilteredPackages[3][3] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 4' && pkg.LineStatus.toUpperCase() === 'Scheduled'.toUpperCase();
    });

    this.finalFilteredPackages[3][4] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 4' && pkg.LineStatus.toUpperCase() === 'Warehouse & QA'.toUpperCase();
    });

    //line 5
    this.finalFilteredPackages[4][0] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 5' && pkg.LineStatus.toUpperCase() === 'Completed'.toUpperCase();
    });

    this.finalFilteredPackages[4][1] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 5' && pkg.LineStatus.toUpperCase() === 'In-Progress'.toUpperCase();
    });

    this.finalFilteredPackages[4][2] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 5' && pkg.LineStatus.toUpperCase() === 'Ready For Process'.toUpperCase();
    });

    this.finalFilteredPackages[4][3] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 5' && pkg.LineStatus.toUpperCase() === 'Scheduled'.toUpperCase();
    });

    this.finalFilteredPackages[4][4] = this.packages.filter(pkg => {
      return pkg.PackagingLine === 'Line 5' && pkg.LineStatus.toUpperCase() === 'Warehouse & QA'.toUpperCase();
    });

    console.log(this.finalFilteredPackages);

    //limit packages to max count 2..
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (this.finalFilteredPackages[i][j].count > 2) {
          this.finalFilteredPackages[i][j] = this.finalFilteredPackages[i][j].splice(1, 3);
        }
      }
    }
  }


  //start hub
  let;
  startHub = () => {
    $.connection.hub.url = HUB_URL;
    let lineHub = $.connection.shippingForecastPackagingLineHub;

    //this function will be called each time the server sends you new data, so in here have the call for the interface to update

    lineHub.client.getPKGLineChangeForScreen = (returnedData) => {
      returnedData = JSON.parse(returnedData);

      //logged to view returned data
      console.log(returnedData);

      this.getPackagingLineInfo(this.screen.ScreenId, true);

    };

    $.connection.hub.start()
      .done((r) => {
        console.log('connected');

        // this will register the port # so this specific port gets notified
        lineHub.server.subScribeToPackagingLine(new String(this.screen.ScreenId));


      })
      .fail((r) => {
        console.log(r);
      });
  };


}
