import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-type',
  templateUrl: './account-type.page.html',
  styleUrls: ['./account-type.page.scss'],
})
export class AccountTypePage implements OnInit {
  credentials
  constructor(private router: Router) { }

  ngOnInit() {
    this.credentials = new FormGroup({

      account: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  get account(){return this.credentials.get('account')}

  accountType(){
    if (this.credentials.value.account == 'personal') {
      this.router.navigateByUrl('/signup')
    }

    if (this.credentials.value.account == 'business') {
      this.router.navigateByUrl('/signup2')
    }
  }

}
