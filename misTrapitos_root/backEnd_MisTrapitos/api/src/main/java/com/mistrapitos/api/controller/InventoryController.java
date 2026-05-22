package com.mistrapitos.api.controller;

import com.mistrapitos.api.table.Producto;
import com.mistrapitos.api.table.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;





@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {
    @Autowired
    private JdbcTemplate jdbcTemplate;


    @GetMapping("/")
    public List<Producto> getProductos(){
        String sqlQuery = "SELECT vp.id,p.nombre,p.precio,p.categoria,vp.talla,vp.color,p.descripcion,vp.stock,pro.porcentaje_descuento,pro.fecha_inicio,pro.fecha_fin FROM Variaciones_Producto vp JOIN Productos p ON vp.producto_id = p.id JOIN Promociones pro ON pro.producto_id = p.id ORDER BY p.nombre";
       return jdbcTemplate.query(sqlQuery,
                (resultSet, rowNum) -> {
                    Producto producto = new Producto();
                    producto.setId(resultSet.getInt("id"));
                    producto.setCategoria(resultSet.getString("categoria"));
                    producto.setDescripcion(resultSet.getString("descripcion"));
                    producto.setNombre(resultSet.getString("nombre"));
                    producto.setPrecio(resultSet.getBigDecimal("precio"));
                    producto.setStock(resultSet.getInt("stock"));
                    producto.setTalla(resultSet.getString("talla"));
                    producto.setColor(resultSet.getString("color"));
                    producto.setPorcentajeDescuento(resultSet.getBigDecimal("porcentaje_descuento"));
                    producto.setFechaInicio(resultSet.getObject("fecha_inicio", LocalDate.class));
                    producto.setFechaFin(resultSet.getObject("fecha_fin", LocalDate.class));
                    return producto;
                });
    }
    @PostMapping("/")
    public ResponseEntity<Producto> addCliente(@RequestBody Producto producto){
        Integer howMany;
        String queryStringGet = "SELECT stock from variaciones_producto WHERE id =";
        String queryStringUpdate = "UPDATE variaciones_producto SET stock = ? WHERE id = ?";
         int b;
         howMany = jdbcTemplate.queryForObject((queryStringGet + String.valueOf(producto.getId())+";"), Integer.class);
         howMany += producto.getStock();
         b = jdbcTemplate.update(
                queryStringUpdate,howMany, producto.getId());
         if ( b <= 0) {
             return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(producto);
         }
        return ResponseEntity.status(HttpStatus.CREATED).body(producto);
    }
}
