import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styles: []
})
export class SettingsComponent implements OnInit {
  user: any;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUser()
      .subscribe(res => {
        this.user = res;
      });
  }
}
