import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DBService } from '../../../services/db.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { PageEvent } from '@angular/material';
import * as Papa from 'papaparse';

import Handsontable from 'handsontable';
declare var tableau: any;

@Component({
    templateUrl: 'edit.component.html',
    styleUrls: ['edit.component.scss'],
})
export class EditComponent implements OnInit {
    loading: boolean = false;
    isEditMode: boolean = false;
    isAddMode: boolean = false;
    columns: Array<any> = [];
    tableName: string;
    tableId = 'addInstance';
    parsedRec: any[] = [];
    columnList: string[] = [];
    firstCellReadOnly: boolean = true;
    length: number;
    pageSize: number = 10;
    tableSettings: any = {
        licenseKey: 'non-commercial-and-evaluation',
        stretchH: 'all',
        colWidths: 100,
        colHeaders: true,
        afterChange: (hotInstance, changes, source) => {
            if (source === 'edit') {
                if (this.initialDataset[changes[0][0]]) {
                    if (
                        this.initialDataset[changes[0][0]][changes[0][1]] !==
                        changes[0][3]
                    ) {
                        let oldRow = this.initialDataset[changes[0][0]];
                        let modifiedCol = {tessellation_id: oldRow.tessellation_id};
                        modifiedCol[changes[0][1]] = changes[0][3];

                        this.modifiedRows.push({...modifiedCol});
                        const result = [];
                        const map = new Map();
                        for (const item of this.modifiedRows
                            .slice()
                            .reverse()) {
                            if (!map.has(item.tessellation_id)) {
                                map.set(item.tessellation_id, true); // set any value to Map
                                result.push(item);
                            }else{
                              result.forEach(ele => {
                                if(item.tessellation_id == item.tessellation_id){
                                  if(!Object.keys(ele).includes(Object.keys(item).filter(key => key != 'tessellation_id')[0])){
                                    Object.assign(ele, item)
                                  }
                                }
                              })
                            }
                        }
                        this.modifiedRows = result;
                    }
                }
            }
        },
        cells: (row, col) => {
            let cellProperties = {};
            if (row % 2 === 0) {
                cellProperties['renderer'] = this.rowRendererOne;
            } else {
                cellProperties['renderer'] = this.rowRendererTwo;
            }
            return cellProperties;
        },
    };
    @ViewChild('hot') hot: any;
    @ViewChild('paginator') paginator: any;
    spin:boolean = false;
    columnHeaders: any[] = [];
    hidePaginator: boolean = false;
    error: boolean = false;
    initialDataset: any[] = [];
    modifiedRows: any[] = [];
    truncateTable:boolean = false;
    dataset: any[] = [];

    constructor(
        private loc: Location,
        private dbService: DBService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private snackBar: MatSnackBar,
    ) {
        tableau.extensions.initializeAsync();
    }

    async ngOnInit() {
        this.truncateTable = false;

        this.tableName = this.activatedRoute.snapshot.paramMap.get('name');
        try {
            this.length = await this.dbService.getTableInfo(
                this.tableName,
            );
        } catch {
            this.error = true;
        }
        this.columns = this.dbService.getCurrentTableDef();
        this.columns.forEach(col=> this.columnList.push(col.name));
        this.resetTableColumns(this.columns);
    }

    resetTableColumns(columns) {
        this.columnHeaders = [];
        this.dataset = this.dbService.getCurrentTableData();
        this.initialDataset = JSON.parse(JSON.stringify(this.dataset));

        columns.forEach(column => {
            if (!['tessellation_id', 'tessellation_created_by', 'id'].includes(column['name'])) {
                // obj[column['name']] = '';
                this.columnHeaders.push({
                    data: column['name'],
                    title: `<div class='column-header'>${column['name']}`,
                });
            }
        });
        this.hot.hotInstance.render();
        this.paginator._pageIndex = 0;
    }

    addEmptyRow() {
        if (!this.hot.hotInstance.countEmptyRows()) {
            this.hot.hotInstance.alter('insert_row', 11, 1);
        } else {
            this.snackBar.open(
                'Multiple empty rows are not allowed',
                'Dismiss',
            );
        }
    }

    enableEditMode() {
        this.hot.hotInstance.selectCell(0, 0);
        this.hot.hotInstance.getActiveEditor().beginEditing();
        this.hot.hotInstance
            .getActiveEditor()
            .setValue(this.hot.hotInstance.getActiveEditor().originalValue);
        this.hot.hotInstance.getActiveEditor().enableFullEditMode();
    }

    async pageChange(pageEvent: PageEvent){
      this.modifiedRows = [];
      this.spin = true;
      this.hot.hotInstance.updateSettings({
        readOnly: true, // make table cells read-only
        contextMenu: false, // disable context menu to change things
        disableVisualSelection: true, // prevent user from visually selecting
        manualColumnResize: false, // prevent dragging to resize columns
        manualRowResize: false, // prevent dragging to resize rows
        comments: false, // prevent editing of comments
      });
      this.length = await this.dbService.getTableInfo(
          this.tableName, this.pageSize, pageEvent.pageIndex
      )
      this.dataset = this.dbService.getCurrentTableData();
      this.initialDataset = JSON.parse(JSON.stringify(this.dataset));
      this.hot.hotInstance.updateSettings({
        readOnly: false, // make table cells read-only
        contextMenu: true, // disable context menu to change things
        disableVisualSelection: false, // prevent user from visually selecting
        manualColumnResize: true, // prevent dragging to resize columns
        manualRowResize: true, // prevent dragging to resize rows
        comments: true, // prevent editing of comments
      });
      this.spin = false;
    }
  
    selectFiles(event, ele) {
      const files = event.target.files
      const { type } = files[0]
      if(type != 'text/csv'){
        ele.value = null;
        this.snackBar.open('Invalid file type', 'Dismiss');
      }else{
        Papa.parse(files[0],
          {
            delimiter: ',',
            header: true,
            step: (results, parser)=> {
              if(!results.errors.length && Object.keys(results.data[0]).every(item=> this.columnList.includes(item))){
                this.parsedRec.push(results.data[0])
              }
            },
            complete: (results, file)=> {
              if(this.parsedRec.length){
                this.dataset = JSON.parse(JSON.stringify(this.parsedRec));
                this.truncateTable = true;
                this.parsedRec = [];
                this.hidePaginator = true;
                this.snackBar.open('File parsing completed', 'Dismiss');
              }else{
                this.snackBar.open('File does not contain valid data', 'Dismiss');
              }
            }
          }
        )
      }
  }

    submit() {
      this.loading = true;
        const data = this.hot.hotInstance.getSourceData();
        const columnHeaders = Object.keys(this.dataset[0]);
        let gg = [];
        data.forEach((item, index) => {
            let emptyRow = this.hot.hotInstance.isEmptyRow(index);
            if (!item.id && !emptyRow) {
                gg.push(item)
            }
        });

        let observableRequest = [
            ...(gg.length ? [this.dbService.addEntries({ rows: gg, truncate: this.truncateTable })] : []),
            ...(this.modifiedRows.length
                ? [this.dbService.updateEntries({ rows: this.modifiedRows })]
                : []),
        ];

        if (observableRequest.length) {
            forkJoin(observableRequest).subscribe(
                async ([create, update]) => {
                    if (create || update) {
                        const sOrNoS = gg.length > 1 ? 's have' : ' has';
                        const message = `${
                            gg.length
                        } record${sOrNoS} been successfully added`;
                        this.snackBar
                            .open(message, 'Dismiss', { duration: 1000 })
                            .afterDismissed()
                            .subscribe(() => {
                                const sOrNoS =
                                    this.modifiedRows.length > 1
                                        ? 's have'
                                        : ' has';
                                const message = `${
                                    this.modifiedRows.length
                                } record${sOrNoS} been successfully updated`;
                                this.snackBar.open(message, 'Dismiss', {
                                    duration: 1000,
                                });
                                this.modifiedRows = [];
                                this.hidePaginator = false;
                            });
                        this.ngOnInit();
                        const datasources = await tableau.extensions.dashboardContent.dashboard.worksheets[0].getDataSourcesAsync();
                        datasources[0].refreshAsync();
                        this.loading = false;
                    }
                },
                async (err) => {
                  this.snackBar
                      .open(err.error.data.message, 'Dismiss', { duration: 2500 });
                  this.ngOnInit();
                  const datasources = await tableau.extensions.dashboardContent.dashboard.worksheets[0].getDataSourcesAsync();
                  datasources[0].refreshAsync();
                  this.loading = false;
                },
            );
        }
    }

    back() {
        this.loc.back();
    }

    rowRendererOne(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.style.color = '#8F8F8F';
        td.style.background = 'white';
    }

    rowRendererTwo(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.style.color = '#8F8F8F';
        td.style.background = '#DCDCDC';
    }
}
