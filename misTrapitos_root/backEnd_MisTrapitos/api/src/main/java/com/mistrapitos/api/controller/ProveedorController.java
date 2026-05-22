package com.mistrapitos.api.controller;

import com.mistrapitos.api.table.Proveedor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/proveedores")
@CrossOrigin(origins = "http://localhost:5173")
public class ProveedorController {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @GetMapping("/{pageNumber}")
    public List<Proveedor> getAllProveedor(@PathVariable("pageNumber") int pageNumber){
        String queryGet = "Select * from proveedores limit 10 offset 10 *" + (pageNumber - 1);
        return jdbcTemplate.query(queryGet,
                (rs, rowNum) -> {
                    Proveedor p = new Proveedor();
                    p.setId(rs.getInt("id"));
                    p.setNombre(rs.getString("nombre"));
                    p.setEmail(rs.getString("email"));
                    p.setTelefono(rs.getString("telefono"));
                    p.setDireccion(rs.getString("direccion"));
                    return p;
                });
    }
}
