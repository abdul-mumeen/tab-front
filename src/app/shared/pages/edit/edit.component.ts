import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DBService } from '../../../services/db.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material';

import * as Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable-pro/angular';

declare var tableau: any;

@Component({
    templateUrl: 'edit.component.html',
    styleUrls: ['edit.component.scss'],
})
export class EditComponent implements OnInit {
    loading: boolean = false;
    columns: Array<{}> = [];
    tableName: string;
    tableId = 'addInstance';
    firstCellReadOnly: boolean = true;
    tableSettings: Handsontable.GridSettings = {
        stretchH: "all",
        colWidths: 100,
        colHeaders: true,
        afterChange: (hot, changes, source) => {
          if(source == "edit") {
            if(this.initialDataset[changes[0][0]]){
              if(this.initialDataset[changes[0][0]][changes[0][1]] != changes[0][3]){
                let oldRow = this.initialDataset[changes[0][0]];
                let modifiedCol = {};
                modifiedCol[changes[0][1]] = changes[0][3];
                
                this.modifiedRows.push({old: oldRow, new: modifiedCol});
                const result = [];
                const map = new Map();
                for (const item of this.modifiedRows.slice().reverse()) {
                  if(!map.has(item.old.id)){
                    map.set(item.old.id, true);    // set any value to Map
                    result.push(item);
                  }
                }
                this.modifiedRows = result;
              }
            }
          }
        }
    };
    @ViewChild('hot') hot: any;
    columnHeaders: any[] = [];
    tableMetadata: any;
    error: boolean = false;
    initialDataset: any[] = [];
    newRows: any[] = [];
    modifiedRows: any[] = [];
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
        this.tableName = this.activatedRoute.snapshot.paramMap.get('name');
        try {
            this.tableMetadata = await this.dbService.getTableInfo(
                this.tableName,
            );
        } catch {
            this.error = true;
        }
        this.columns = this.dbService.getCurrentTableDef();
        this.resetTableColumns(this.columns);
    }

    resetTableColumns(columns) {
        this.dataset = this.dbService.getCurrentTableData();
        this.initialDataset = JSON.parse(JSON.stringify(this.dataset));

        columns.forEach(column => {
            if (column['name'] !== 'id') {
                // obj[column['name']] = '';
                this.columnHeaders.push({
                    data: column['name'],
                    title: column['name'],
                });
            }
        });
    }

    addEmptyRow(){
      if(!this.hot.hotInstance.countEmptyRows()){
        this.hot.hotInstance.alter('insert_row', 11, 1)
      } else {
        this.snackBar.open('Multiple empty rows are not allowed', 'Dismiss');
      }
    }

    enableEditMode(){
      this.hot.hotInstance.selectCell(0, 0);
      this.hot.hotInstance.getActiveEditor().beginEditing();
      this.hot.hotInstance.getActiveEditor().setValue(this.hot.hotInstance.getActiveEditor().originalValue);
      this.hot.hotInstance.getActiveEditor().enableFullEditMode();
    }

    submit() {
      const data = this.hot.hotInstance.getSourceData();
      const columnHeaders = Object.keys(this.dataset[0]);
      let gg = [];
      data.forEach((item, index) => {
        let emptyRow = this.hot.hotInstance.isEmptyRow(index)
        let row = [];
        if (!item.id && !emptyRow) {
          columnHeaders.forEach(columnName => {
            if(columnName != 'id'){
              let col = {};
              col['columnName'] = columnName;
              col['value'] = item[columnName];
              row.push(col);
            }
          })
          gg.push(row);
        }
      });

      forkJoin(
        this.dbService.addEntries({rows: gg}),
        this.dbService.updateEntries({rows: this.modifiedRows})
      ).subscribe(async([create, update])=> {
        debugger;
        if(create){
          const sOrNoS = this.modifiedRows.length > 1 ? 's have' : ' has';
          const message = `${
              gg.length
          } record${sOrNoS} been successfully added`;
          this.snackBar.open(message, 'Dismiss');
        }
        if(update){
          const sOrNoS = gg.length > 1 ? 's have' : ' has';
          const message = `${
              gg.length
          } record${sOrNoS} been successfully updated`;
          this.snackBar.open(message, 'Dismiss');
        }
        this.resetTableColumns(this.columns);
        const datasources = await tableau.extensions.dashboardContent.dashboard.worksheets[0].getDataSourcesAsync();
        datasources[0].refreshAsync();
      }, ([createError, updateError]) =>{
        debugger;
        if(createError){
          const message = 'Error adding record(s)';
          this.snackBar.open(createError, 'Dismiss');
        }
        if(updateError){
          const message = 'Error updating record(s)';
          this.snackBar.open(updateError, 'Dismiss');
        }
      })
    }

    async logout() {
        this.loading = true;
        try {
            await this.authService.logout();
            this.router.navigate(['/landing']);
        } catch {
        } finally {
            this.loading = false;
        }
    }

    back() {
        this.loc.back();
    }
}
