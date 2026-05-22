package com.mistrapitos.api.controller;


import com.mistrapitos.api.table.Historial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/historicos")
@CrossOrigin(origins = "http://localhost:5173")
public class HistoricoController {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @GetMapping("/{pageNumber}")
    public List<Historial> getAllMovimientos(@PathVariable("pageNumber") int pageNumber){
        String queryGet = "select mv.id, mv.tipo_movimiento, mv.cantidad, mv.stock_anterior, mv.stock_nuevo, mv.motivo, mv.fecha, u.nombre, vp.color,vp.talla from movimientos_inventario mv JOIN usuarios u ON mv.usuario_id = u.id JOIN variaciones_producto vp ON mv.variacion_id = vp.id limit 10 offset 10 *" + (pageNumber - 1);
        return jdbcTemplate.query(queryGet, (rs, nRow) -> {
            Historial h = new Historial();
            h.setTipoMovimiento(rs.getString("tipo_movimiento"));
            h.setCantidad(rs.getInt("cantidad"));
            h.setStockAnterior(rs.getInt("stock_anterior"));
            h.setStockNuevo(rs.getInt("stock_nuevo"));
            h.setMotivo(rs.getString("motivo"));
            h.setFecha(rs.getObject("fecha", LocalDateTime.class));
            h.setTipoMovimiento(rs.getString("motivo"));
            h.setUsuario(rs.getString("nombre"));
            h.setColor(rs.getString("color"));
            h.setTalla(rs.getString("talla"));
            return h;
        });
    }
}
