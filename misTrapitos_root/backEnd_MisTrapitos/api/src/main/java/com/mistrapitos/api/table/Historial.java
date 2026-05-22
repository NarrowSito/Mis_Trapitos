package com.mistrapitos.api.table;

import java.time.LocalDateTime;

public class Historial {
    private String tipoMovimiento = "";
    private int cantidad = 0;
    private int stockAnterior = 0;
    private int stockNuevo = 0;
    private String motivo = "";
    private String usuario = "";
    private LocalDateTime fecha;
    private String color = "";
    private  String talla = "";




    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getTalla() {
        return talla;
    }

    public void setTalla(String talla) {
        this.talla = talla;
    }

    public String getMotivo() {
        return motivo;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }


    public void setUsuario(String usuario) {
        this.usuario = usuario;
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
