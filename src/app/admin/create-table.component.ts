import { Component, Input, HostListener, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DBService } from '../services/db.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
    templateUrl: 'create-table.component.html',
    styleUrls: ['create-table.component.scss'],
})
export class CreateTables implements OnInit {
  @ViewChildren('input') els:QueryList<any>;
  showDropdownContent:any = {0: false};
  tableForm: FormGroup;
  loading:boolean = false;
  displayInput:any = {0: true};
  columns: any = this.tableForm.get('columns');
  get formArray() { return <FormArray>this.tableForm.get('columns'); }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    this.showDropdownContent = {0: false};
  }

  constructor(
      private authService: AuthService,
      private db: DBService,
      private snackBar: MatSnackBar
  ) {
      this.tableForm = new FormGroup({
          name: new FormControl('', Validators.required),
          columns: new FormArray([
            new FormGroup({
              name: new FormControl('', Validators.required),
              type: new FormControl('', Validators.required)
            })
          ])
      });
  }

  toggleDropdown(event, index){
    this.showDropdownContent[index] = !this.showDropdownContent[index];
    event.stopPropagation();
  }

  ngOnInit(){
    // console.log(this.tableForm.get('columns'), 'sss')
  }

  showInput(input, index){
    this.displayInput[index]=false;
    setTimeout(
      ()=>{this.els.toArray()[index].nativeElement.focus()},45
    )
  }

  deleteRow(index){
    this.formArray.removeAt(index)
  }

  addRow(){
    this.formArray.push(
      new FormGroup({
        name: new FormControl('', Validators.required),
        type: new FormControl('', Validators.required)
      })
    )
  }
  createTable(){
    this.loading = true
    if(this.tableForm.valid){
      let values = this.tableForm.getRawValue()
      this.db.createTables(values).subscribe(
        (result)=>{
          this.snackBar.open(
            `Table ${values.name} created successfully`,
            'Close'
          )
          this.tableForm.reset();
          this.loading = false;
        },
        (error)=>{
          this.snackBar.open(
            `Transaction failed`,
            'Close'
          )
          this.loading = false
          console.log(error)
        }
      )
    }else{
      this.snackBar.open(
        'Invalid form! All fields are required',
        'Close'
      )
      this.loading = false
    }
  }

  setDataTypeValue(index, val){
    this.formArray.at(index).get('type').setValue(val)
  }
}
