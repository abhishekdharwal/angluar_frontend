import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthData } from "../auth-data.model";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService) {}
  ngOnInit(): void {}
  onLogin(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    const auth: AuthData = {
      email: form.value.email,
      password: form.value.email,
    };
    this.authService.loginUser(auth);
  }
}
