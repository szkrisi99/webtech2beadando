import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;


  constructor(private Router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  onLoginSubmit(){
    const user = {
      username: this.username,
      password: this.password
    }

    this.authService.authenticateUser(user).subscribe(data => {
      //console.log(data);
      if(data.success){
        this.authService.storeUserData(data.token,data.user);
        this.Router.navigate(['item-list']);
        //console.log("jeeeeeeeeee")
        } else {
          //console.log("nem jó");
        }
    });
  }

}
