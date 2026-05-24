package com.mistrapitos.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/reportes")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportesController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/resumen")
    public Map<String, Object> resumenMes() {
        Map<String, Object> out = new HashMap<>();

        String ingresosSql = "SELECT COALESCE(SUM(total),0) FROM ventas WHERE fecha >= date_trunc('month', current_date) AND fecha < (date_trunc('month', current_date) + interval '1 month')";
        String ticketsSql = "SELECT COALESCE(COUNT(*),0) FROM ventas WHERE fecha >= date_trunc('month', current_date) AND fecha < (date_trunc('month', current_date) + interval '1 month')";
        String promedioSql = "SELECT COALESCE(AVG(total),0) FROM ventas WHERE fecha >= date_trunc('month', current_date) AND fecha < (date_trunc('month', current_date) + interval '1 month')";

        String ingresosPrevSql = "SELECT COALESCE(SUM(total),0) FROM ventas WHERE fecha >= date_trunc('month', current_date - interval '1 month') AND fecha < (date_trunc('month', current_date))";

        BigDecimal ingresos = jdbcTemplate.queryForObject(ingresosSql, BigDecimal.class);
        BigDecimal promedio = jdbcTemplate.queryForObject(promedioSql, BigDecimal.class);
        Integer tickets = jdbcTemplate.queryForObject(ticketsSql, Integer.class);
        BigDecimal ingresosPrev = jdbcTemplate.queryForObject(ingresosPrevSql, BigDecimal.class);

        out.put("ingresosMes", ingresos == null ? BigDecimal.ZERO : ingresos);
        out.put("ticketsTotales", tickets == null ? 0 : tickets);
        out.put("ticketPromedio", promedio == null ? BigDecimal.ZERO : promedio);

        // crecimiento porcentual respecto al mes previo
        BigDecimal crecimiento = BigDecimal.ZERO;
        try {
            if (ingresosPrev != null && ingresosPrev.compareTo(BigDecimal.ZERO) > 0) {
                crecimiento = ingresos.subtract(ingresosPrev).multiply(BigDecimal.valueOf(100)).divide(ingresosPrev, 2, BigDecimal.ROUND_HALF_UP);
            }
        } catch (Exception e) {
            crecimiento = BigDecimal.ZERO;
        }
        out.put("crecimiento", crecimiento);
        return out;
    }

    @GetMapping("/ventas-semana")
    public List<Map<String, Object>> ventasSemana() {
        String sql = "SELECT fecha::date AS dia, COALESCE(SUM(total),0) AS valor FROM ventas WHERE fecha >= current_date - interval '6 days' GROUP BY fecha::date ORDER BY fecha::date";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> r = new HashMap<>();
            r.put("dia", rs.getObject("dia", LocalDate.class).toString());
            r.put("valor", rs.getBigDecimal("valor"));
            return r;
        });
    }

    @GetMapping("/top-productos")
    public List<Map<String, Object>> topProductos(@RequestParam(name = "limit", defaultValue = "3") int limit) {
        String sql = "SELECT vp.id AS id, p.nombre AS nombre, COALESCE(SUM(dv.cantidad),0) AS vendidos, COALESCE(SUM(dv.subtotal),0) AS ingreso, vp.stock as stock FROM detalle_ventas dv JOIN ventas v ON dv.venta_id = v.id JOIN variaciones_producto vp ON dv.variacion_id = vp.id JOIN productos p ON vp.producto_id = p.id GROUP BY vp.id, p.nombre, vp.stock ORDER BY vendidos DESC LIMIT ?";
        return jdbcTemplate.query(sql, new Object[]{limit}, (rs, rowNum) -> {
            Map<String, Object> r = new HashMap<>();
            r.put("id", rs.getInt("id"));
            r.put("nombre", rs.getString("nombre"));
            r.put("vendidos", rs.getInt("vendidos"));
            r.put("ingreso", rs.getBigDecimal("ingreso"));
            r.put("stock", rs.getInt("stock"));
            return r;
        });
    }
}
