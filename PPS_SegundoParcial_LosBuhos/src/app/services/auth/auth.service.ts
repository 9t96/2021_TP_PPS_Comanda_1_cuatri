import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { Usuario } from 'src/app/clases/usuario';
import { firebaseUser } from 'src/app/interfaces/firebaseUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<firebaseUser>;
  public loggedUser: firebaseUser;
  public dbRef: AngularFirestoreCollection<Usuario>

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.user$ = this.ngFireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afStore.doc(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
    this.dbRef = this.afStore.collection("users");
    console.log(this.user$)
  }

  // Login in with email/password
  SignIn(email, password) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  CreaterUser(email:string,password:string){
    return this.ngFireAuth.createUserWithEmailAndPassword(email,password);
  }
  

  // Recover password
  PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert(
          "Password reset email has been sent, please check your inbox."
        );
      })
      .catch(error => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // Sign-out
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem("user");
    });
  } 

  getCurrentUser(): Usuario{
    let user = JSON.parse(localStorage.getItem("userData"));
    return user;
  }
}
