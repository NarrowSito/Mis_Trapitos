package com.mistrapitos.api.controller;

import com.mistrapitos.api.table.Producto;
import com.mistrapitos.api.table.Venta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/ventas")
@CrossOrigin(origins = "http://localhost:5173")
public class VentaController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/")
    public ResponseEntity<Venta> newVenta(@RequestBody Venta venta){
        BigDecimal totalCalculado = new BigDecimal(0);
        String queryCheckClienteId = "SELECT id FROM clientes WHERE id=";
        String queryCheckUserId = "SELECT id FROM usuarios WHERE id=";
        String queryNewVenta = "INSERT INTO ventas(fecha, total, cliente_id, usuario_id, metodo_pago) VALUES (?,?,?,?,?) RETURNING id;";
        String queryNewDetalle = "INSERT INTO detalle_ventas(venta_id, cantidad, variacion_id) "+
                ("VALUES (?,?,?) RETURNING subtotal;");
        String queryFinalStage ="UPDATE ventas SET total = ? WHERE id = ?";
        venta.setFecha(LocalDateTime.now());
        if (venta.getUsuarioId() < 0){
            venta.setUsuarioId((long)-1);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(venta);
        }
        if (venta.getMetodoDePago().isEmpty() || !valiadateMetodoDePago(venta.getMetodoDePago())){
            venta.setMetodoDePago(null);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(venta);
        }
        if (venta.getTotal().signum() < 0){
            venta.setTotal(null);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(venta);
        }
        for (Producto p : venta.getProductos()){
            if (!valiadateProducto(p)){
                venta.setProductos(null);
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(venta);
            }
        }
        try {
            if (venta.getClienteId() >= 0){
                venta.setClienteId(jdbcTemplate.queryForObject(queryCheckClienteId+(venta.getClienteId()), Long.class));
            }else{
                venta.setClienteId(null);
            }
        }catch (EmptyResultDataAccessException e){
            venta.setClienteId(null);
        }
        try {
            if (venta.getClienteId() >= 0){
                venta.setUsuarioId(jdbcTemplate.queryForObject(queryCheckUserId+(venta.getUsuarioId()), Long.class));
            }
        }catch (EmptyResultDataAccessException e){
            venta.setUsuarioId((long) -1);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(venta);
        }
        venta.setId(jdbcTemplate.queryForObject(
                    queryNewVenta,
                    Long.class,
                    venta.getFecha(),
                    venta.getTotal(),
                    venta.getClienteId(),
                    venta.getUsuarioId(),
                    venta.getMetodoDePago()
                    )
        );
        for (Producto p : venta.getProductos()){
            totalCalculado = totalCalculado.add(p.setPrecio(jdbcTemplate.queryForObject(queryNewDetalle,BigDecimal.class,venta.getId(),p.getStock(),p.getId())));
        }
        if (totalCalculado.compareTo(venta.getTotal()) != 0){
            jdbcTemplate.update(queryFinalStage, totalCalculado, venta.getId());
            venta.setTotal(totalCalculado);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(venta);
    }

    private boolean valiadateProducto(Producto toValidate){
        String queryCheckVariacionId = "SELECT id FROM variaciones_producto WHERE id =";
        if (toValidate.getId() < 0){
            return false;
        }
        if (toValidate.getStock() < 0){
            return false;
        }
        try {
            boolean b = jdbcTemplate.queryForObject(queryCheckVariacionId+(toValidate.getId()), Long.class) > 0;
            if (!b) {
                return false;
            }
        }catch (EmptyResultDataAccessException e){
            return false;
        }
        return true;
    }
    private boolean valiadateMetodoDePago(String metodo){
        String[] metodosValios = {"efectivo", "tarjeta", "transferencia"};
        for (String v : metodosValios){
            if (v.compareTo(metodo) == 0){
                return true;
            }
        }
        return false;
    }
}
