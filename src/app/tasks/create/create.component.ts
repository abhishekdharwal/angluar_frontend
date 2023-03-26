import { Component, OnInit } from '@angular/core';
import { Task } from '../task.model';
import {
  Form,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { TasksService } from '../task.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { fileTypeValidator } from './image-type.validator';

@Component({
  selector: 'app-task-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateTaskComponent implements OnInit {
  newTask = 'abhi';
  enteredValue = 'Hey';
  enteredTitle = ' ';
  enteredDescription = '';
  public mode = 'create';
  private id: string = null;
  public task: Task;
  isLoading = false;
  taskForm: FormGroup;
  imagePreview = null;
  constructor(
    public tasksService: TasksService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.taskForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)],
      }),
      description: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.route.paramMap.subscribe((res: ParamMap) => {
      if (res.has('id')) {
        this.mode = 'edit';
        this.id = res.get('id');
        this.isLoading = true;
        this.tasksService.getTasks(this.id).subscribe((res: any) => {
          delete res.data.__v;
          this.task = res.data;
          this.isLoading = false;
          this.taskForm.setValue({
            title: this.task.title,
            description: this.task.description,
            image: this.task.imagePath,
          });
        });
      } else {
        this.taskForm = new FormGroup({
          title: new FormControl(null, {
            validators: [Validators.required, Validators.minLength(5)],
          }),
          description: new FormControl(null, {
            validators: [Validators.required],
          }),
          image: new FormControl(null, {
            validators: [Validators.required, fileTypeValidator],
          }),
        });
        this.mode = 'create';
        this.id = null;
      }
    });
  }
  onCreateTask() {
    if (!this.taskForm.valid) return;
    const task: Task = {
      _id: null,
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      imagePath: this.taskForm.value.image,
    };
    if (this.mode === 'create') {
      this.tasksService.addTask(task, this.taskForm.value.image);
    }
    if (this.mode === 'edit') {
      task._id = this.task._id;
      this.tasksService.updateTask(task);
    }
    this.taskForm.reset();
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.taskForm.patchValue({ image: file });
    this.taskForm.get('image').updateValueAndValidity();
    this.imageToDataUrl(file);
    console.log(this.taskForm, file);
  }
  imageToDataUrl(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      this.imagePreview = reader.result;
      console.log(this.imagePreview);
    };
    reader.readAsDataURL(file);
  }
}
