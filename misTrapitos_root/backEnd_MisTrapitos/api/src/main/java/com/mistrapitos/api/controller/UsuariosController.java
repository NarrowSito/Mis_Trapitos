package com.mistrapitos.api.controller;


import com.mistrapitos.api.table.Usuario;
import com.mistrapitos.api.table.Venta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/ventas")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuariosController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/")
    public ResponseEntity<List<Usuario>> selectUsers(){
        List<Usuario> r= new ArrayList<>();
        String query = "SELECT * FROM usuarios;";
        r = jdbcTemplate.query(query,
                (rs, rowNum) -> {
                    Usuario u = new Usuario();
                    u.setId(rs.getInt("id"));
                    u.setRol(rs.getString("rol"));
                    u.setNombre(rs.getString("nombre"));
                    u.setEmail(rs.getString("email"));
                    return u;
                }
        );
        return ResponseEntity.status(HttpStatus.OK).body(r);
    }

    @PostMapping("/")
    public ResponseEntity<Usuario> addNewUser(@RequestBody Usuario user){
        String query = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?,?,?,?);";
        if (user.getPassword().isEmpty() || user.getPassword().isBlank() || user.getPassword().contains("'")){
            user.setPassword(null);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(user);
        }
        if (user.getNombre().isEmpty() || user.getNombre().isBlank() || user.getNombre().contains("'")){
            user.setNombre(null);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(user);
        }
        if (!checkEmail(user.getEmail())){
            user.setEmail(null);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(user);
        }
        if (!checkRol(user.getRol())){
            user.setRol(null);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(user);
        }
        jdbcTemplate.update(query,user.getNombre(),user.getEmail(),user.getPassword(),user.getRol());
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }
    private boolean checkEmail(String e){
        if (e.isEmpty() || e.isBlank()){
            return false;
        }
        if (!e.contains("@")){
            return false;
        }
        if (!e.contains(".")){
            return false;
        }
        return true;
    }
    private boolean checkRol(String r){
        String[] roles = {"admin", "empleado"};
        if (r.isEmpty() || r.isBlank()){
            return false;
        }
        for (String s : roles){
            if (s.equals(r)){
                return true;
            }
        }
        return false;
    }


}
