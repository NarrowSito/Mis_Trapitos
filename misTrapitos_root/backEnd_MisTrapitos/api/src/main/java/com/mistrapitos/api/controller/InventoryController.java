package com.mistrapitos.api.controller;

import com.mistrapitos.api.table.Producto;
import com.mistrapitos.api.table.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
    @PutMapping("/")
    public ResponseEntity<Producto> addStock(@RequestBody Producto producto){
        Integer howMany;
        String queryStringGet = "SELECT stock from variaciones_producto WHERE id =";
        String queryStringUpdate = "UPDATE variaciones_producto SET stock = ? WHERE id = ?";
         int b;
         howMany = jdbcTemplate.queryForObject((queryStringGet + (producto.getId()) + ";"), Integer.class);
         howMany += producto.getStock();
         b = jdbcTemplate.update(
                queryStringUpdate,howMany, producto.getId());
         if ( b <= 0) {
             return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(producto);
         }
        return ResponseEntity.status(HttpStatus.CREATED).body(producto);
    }

    @PostMapping("/")
    public  ResponseEntity<Producto> newProducto(@RequestBody Producto prod){
        Integer provedorId;
        String queryInsert = "WITH nuevo_producto AS (INSERT INTO producto(nombre, precio, categoria, descripcion, provedor_id) VALUES (?, ?, ?, ?, ?) RETURNING id) INSERT INTO variaciones_producto(stock, talla, color, producto_id) SELECT 0, ?, ?, id FROM nuevo_producto; ";
        String queryGetId =
                "SELECT id FROM proveedores WHERE nombre = '";
        if (prod.getNombre() == null || prod.getNombre().isEmpty()){
            prod.setNombre(null);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(prod);
        }
        if (prod.getDescripcion() == null || prod.getDescripcion().isEmpty()){
            prod.setDescripcion(null);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(prod);
        }
        if (prod.getPrecio() == null || prod.getPrecio().signum() <= 0){
            prod.setPrecio(BigDecimal.ZERO);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(prod);
        }
        if (prod.getStock() < 0){
            prod.setStock(-1);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(prod);
        }
        if (prod.getCategoria() == null || prod.getCategoria().isEmpty()){
            prod.setCategoria(null);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(prod);
        }
        if (prod.getProvedor() == null || prod.getProvedor().isEmpty()){
            prod.setProvedor(null);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(prod);
        }
        if (prod.getColor() == null || prod.getColor().isEmpty()){
            prod.setColor(null);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(prod);
        }
        if (prod.getTalla() == null || prod.getTalla().isEmpty()){
            prod.setTalla(null);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(prod);
        }
        try{
            provedorId = jdbcTemplate.queryForObject(queryGetId + (prod.getProvedor()) + "';", Integer.class);
        } catch (EmptyResultDataAccessException e){
            provedorId = -1;
        }
        if (jdbcTemplate.update(queryInsert, prod.getNombre(), prod.getPrecio(), prod.getCategoria(), prod.getDescripcion(), provedorId, prod.getTalla(), prod.getColor()) <= 0)
        {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(prod);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(prod);
    }
}
