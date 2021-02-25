import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'smart-app';

  transactions: any[] = [];
  filteredTransactions: any[] = [];
  balance:number = 0;
  months = [
    {
      label:'Last 1 month',
      value: 0
    },
    {
      label:'Last 2 months',
      value: 1
    },
    {
      label:'Last 3 months',
      value: 2
    },
    {
      label:'Last 4 months',
      value: 3
    },
    {
      label:'Last 5 months',
      value: 4
    },
    {
      label:'Last 6 months',
      value: 5
    }
  ]

  frequency: string[] = [
    'Current',
    'Monthly'
  ]

  categories: string[] = [
    'Medical',
    'Travel',
    'Loans',
    'Educations',
    'Utility Bills',
    'Misc'
  ];

  transactionType: any[] = [
    {
      label:'Make Payment',
      value: 'debit'
    },
    {
      label:'Receive Payment',
      value: 'credit'
    },

  ]

  myForm: FormGroup;
  category: FormControl;
  paymentType: FormControl;
  date:FormControl;
  amount: FormControl;
  description: FormControl;
  searchField: FormControl;
  categoryField: FormControl;
  month: FormControl;

  createFormControls(){
    this.searchField = new FormControl();
    this.categoryField = new FormControl();
    this.month = new FormControl();

    this.category = new FormControl('');
    this.paymentType = new FormControl('',Validators.required);
    this.date = new FormControl('',Validators.required);
    this.amount = new FormControl('', [Validators.required,Validators.pattern(/^[0-9]+$/)]);
    this.description = new FormControl('', Validators.required);

  }

  createForm(){
    this.myForm = new FormGroup({
      category : this.category ,
      paymentType: this.paymentType,
      date: this.date,
      amount: this.amount,
      description: this.description,
    })
  }

  ngOnInit()  {
    this.createFormControls();
    this.createForm();
  }

  haveSufficientBalance(amt):boolean{

   if(amt > this.balance){
     return false;
   }else{
     return true;
   }
  }

  onSubmit(){
    if(this.myForm.status === 'VALID'){

      if(this.myForm.value.paymentType === 'debit'){
        if(!this.haveSufficientBalance(this.myForm.value.amount)){
          alert('Insufficient balance....');
          return;
        }
        this.balance = this.balance - +this.myForm.value.amount ;
      } else{
        this.balance = this.balance + +this.myForm.value.amount ;
      }


       let tran = {
        trxn: 'Trxn-' + this.transactions.length + 1,
        amount : this.myForm.value.amount,
        paymentType: this.myForm.value.paymentType,
        date: this.myForm.value.date,
        category: this.myForm.value.category,
        description: this.myForm.value.description,
       };

      this.transactions.push(tran);

    }
    this.myForm.reset();
    console.log(this.balance);
  }

  paymentTypeChange(){

    this.paymentType.value == 'credit' ? this.category.disable() : this.category.enable();
  }

  resetCategory(){
    if(this.categoryField.value !== null){
      this.categoryField.setValue('');
    }

  }

  frequencyChange(){

    this.resetCategory()

    let searchType = this.searchField.value;

    if(searchType === 'Current'){
      this.month.reset();
      this.month.disable();
      this.filterByCurrent();
    } else {
      this.filteredTransactions = [];
      this.month.enable();
    }
  }

  sortBydate(a,b){

  }

  sortByEntrydate(){
    this.filteredTransactions.sort((a,b) => {
      let date1 = new Date(a.date);
      let date2 = new Date(b.date);
      if(date1 < date2){
        return 0;
      }else{
        return 1;
      }
    });
    //this.filteredTransactions.reverse();
  }

  filterByCurrent(){
    if(this.transactions.length > 10){
      this.filteredTransactions = this.transactions.slice(-10);
      this.sortByEntrydate();

    }
    else{
      this.filteredTransactions = this.transactions.slice();
      this.sortByEntrydate();
    }
    if(this.categoryField.value !== '' && this.categoryField.value !=null){
      this.filterBycategory();
    }
  }

  categoryChange(){

    if(this.searchField.value == 'Current'){
      //this.frequencyChange();
      this.filterByCurrent();
    } else{
      //this.monthChange();
      this.filterByMonths();
    }

    this.filterBycategory();
  }

  filterBycategory(){
    if(this.filteredTransactions.length > 0){
      this.filteredTransactions = this.filteredTransactions.filter((item) => {
        return item.category === this.categoryField.value
      })
    }
  }

  filterByMonths(){
    this.searchField.setValue(this.frequency[1]);

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth() - this.month.value, 1);

    //let lastDay = new Date(date.getFullYear(), date.getMonth() - this.month.value + 1, 0);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    if(this.transactions.length){
       this.filteredTransactions = this.transactions.filter((item) => {
           let tranDate = new Date(item.date);
           return tranDate >= firstDay && tranDate <= lastDay ;
       })
       this.sortByEntrydate();
    }

    if(this.categoryField.value !== '' && this.categoryField.value !=null){
      this.filterBycategory();
    }
  }

  monthChange(){
    this.resetCategory();
    this.filterByMonths();

  }

}
