package com.mistrapitos.api.controller;

import com.mistrapitos.api.table.Producto;
import com.mistrapitos.api.table.Venta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ventas")
@CrossOrigin(origins = "http://localhost:5173")
public class VentaController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/")
    public ResponseEntity<Venta> newVenta(@RequestBody Venta venta){}
}
