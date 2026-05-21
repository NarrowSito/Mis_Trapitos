package com.mistrapitos.api.table;

import java.time.LocalDateTime;

public class Historial {
    private String nombre = "";
    private String tipoMovimiento = "";
    private int cantidad = 0;
    private int stockAnterior = 0;
    private int stockNuevo = 0;
    private LocalDateTime fecha;

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public void setStockAnterior(int stockAnterior) {
        this.stockAnterior = stockAnterior;
    }

    public void setStockNuevo(int stockNuevo) {
        this.stockNuevo = stockNuevo;
    }

    public void setTipoMovimiento(String tipoMovimiento) {
        this.tipoMovimiento = tipoMovimiento;
    }

    public String getNombre() {
        return nombre;
    }

    public int getCantidad() {
        return cantidad;
    }

    public int getStockAnterior() {
        return stockAnterior;
    }

    public int getStockNuevo() {
        return stockNuevo;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public String getTipoMovimiento() {
        return tipoMovimiento;
    }
}
