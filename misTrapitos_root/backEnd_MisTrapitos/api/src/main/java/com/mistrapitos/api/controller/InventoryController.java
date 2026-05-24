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
import java.time.LocalDateTime;
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
    public ResponseEntity<?> addStock(@RequestBody java.util.Map<String, Object> body){
        // Esperamos { id: number, stock: number, usuarioId?: number }
        Integer id = (body.get("id") instanceof Number) ? ((Number) body.get("id")).intValue() : Integer.parseInt(body.get("id").toString());
        Integer add = (body.get("stock") instanceof Number) ? ((Number) body.get("stock")).intValue() : Integer.parseInt(body.get("stock").toString());
        Long usuarioId = null;
        if (body.get("usuarioId") != null) {
            if (body.get("usuarioId") instanceof Number) usuarioId = ((Number) body.get("usuarioId")).longValue();
            else usuarioId = Long.parseLong(body.get("usuarioId").toString());
        }

        String queryStringGet = "SELECT stock from variaciones_producto WHERE id =" + id + ";";
        String queryStringUpdate = "UPDATE variaciones_producto SET stock = ? WHERE id = ?";
        String queryInsertMovimiento = "INSERT INTO movimientos_inventario(tipo_movimiento, cantidad, stock_anterior, stock_nuevo, motivo, fecha, usuario_id, variacion_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try {
            Integer stockAnterior = jdbcTemplate.queryForObject(queryStringGet, Integer.class);
            if (stockAnterior == null) stockAnterior = 0;
            int stockNuevo = stockAnterior + add;
            int b = jdbcTemplate.update(queryStringUpdate, stockNuevo, id);
            if (b <= 0) {
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(java.util.Collections.singletonMap("error", "No se pudo actualizar stock"));
            }

            jdbcTemplate.update(
                    queryInsertMovimiento,
                    "ingreso",
                    add,
                    stockAnterior,
                    stockNuevo,
                    "suministro",
                    java.time.LocalDateTime.now(),
                    usuarioId,
                    id
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(java.util.Collections.singletonMap("error", e.getMessage()));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(java.util.Collections.singletonMap("id", id));
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
