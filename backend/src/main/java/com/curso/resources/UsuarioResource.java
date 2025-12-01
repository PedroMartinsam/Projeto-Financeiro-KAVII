package com.curso.resources;

import com.curso.domains.Usuario;
import com.curso.domains.dtos.UsuarioDTO;
import com.curso.services.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name="Usuarios", description = "API para Gerenciamento dos Usuarios")
public class UsuarioResource {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar todos os Usuarios", description = "Retorna uma lista com todos os Usuarios cadastrados")
    public ResponseEntity<List<UsuarioDTO>> findAll(){
        return ResponseEntity.ok().body(usuarioService.findAll());
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "Listar os Usuarios por id", description = "Retorna uma lista dos Usuarios cadastradas por id")
    public ResponseEntity<UsuarioDTO> findbyId(@PathVariable Long id){
        Usuario obj = this.usuarioService.findbyId(id);
        return ResponseEntity.ok().body(new UsuarioDTO(obj));
    }

    @PostMapping
    @Operation(summary = "Cria novos Usuarios", description = "Cria um novo Usuario com base nos dados fornecidos")
    public ResponseEntity<UsuarioDTO> create(@Valid @RequestBody UsuarioDTO dto){
        Usuario usuario = usuarioService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(usuario.getId()).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    @Operation(summary = "Altera um Usuario", description = "Altera um Usuario cadastrado")
    public ResponseEntity<UsuarioDTO> update(@PathVariable Long id, @Valid @RequestBody UsuarioDTO objDto){
        Usuario Obj = usuarioService.update(id, objDto);
        return ResponseEntity.ok().body(new UsuarioDTO(Obj));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deleta um Usuario cadastrado", description = "Remove um Usuario cadastrado a partir do id")
    public ResponseEntity<UsuarioDTO> delete(@PathVariable Long id){
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
