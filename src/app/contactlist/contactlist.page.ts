import { Component, OnInit } from '@angular/core';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.page.html',
  styleUrls: ['./contactlist.page.scss'],
})
export class ContactlistPage implements OnInit {
  names : any
  phones  :any
  emails : any
  constructor(private contact: Contacts) {
    this.findContacts()
   }

  ngOnInit() {
  }
  cont(){
    this.names = Contact.name
    alert(this.names)
  }
  findContacts = () => {
    this.contact.find(['id', 'displayName', 'name', 'phoneNumbers', 'emails'], {filter: "", multiple: true})
      .then(data => {
        this.names = data;
        //alert(JSON.stringify(data))
      });
  }
}
