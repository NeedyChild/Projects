package net.springprojects.todo.service.impl;

import lombok.AllArgsConstructor;
import net.springprojects.todo.dto.TodoDto;
import net.springprojects.todo.entity.Todo;
import net.springprojects.todo.exception.ResourceNotFoundException;
import net.springprojects.todo.repository.TodoRepository;
import net.springprojects.todo.service.TodoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TodoServiceImpl implements TodoService {

    private TodoRepository todoRepository;
    @Override
    public TodoDto addTodo(TodoDto todoDto) {

        // convert TodoDto into Todo Jpa entity
        Todo todo = new Todo();
        todo.setTitle(todoDto.getTitle());
        todo.setDescription(todoDto.getDescription());
        todo.setCompleted(todoDto.isCompleted());

        // save the Todo Jpa entity in the database
        Todo savedTodo = todoRepository.save(todo);

        // convert saved Todo Jpa entity into TodoDto and send this TodoDto back to clients

        TodoDto savedTodoDto = new TodoDto();
        savedTodoDto.setId(savedTodo.getId());
        savedTodoDto.setTitle(savedTodo.getTitle());
        savedTodoDto.setDescription(savedTodo.getDescription());
        savedTodoDto.setCompleted(savedTodo.isCompleted());

        return savedTodoDto;
    }

    @Override
    public TodoDto getTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

//        TodoDto todoDto = new TodoDto();
//        todoDto.setId(todo.getId());
//        todoDto.setCompleted(todo.isCompleted());
//        todoDto.setDescription(todo.getDescription());
//        todoDto.setTitle(todo.getTitle());

        return this.todoDtoMapper(todo);
    }

    @Override
    public List<TodoDto> getAllTodos() {
        List<Todo> todos = todoRepository.findAll();

        return todos.stream().map((todo) -> this.todoDtoMapper(todo)).collect(Collectors.toList());
    }

    @Override
    public TodoDto updateTodo(TodoDto todoDto, Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        todo.setTitle(todoDto.getTitle());
        todo.setDescription(todoDto.getDescription());
        todo.setCompleted(todoDto.isCompleted());

        Todo savedTodo = todoRepository.save(todo);

        return this.todoDtoMapper(savedTodo);
    }

    @Override
    public void deleteTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        todoRepository.deleteById(id);
    }

    @Override
    public TodoDto completeTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        todo.setCompleted(Boolean.TRUE);

        Todo savedTodo = todoRepository.save(todo);

        return this.todoDtoMapper(savedTodo);
    }

    @Override
    public TodoDto notCompleteTodo(Long id) {

        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        todo.setCompleted(Boolean.FALSE);

        Todo savedTodo = todoRepository.save(todo);

        return this.todoDtoMapper(savedTodo);
    }

    private TodoDto todoDtoMapper(Todo todo) {
        TodoDto todoDto = new TodoDto();
        todoDto.setId(todo.getId());
        todoDto.setCompleted(todo.isCompleted());
        todoDto.setDescription(todo.getDescription());
        todoDto.setTitle(todo.getTitle());

        return todoDto;
    }
}
