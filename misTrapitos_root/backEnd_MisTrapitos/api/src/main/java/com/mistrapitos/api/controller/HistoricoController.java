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
        int offset = 10 * (pageNumber - 1);
        String queryGet = "select mv.id, mv.tipo_movimiento, mv.cantidad, mv.stock_anterior, mv.stock_nuevo, mv.motivo, mv.fecha, u.nombre, vp.color, vp.talla from movimientos_inventario mv LEFT JOIN usuarios u ON mv.usuario_id = u.id LEFT JOIN variaciones_producto vp ON mv.variacion_id = vp.id ORDER BY mv.fecha DESC limit 10 offset " + offset;
        return jdbcTemplate.query(queryGet, (rs, nRow) -> {
            Historial h = new Historial();
            h.setTipoMovimiento(rs.getString("tipo_movimiento"));
            h.setCantidad(rs.getInt("cantidad"));
            h.setStockAnterior(rs.getInt("stock_anterior"));
            h.setStockNuevo(rs.getInt("stock_nuevo"));
            h.setMotivo(rs.getString("motivo"));
            h.setFecha(rs.getObject("fecha", LocalDateTime.class));
            h.setUsuario(rs.getString("nombre"));
            h.setColor(rs.getString("color"));
            h.setTalla(rs.getString("talla"));
            return h;
        });
    }

    // Endpoint de depuración: devuelve los últimos N movimientos (sin paginar)
    @GetMapping("/debug/ultimos/{n}")
    public List<Historial> getUltimosMovimientos(@PathVariable("n") int n){
        String query = "select mv.id, mv.tipo_movimiento, mv.cantidad, mv.stock_anterior, mv.stock_nuevo, mv.motivo, mv.fecha, u.nombre, vp.color, vp.talla from movimientos_inventario mv LEFT JOIN usuarios u ON mv.usuario_id = u.id LEFT JOIN variaciones_producto vp ON mv.variacion_id = vp.id ORDER BY mv.fecha DESC limit " + n;
        return jdbcTemplate.query(query, (rs, nRow) -> {
            Historial h = new Historial();
            h.setTipoMovimiento(rs.getString("tipo_movimiento"));
            h.setCantidad(rs.getInt("cantidad"));
            h.setStockAnterior(rs.getInt("stock_anterior"));
            h.setStockNuevo(rs.getInt("stock_nuevo"));
            h.setMotivo(rs.getString("motivo"));
            h.setFecha(rs.getObject("fecha", LocalDateTime.class));
            h.setUsuario(rs.getString("nombre"));
            h.setColor(rs.getString("color"));
            h.setTalla(rs.getString("talla"));
            return h;
        });
    }
}
