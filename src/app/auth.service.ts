import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  userData?: firebase.User;
  login: boolean=false;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
  ) {
    this.login=false;
    this.afAuth.authState.subscribe(user => {
      if (user) { 
        this.userData =user;
        console.log('here is your user data');
        localStorage.setItem('user', JSON.stringify(user?.displayName));
        JSON.parse(localStorage.getItem('user')!);
        console.log(user);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    }); 
  }
  isLogged() {
    if(JSON.parse(localStorage.getItem('user')!)!=null){
      this.login = true;
    }
    return this.login;

  }
  GoogleAuth() : any {

    return this.afAuth.signInWithPopup(new GoogleAuthProvider())
      .then((result) => {
        const user = result.user;
        localStorage.setItem('user', JSON.stringify(user?.displayName))
        return JSON.stringify(user?.displayName);      
      
      }).catch((error) => {
        window.alert(error);
      
      }
      )
  };
  NonGoogleAuth(){
    const auth = getAuth();
    localStorage.setItem('user', 'null');
    JSON.parse(localStorage.getItem('user')!);

  }
  
}
