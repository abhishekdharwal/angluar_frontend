import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { Task } from "./tasks/task.model";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "TODO_MEAN";
  tasks: Task[] = [];
  onTaskAdd(task: Task) {
    this.tasks.push(task);
  }
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
