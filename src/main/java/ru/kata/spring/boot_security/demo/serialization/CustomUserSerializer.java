package ru.kata.spring.boot_security.demo.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import ru.kata.spring.boot_security.demo.entity.Role;
import ru.kata.spring.boot_security.demo.entity.User;

import java.io.IOException;

public class CustomUserSerializer extends StdSerializer<User> {

    public CustomUserSerializer() {
        super(User.class);
    }

    @Override
    public void serialize(User user, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {

        jsonGenerator.writeStartObject();
        // Вы можете добавить дополнительную логику, например, скрыть некоторые данные или изменить формат.
        jsonGenerator.writeNumberField("id", user.getId());
        jsonGenerator.writeStringField("name", user.getName());
        jsonGenerator.writeStringField("lastname", user.getLastname());
        jsonGenerator.writeStringField("username", user.getUsername());

        jsonGenerator.writeFieldName("roles");
        if (user.getRoles() != null) {
            jsonGenerator.writeStartArray();

            for (Role role : user.getRoles()) {
                jsonGenerator.writeStartObject();
                jsonGenerator.writeStringField("roleName", role.getRoleName());
                jsonGenerator.writeEndObject();
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndObject();
    }
}
