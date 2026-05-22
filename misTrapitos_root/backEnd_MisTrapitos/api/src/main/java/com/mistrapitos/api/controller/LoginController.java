package com.mistrapitos.api.controller;


import com.mistrapitos.api.table.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @GetMapping("/")
    public ResponseEntity<Usuario> loginFunction(@RequestBody Usuario user){
        if (user.getNombre().isEmpty() || user.getPassword().contains("\"") || user.getPassword().contains("'")){
            return ResponseEntity.status(404).body(user);
        }
        String queryGet = "SELECT id, nombre, rol, password FROM usuarios WHERE nombre = ?";
        Usuario realUser;
        try {
            realUser = jdbcTemplate.queryForObject(queryGet, (rs, rowNum) -> {
                Usuario u = new Usuario();
                u.setId(rs.getInt("id"));
                u.setNombre(rs.getString("nombre"));
                u.setPassword(rs.getString("password"));
                u.setRol(rs.getString("rol"));
                return u;
            }, user.getNombre());
        }
        catch (EmptyResultDataAccessException e){
            return ResponseEntity.status(405).body(user);
        }
        if (realUser.getPassword().compareTo(user.getPassword()) == 0){
            return ResponseEntity.status(HttpStatus.OK).body(realUser);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(user);
    }


}
