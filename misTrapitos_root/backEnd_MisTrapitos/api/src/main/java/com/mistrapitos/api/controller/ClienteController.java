package com.mistrapitos.api.controller;

import com.mistrapitos.api.table.Cliente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
@CrossOrigin(origins = "http://localhost:5173")
public class ClienteController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/{pageNumber}")
    public List<Cliente> getClientes(@PathVariable("pageNumber") int pageNumber){
        String sqlQuery = "select * from clientes limit 10 offset 10*" + (pageNumber-1);
        return jdbcTemplate.query(sqlQuery,
                (resultSet, rowNum) -> {
                    Cliente cliente = new Cliente();
                    cliente.setId(resultSet.getInt("id"));
                    cliente.setNombre(resultSet.getString("nombre"));
                    cliente.setDireccion(resultSet.getString("direccion"));
                    cliente.setEmail(resultSet.getString("email"));
                    cliente.setTelefono(resultSet.getString("telefono"));
                    cliente.setDireccion(resultSet.getString("direccion"));
                    cliente.setCiudad(resultSet.getString("ciudad"));
                    cliente.setRegion(resultSet.getString("region"));
                    return cliente;
                });
    }

    @PostMapping("/")
    public boolean addNewCliente(@RequestBody Cliente cliente){
        String queryString = "INSERT INTO clientes (nombre , direccion , email , telefono) VALUES (?,?,?,?)";
        return jdbcTemplate.update(
                queryString,cliente.getNombre(),
                cliente.getDireccion(), cliente.getEmail(), cliente.getTelefono()) > 0;
    }
}
