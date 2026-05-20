package com.mistrapitos.api.table;

public class Cliente{
    private  int id = -1;
    private String nombre = "";
    private String telefono = "";
    private String email = "";
    private String direccion = "";

    public int getId() {
        return id;
    }

    public String getDireccion() {
        return direccion;
    }

    public String getEmail() {
        return email;
    }

    public String getNombre() {
        return nombre;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setDireccion(String direccion) {
        if (direccion == null) {
            this.direccion = "";
            return;
        }
        this.direccion = direccion;
    }

    public void setEmail(String email) {
        if (email == null) {
            this.email = "";
        }
        this.email = email;
    }

    public void setNombre(String nombre) {
        if (nombre == null){
            this.nombre = "";
            return;
        }
        this.nombre = nombre;
    }

    public void setTelefono(String telefono) {
        if (telefono == null){
            this.telefono = "";
            return;
        }
        this.telefono = telefono;
    }
}