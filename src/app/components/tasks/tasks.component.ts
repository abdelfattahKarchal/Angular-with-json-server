import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  searchText = '';
  showForm = false;
  editForm = false;
  tasks: Task[] = [];
  tasksResult: Task[] = [];
  myTask: Task = {
    label : '',
    completed: false
  }
  constructor(private taskService: TaskService) { }

  //  chargement de component
  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(){
    //findAll return un objet observabl. Pour communiquer avec
    // cet objet il faut qu on fait une inscription avec ce dernier avec (subscribe)
    this.taskService.findAll().subscribe(tasks=> this.tasksResult= this.tasks = tasks)
  }
  deleteTask(id){
    this.taskService.delete(id)
    .subscribe(()=>{
      this.tasks = this.tasks.filter(task => task.id != id)
    });
  }

  persistTask(){
    this.taskService.persist(this.myTask)
    .subscribe((task) => {
      this.tasks = [task, ...this.tasks]
      this.resetTask();
      this.showForm =false
    });
  }

  resetTask(){
    this.myTask ={
      label :'',
      completed : false
    }
  }

  toggleCompleted(task){
    this.taskService.completed(task.id,task.completed)
    .subscribe(() => {
      task.completed = !task.completed
    })
  }

  editTask(task){
    this.myTask = task;
    this.editForm = true;
  }
  updateTask(){
    this.taskService.update(this.myTask)
    .subscribe((task)=>{
      this.resetTask();
      this.editForm = false;
    })
  }

  searchTasks(){
    this.tasksResult = this.tasks.filter((task)=> task.label.toLowerCase().includes(this.searchText.toLowerCase())
    )
  }

}
