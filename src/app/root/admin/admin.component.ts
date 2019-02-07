import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TableauService } from '../../shared/tableau/services/tableau.service';

interface Field {
    name?: string;
    type?: string;

}

@Component({
    styleUrls: ['admin.component.scss'],
    templateUrl: 'admin.component.html',
})
export class AdminComponent implements OnInit {
    fields: Field[] = [];
    tableName: string = '';
    dataTypes = [
        'INT',
        'FLOAT',
        'DATE',
        'DATETIME',
        'VARCHAR',
        'TEXT',
    ];

    constructor(
        private http: HttpClient,
        private tabService: TableauService,
    ) {
    }

    ngOnInit() {
        this.addField();
    }

    submit() {
        let haveAllFields = true;
        let fields = this.fields.map((field) => {
            if(!field.name || !field.type) haveAllFields = false;

            return { ...field, name: this.sqlStringCleaner(field.name) }
        });

        if(!this.tableName) haveAllFields = false;

        if(!haveAllFields) {
            return alert('Your missing something');
        } else {
            let body = {
                tableName: this.sqlStringCleaner(this.tableName),
                fields: fields
            };
            this.http.post('/api/table', body)
                .subscribe((res) => {
                    console.log(res);
                })
        }
    }

    refresh() {
        this.tabService.refreshDataSources();
    }

    sqlStringCleaner(str) {
        return str.replace(/&/gi, '')
            .replace(/[“”"']/gi, '')
            .replace(/[-:/]/gi, ' ')
            .replace(/[\[\]]/gi, ' ')
            .replace(/\s+/gi, '_')
            .toLowerCase();
    }

    addField() {
        this.fields.push({});
    }

    removeField(index: number) {
        this.fields.splice(index, 1);
    }
}
