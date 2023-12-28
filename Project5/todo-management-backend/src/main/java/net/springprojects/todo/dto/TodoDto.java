package net.springprojects.todo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Dto means "data transfer object", it's used to transfer the data between client and server.
// While Todo entity is used to deal with the database.

// We shouldn't use the same object to connect with database and clients at the same time, for example,
// the entity with database may contain sensitive information like passwords or codes.
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TodoDto {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
}
