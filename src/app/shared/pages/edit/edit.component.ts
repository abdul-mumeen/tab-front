import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DBService } from '../../../services/db.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material';

import * as Handsontable from 'handsontable';
declare var tableau: any;

@Component({
    templateUrl: 'edit.component.html',
    styleUrls: ['edit.component.scss'],
})
export class EditComponent implements OnInit {
    loading: boolean = false;
    isEditMode: boolean = false;
    isAddMode: boolean = false;
    columns: Array<{}> = [];
    tableName: string;
    tableId = 'addInstance';
    firstCellReadOnly: boolean = true;
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
                        let modifiedCol = {};
                        modifiedCol[changes[0][1]] = changes[0][3];

                        this.modifiedRows.push({
                            old: oldRow,
                            new: modifiedCol,
                        });
                        const result = [];
                        const map = new Map();
                        for (const item of this.modifiedRows
                            .slice()
                            .reverse()) {
                            if (!map.has(item.old.id)) {
                                map.set(item.old.id, true); // set any value to Map
                                result.push(item);
                            }
                        }
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
        this.columnHeaders = [];
        this.dataset = this.dbService.getCurrentTableData();
        this.initialDataset = JSON.parse(JSON.stringify(this.dataset));

        columns.forEach(column => {
            if (column['name'] !== 'id') {
                // obj[column['name']] = '';
                this.columnHeaders.push({
                    data: column['name'],
                    title: `<div class='column-header'>${column['name']}`,
                });
            }
        });
        this.hot.hotInstance.render();
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

    submit() {
        const data = this.hot.hotInstance.getSourceData();
        const columnHeaders = Object.keys(this.dataset[0]);
        let gg = [];
        data.forEach((item, index) => {
            let emptyRow = this.hot.hotInstance.isEmptyRow(index);
            let row = [];
            if (!item.id && !emptyRow) {
                columnHeaders.forEach(columnName => {
                    if (columnName !== 'id') {
                        let col = {};
                        col['columnName'] = columnName;
                        col['value'] = item[columnName];
                        row.push(col);
                    }
                });
                gg.push(row);
            }
        });

        let observableRequest = [
            ...(gg.length ? [this.dbService.addEntries({ rows: gg })] : []),
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
                            });
                        this.ngOnInit();
                        const datasources = await tableau.extensions.dashboardContent.dashboard.worksheets[0].getDataSourcesAsync();
                        datasources[0].refreshAsync();
                    }
                },
                ([createError, updateError]) => {
                    if (createError || updateError) {
                        const message = 'Error adding record(s)';
                        this.snackBar
                            .open(createError, 'Dismiss', { duration: 2500 })
                            .afterDismissed()
                            .subscribe(() => {
                                if (updateError) {
                                    const message = 'Error updating record(s)';
                                    this.snackBar.open(updateError, 'Dismiss', {
                                        duration: 2500,
                                    });
                                }
                            });
                    }
                },
            );
        }
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

    rowRendererOne(instance, td, row, col, prop, value, cellProperties) {
        // Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.style.color = '#8F8F8F';
        td.style.background = 'white';
    }

    rowRendererTwo(instance, td, row, col, prop, value, cellProperties) {
        // Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.style.color = '#8F8F8F';
        td.style.background = '#DCDCDC';
    }
}
