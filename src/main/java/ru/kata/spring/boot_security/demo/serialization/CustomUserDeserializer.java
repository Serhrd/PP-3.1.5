package ru.kata.spring.boot_security.demo.serialization;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import ru.kata.spring.boot_security.demo.entity.Role;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.service.RoleService;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

public class CustomUserDeserializer extends JsonDeserializer<User> {

    private final RoleService rs;

    public CustomUserDeserializer(RoleService roleService) {
        this.rs = roleService;
    }

    @Override
    public User deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {

        JsonNode node = jsonParser.getCodec().readTree(jsonParser);
        User user = new User();

        JsonNode idNode = node.get("id");
        if (idNode != null) {
            user.setId(idNode.asLong());
        }

        JsonNode nameNode = node.get("name");
        if (nameNode != null) {
            user.setName(nameNode.asText());
        }

        JsonNode lastnameNode = node.get("lastname");
        if (lastnameNode != null) {
            user.setLastname(lastnameNode.asText());
        }

        JsonNode usernameNode = node.get("username");
        if (usernameNode != null) {
            user.setUsername(usernameNode.asText());
        }

        JsonNode passwordNode = node.get("password");
        if (passwordNode != null) {
            user.setPassword(passwordNode.asText());
        }

        Set<Role> roleSet = new HashSet<>();
        if (node.has("roles")) {
            for (JsonNode roleNodes : node.get("roles")) {
                Long roleId = roleNodes.asLong();
                Role role = rs.getRoleById(roleId);
                if (role != null) {
                    roleSet.add(role);
                }
            }
        }
        user.setRoles(roleSet);

        return user;
    }
}
