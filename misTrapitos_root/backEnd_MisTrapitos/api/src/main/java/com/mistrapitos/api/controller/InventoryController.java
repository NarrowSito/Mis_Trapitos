package com.mistrapitos.api.controller;

import com.mistrapitos.api.table.Producto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;





@RestController
@RequestMapping("/productos")
public class InventoryController {
    @Autowired
    private JdbcTemplate jdbcTemplate;


    @GetMapping("/")
    public List<Producto> getProductos(){
        String sqlQuery = "select * from productos";
       return jdbcTemplate.query(sqlQuery,
                (resultSet, rowNum) -> {
                    Producto producto = new Producto();
                    producto.setId(resultSet.getInt("id"));
                    producto.setCategoria(resultSet.getString("categoria"));
                    producto.setDescripcion(resultSet.getString("descripcion"));
                    producto.setNombre(resultSet.getString("nombre"));
                    producto.setPrecio(resultSet.getBigDecimal("precio"));
                    producto.setStock(resultSet.getInt("stock"));
                    return producto;
                });
    }
    @PostMapping("/")
    public String addCliente(@RequestBody Producto producto){
        /*
        String queryString = "INSERT INTO producto (nombre , descripcion , precio , stock , categoria) VALUES (?,?,?,?,?)";
        return jdbcTemplate.update(
                queryString,producto.getNombre(),
                producto.getDescripcion(), producto.getPrecio(), producto.getStock() ,producto.getCategoria()) > 0;

         */
        return "hola: " + producto.getNombre();
    }

}
