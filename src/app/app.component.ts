import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Todo } from './todo'
import { TodoService } from './todo.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  todos: Todo[] = []
  form: FormGroup = new FormGroup({
    description: new FormControl('',[Validators.required, Validators.minLength(4)])
  })

  constructor(
    private service: TodoService
  ) {
  }

  ngOnInit() {
    this.listarToDos()
  }

  listarToDos() {
    this.service.listar().subscribe(todoList => {
      console.log(todoList)
      this.todos = todoList
    })

  }

  submit() {
    const todo: Todo = { ...this.form.value }
    this.service
      .salvar(todo)
      .subscribe(savedTodo => {
        this.todos.push(savedTodo)
        this.form.reset();
      })
  }

  delete(todo: Todo) {
    this.service.deletar(todo.id).subscribe({
      next: (response) => this.listarToDos()

    })
  }

  done(todo: Todo){
    this.service.marcarComoConluido(todo.id).subscribe({
      next: (todoAtualizado) => {
        todo.done = todoAtualizado.done
        todo.doneDate = todoAtualizado.doneDate
      }
    })
  }
}
