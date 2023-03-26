import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Task } from '../../task.model';
import { TasksService } from '../../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  // tasks = [
  //   { title: 'code for anuglar', description: 'mdule' },
  //   { title: 'code for anuglar', description: 'mdule' },
  // ];
  storedTasks: Task[] = [];
  private tasksSub: Subscription;
  isLoading = false;
  constructor(public tasksService: TasksService) {}

  // tasks = [];
  enteredTitle = '';
  pageIndex = 0;
  totalTasks = 0;
  pageSize = 10;
  pageSizeOptions = [1, 5, 10, 100];
  ngOnInit() {
    this.tasksService.getTask(this.pageSize, 0);
    this.isLoading = true;
    this.tasksSub = this.tasksService
      .getTaskUpdateListener()
      .subscribe((taskData: any) => {
        this.storedTasks = taskData.tasks;
        this.isLoading = false;
        this.totalTasks = taskData.totalCount;
      });
  }
  ngOnDestroy() {
    this.tasksSub.unsubscribe();
  }
  onChangePage(event: PageEvent) {
    console.log(event);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.tasksService.getTask(this.pageSize, this.pageIndex);
  }

  onDelete(id: string) {
    this.tasksService.deleteTask(id).subscribe((res) => {
      this.tasksService.getTask(this.pageSize, 0);
    });
  }
}
