package com.mistrapitos.api.controller;

import com.mistrapitos.api.table.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuariosController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/")
    public List<Usuario> listUsuarios() {
        String sql = "SELECT id, nombre, email, rol FROM usuarios ORDER BY nombre";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Usuario u = new Usuario();
            u.setId(rs.getInt("id"));
            u.setNombre(rs.getString("nombre"));
            u.setEmail(rs.getString("email"));
            u.setRol(rs.getString("rol"));
            return u;
        });
    }

    @GetMapping("/{id}")
    public Usuario getUsuario(@PathVariable("id") int id) {
        try {
            String sql = "SELECT id, nombre, email, rol FROM usuarios WHERE id = ?";
            return jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, rowNum) -> {
                Usuario u = new Usuario();
                u.setId(rs.getInt("id"));
                u.setNombre(rs.getString("nombre"));
                u.setEmail(rs.getString("email"));
                u.setRol(rs.getString("rol"));
                return u;
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @PostMapping("/")
    public Usuario createUsuario(@RequestBody Usuario u) {
        String sql = "INSERT INTO usuarios(nombre, email, password, rol) VALUES (?, ?, ?, ?) RETURNING id";
        Integer id = jdbcTemplate.queryForObject(sql, Integer.class, u.getNombre(), u.getEmail(), u.getPassword(), u.getRol());
        u.setId(id);
        u.setPassword(null);
        return u;
    }

    @PutMapping("/{id}")
    public Usuario updateUsuario(@PathVariable("id") int id, @RequestBody Usuario u) {
        String sql = "UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?";
        jdbcTemplate.update(sql, u.getNombre(), u.getEmail(), u.getRol(), id);
        u.setId(id);
        u.setPassword(null);
        return u;
    }

    @DeleteMapping("/{id}")
    public void deleteUsuario(@PathVariable("id") int id) {
        String sql = "DELETE FROM usuarios WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
