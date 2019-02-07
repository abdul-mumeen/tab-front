import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    styleUrls: ['form.component.scss'],
    templateUrl: 'form.component.html',
})
export class FormComponent implements OnInit {
    form: FormGroup;

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required]),
            age: new FormControl('', [Validators.required]),
            favoriteAnimal: new FormControl(),
        })
    }

    onSave() {
        console.log(this.form.value);
        this.http.post('/api/record', this.form.value)
            .subscribe((res) => {
                console.log(res);
            })
    }
}
