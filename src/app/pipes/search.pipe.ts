import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipe implements PipeTransform {

  transform(users: any[], search: string, myId:string): any[] {
    if ( search.length === 0 ){return users}
    search = search.toString().toLowerCase();
    return users.filter(filteredUser => {
      if(filteredUser.user1._id == myId){
        return filteredUser.user2.name.toString().toLowerCase().includes(search);
      }
      if(filteredUser.user2._id == myId){
        return filteredUser.user1.name.toString().toLowerCase().includes(search);
      }
      
    });

  }

}
