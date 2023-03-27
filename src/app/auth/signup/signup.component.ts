import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthData } from "../auth-data.model";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService) {}
  ngOnInit(): void {}

  onsignup(form: NgForm) {
    // console.log(form);
    if (form.invalid) return;
    this.isLoading = true;
    const auth: AuthData = {
      email: form.value.email,
      password: form.value.email,
    };
    this.authService.createUser(auth);
  }
}
