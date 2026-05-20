package com.mistrapitos.api.table;

import java.math.BigDecimal;

public class Producto {
    private int id = 0;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private int stock;
    private String categoria;

    public boolean setId(int id) {
        if (id < 0) {
            return false;
        }
        this.id = id;
        return true;
    }

    public boolean setNombre(String nombre) {
        if (nombre.isEmpty()) {
            return false;
        }
        this.nombre = nombre;
        return true;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public boolean setPrecio(BigDecimal precio) {
        if (precio.signum() <= 0){
            return false;
        }
        this.precio = precio;
        return true;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public int getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public int getStock() {
        return stock;
    }

    public String getCategoria() {
        return categoria;
    }
}
