import {Component, OnInit} from '@angular/core';
import {FacilityService} from '../services/facility.service';
import {Facility} from '../../models/Facility';
import {Area} from '../../models/Area';
import {AreaService} from '../services/area.service';
import {ScreenService} from '../services/screen.service';
import {PackagingService} from '../services/packaging.service';
import {Screen} from '../../models/Screen';
import {Package} from '../../models/Package';
import {
  HUB_URL,
  PORT_1,
  PORT_2,
  STATUS_COMPLETED,
  STATUS_IN_PROGRESS,
  STATUS_READY_FOR_PROCESS,
  STATUS_SCHEDULED,
  STATUS_WAREHOUSE_AND_QA
} from '../../config/constants';
import {PackagingLineService} from '../services/packaging-line.service';
import {PackagingLine} from '../../models/PackagingLine';

declare let $: any;


@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.css']
})
export class Dashboard1Component implements OnInit {

  //declarations
  allowScreenSelect: boolean;
  selectedFacilityId: Number;
  selectedAreaId: Number;
  lineCounts: any[] = [];
  center:any;

  facilities: Facility[] = [];
  areas: Area[] = [];
  screen: Screen;
  packages: Package[] = [];
  packagingLines: PackagingLine[] = [];
  finalFilteredPackages: any;
  minHeight:any =0;
  minHeightscreenMode2:any = 0;
  minwidth:any=0;
  temp: any;

  const;
  STATUS_COMPLETED = STATUS_COMPLETED;
  //const;
  // const;
  STATUS_IN_PROGRESS = STATUS_IN_PROGRESS;
  // const;
  STATUS_READY_FOR_PROCESS = STATUS_READY_FOR_PROCESS;
  // const;
  STATUS_SCHEDULED = STATUS_SCHEDULED;
//  const;
  STATUS_WAREHOUSE_AND_QA = STATUS_WAREHOUSE_AND_QA;

  //screenMode
  screenMode: Number;

  //ctor
  constructor(private faciltyService: FacilityService, private areaService: AreaService,
              private screenService: ScreenService, private packagingService: PackagingService,
              private packagingLineService: PackagingLineService) {

    this.selectedAreaId = sessionStorage.getItem('AreaId') ? Number(sessionStorage.getItem('AreaId')) : 1;
    this.selectedFacilityId = sessionStorage.getItem('FacilityId') ? Number(sessionStorage.getItem('FacilityId')) : 1;

    //initialize Array
    this.finalFilteredPackages = new Array<Package>(5);
    for (let i = 0; i < 5; i++) {
      this.finalFilteredPackages[i] = new Array<Package>(5);
    }

    //init screenMode to 1
    this.screenMode = 1;


  }

  ngOnInit() {

    //Current URL and port
    console.log(window.location.port);

    this.allowScreenSelect = window.location.port === PORT_1 || window.location.port === PORT_2;

    if (this.allowScreenSelect) {
      //fetch areas
      this.getAreas();
      //fetch facilities
      this.getFacilities();
      //screen
      this.getScreen();
      //console.log(this.finalFilteredPackages);

    }

    else {
      this.screen = new Screen();
      this.screen.ScreenId = Number(window.location.port);
      this.getAllPacakgingLines(this.screen.ScreenId);
      //this.getPackagingLineInfo(this.screen.ScreenId, false);
    }

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

  //get areas
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


    //this.screenService.getPackagingScreen().
    console.log(this.selectedFacilityId, this.selectedAreaId);
    this.screenService.getPackagingScreen(
      this.selectedFacilityId, this.selectedAreaId
    ).subscribe(res => {
      console.log(res);
      this.screen = res;

      //get all packaging info
      if (!this.screen.ScreenId) {
        // /alert('Unable to fetch Screen/Port Number from the API Endpoint');
        this.packages = [];
        //this.mapPackagesToArray();
        return;
      }
      this.getAllPacakgingLines(this.screen.ScreenId);

    }, err => {
      console.error(err);
    });
  }

  //Get all packaging line info
  getPackagingLineInfo(screenId: Number, reload: boolean) {
    this.packagingService.getAllPackagingInfo(screenId)
      .subscribe(res => {

        this.packages = res[0]['PackagingLineInfo'];
        this.lineCounts = res[0]['Counts']['Lines'];
        //  console.log(this.lineCounts[0].Total);

        console.log(this.packages);
        // this.packages = [
        // {
        //   Count: ""
        //   ItemName: "Completed1"
        //   ItemStatus: "1"
        //   ItemStatusTime: "9/18/2018 9:30:49 AM"
        //   LineStatus: "Completed"
        //   ModifiedOn: "9/11/2018 12:22:30 PM"
        //   PackagingLine: "Line 1"
        //   ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414) "
        //   ShippingForecastPackagingId: "50"
        // },
        // {
        //   Count: ""
        //   ItemName: "Completed2"
        //   ItemStatus: "1"
        //   ItemStatusTime: "9/18/2018 9:30:49 AM"
        //   LineStatus: "Completed"
        //   ModifiedOn: "9/11/2018 12:22:30 PM"
        //   PackagingLine: "Line 1"
        //   ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
        //   ShippingForecastPackagingId: "50"
        // },
        // {
        //   Count: ""
        //   ItemName: "Ware"
        //   ItemStatus: "1"
        //   ItemStatusTime: "9/18/2018 9:30:49 AM"
        //   LineStatus: "Warehouse & QA"
        //   ModifiedOn: "9/11/2018 12:22:30 PM"
        //   PackagingLine: "Line 1"
        //   ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
        //   ShippingForecastPackagingId: "50"
        // },
        // {
        //   Count: ""
        //   ItemName: "Wareh"
        //   ItemStatus: "1"
        //   ItemStatusTime: "9/18/2018 9:30:49 AM"
        //   LineStatus: "Warehouse & QA"
        //   ModifiedOn: "9/11/2018 12:22:30 PM"
        //   PackagingLine: "Line 1"
        //   ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
        //   ShippingForecastPackagingId: "50"
        // },
        //   {
        //   Count: ""
        //   ItemName: "Ready"
        //   ItemStatus: "1"
        //   ItemStatusTime: "9/18/2018 9:30:49 AM"
        //   LineStatus: "Ready For Process"
        //   ModifiedOn: "9/11/2018 12:22:30 PM"
        //   PackagingLine: "Line 1"
        //   ProductName: ""
        //   ShippingForecastPackagingId: "50"
        // },
        //   {
        //   Count: ""
        //   ItemName: "Ready"
        //   ItemStatus: "1"
        //   ItemStatusTime: "9/18/2018 9:30:49 AM"
        //   LineStatus: "Ready For Process"
        //   ModifiedOn: "9/11/2018 12:22:30 PM"
        //   PackagingLine: "Line 1"
        //   ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
        //   ShippingForecastPackagingId: "50"
        // },
        //   {
        //   Count: ""
        //   ItemName: "Sched1"
        //   ItemStatus: "1"
        //   ItemStatusTime: "9/18/2018 9:30:49 AM"
        //   LineStatus: "Scheduled"
        //   ModifiedOn: "9/11/2018 12:22:30 PM"
        //   PackagingLine: "Line 2"
        //   ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
        //   ShippingForecastPackagingId: "50"
        // },
        // {
        //   Count: ""
        //   ItemName: "Sched2"
        //   ItemStatus: "1"
        //   ItemStatusTime: "9/18/2018 9:30:49 AM"
        //   LineStatus: "Scheduled"
        //   ModifiedOn: "9/11/2018 12:22:30 PM"
        //   PackagingLine: "Line 2"
        //   ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
        //   ShippingForecastPackagingId: "50"
        // },
        // {
        //   Count: ""
        //   ItemName: "In-Prog"
        //   ItemStatus: "1"
        //   ItemStatusTime: "9/18/2018 9:30:49 AM"
        //   LineStatus: "In-Progress"
        //   ModifiedOn: "9/11/2018 12:22:30 PM"
        //   PackagingLine: "Line 2"
        //   ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
        //   ShippingForecastPackagingId: "50"
        // },
        //   {
        //   Count: ""
        //   ItemName: "In-Progr"
        //   ItemStatus: "1"
        //   ItemStatusTime: "9/18/2018 9:30:49 AM"
        //   LineStatus: "In-Progress"
        //   ModifiedOn: "9/11/2018 12:22:30 PM"
        //   PackagingLine: "Line 2"
        //   ProductName: "Memantine Hydrochloride Immediate Release Pellets for Memantine Hydrochloride Extended Release and Donepezil Hydrochloride Capsules, 28mg/10mg and 14mg/10mg ( 03-3414)"
        //   ShippingForecastPackagingId: "50"
        // }
        // ]

        //map to 2d
        // this.mapPackagesToArray();

        if (!reload) {
          //connect to signalr
          this.startHub();
        }

      }, err => {
        console.error(err);
      });
  }

  /* mapPackagesToArray() {

     //line 1 --
     this.finalFilteredPackages[0][0] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 1' && pkg.LineStatus.toUpperCase() === STATUS_COMPLETED.toUpperCase();
     });

     this.finalFilteredPackages[0][1] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 1' && pkg.LineStatus.toUpperCase() === STATUS_IN_PROGRESS.toUpperCase();
     });

     this.finalFilteredPackages[0][2] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 1' && pkg.LineStatus.toUpperCase() === STATUS_READY_FOR_PROCESS.toUpperCase();
     });

     this.finalFilteredPackages[0][3] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 1' && pkg.LineStatus.toUpperCase() === STATUS_SCHEDULED.toUpperCase();
     });

     this.finalFilteredPackages[0][4] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 1' && pkg.LineStatus.toUpperCase() === STATUS_WAREHOUSE_AND_QA.toUpperCase();
     });

     //line 2
     this.finalFilteredPackages[1][0] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 2' && pkg.LineStatus.toUpperCase() === STATUS_COMPLETED.toUpperCase();
     });

     this.finalFilteredPackages[1][1] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 2' && pkg.LineStatus.toUpperCase() === STATUS_IN_PROGRESS.toUpperCase();
     });

     this.finalFilteredPackages[1][2] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 2' && pkg.LineStatus.toUpperCase() === STATUS_READY_FOR_PROCESS.toUpperCase();
     });

     this.finalFilteredPackages[1][3] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 2' && pkg.LineStatus.toUpperCase() === STATUS_SCHEDULED.toUpperCase();
     });

     this.finalFilteredPackages[1][4] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 2' && pkg.LineStatus.toUpperCase() === STATUS_WAREHOUSE_AND_QA.toUpperCase();
     });

     //line 3
     this.finalFilteredPackages[2][0] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 3' && pkg.LineStatus.toUpperCase() === STATUS_COMPLETED.toUpperCase();
     });

     this.finalFilteredPackages[2][1] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 3' && pkg.LineStatus.toUpperCase() === STATUS_IN_PROGRESS.toUpperCase();
     });

     this.finalFilteredPackages[2][2] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 3' && pkg.LineStatus.toUpperCase() === STATUS_READY_FOR_PROCESS.toUpperCase();
     });

     this.finalFilteredPackages[2][3] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 3' && pkg.LineStatus.toUpperCase() === STATUS_SCHEDULED.toUpperCase();
     });

     this.finalFilteredPackages[2][4] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 3' && pkg.LineStatus.toUpperCase() === STATUS_WAREHOUSE_AND_QA.toUpperCase();
     });

     //line 4
     this.finalFilteredPackages[3][0] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 4' && pkg.LineStatus.toUpperCase() === STATUS_COMPLETED.toUpperCase();
     });

     this.finalFilteredPackages[3][1] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 4' && pkg.LineStatus.toUpperCase() === STATUS_IN_PROGRESS.toUpperCase();
     });

     this.finalFilteredPackages[3][2] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 4' && pkg.LineStatus.toUpperCase() === STATUS_READY_FOR_PROCESS.toUpperCase();
     });

     this.finalFilteredPackages[3][3] = this.packages.filter(pkg => {
       return pkg.PackagingLine === 'Line 4' && pkg.LineStatus.toUpperCase() === STATUS_COMPLETED.toUpperCase();
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
   }*/


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

  //get no of packages in a specific line
  getNumberOfPackagesPerLine(line: String): Number {
    return this.packages.filter(pkg => pkg.PackagingLine === line).length;
  }

  //get no of packages for a specific status
  getNumberOfPackagesPerStatus(status: String): Number {
    return this.packages.filter(pkg => pkg.LineStatus === status).length;
  }

  //get all packagingLines
  getAllPacakgingLines(screenId: Number) {
    this.packagingLineService.getAllPackagingLines(screenId)
      .subscribe(res => {

        this.packagingLines = res;
        this.minHeight = (window.innerHeight - 173) /this.packagingLines.length + 'px';
        this.minHeightscreenMode2 = (window.innerHeight - 116) /5 + 'px';
       if(this.packagingLines.length < 3){
        this.minwidth = (window.innerWidth - 350) /this.packagingLines.length+ 'px';
        this.center = "right";
       }else{
        this.center = "center";
        this.minwidth = (window.innerWidth - 240) /this.packagingLines.length+ 'px';
       }


        console.log(this.packagingLines.length);

        this.getPackagingLineInfo(this.screen.ScreenId, false);

      }, err => {
        console.log(err);
      });
  }
  // console.log(this.packages);

  //map packages for Line & Status
  filterPackagesForLineAndStatus(packagingLine: String, lineStatus: String,): Package[] {
    let returnArray = this.packages.filter(
      pkg => pkg.PackagingLine.toUpperCase() === packagingLine.toUpperCase() && pkg.LineStatus.toUpperCase() === lineStatus.toUpperCase()
    );
    
    if (returnArray.length > 2) {
      return returnArray.splice(1, 3);
    }
    return returnArray;

  }

  toggleScreen() {
    this.screenMode === 1 ? this.screenMode = 2 : this.screenMode = 1;
  }
}
