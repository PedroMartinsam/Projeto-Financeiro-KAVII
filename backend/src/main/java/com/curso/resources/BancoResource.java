package com.curso.resources;

import com.curso.domains.Banco;
import com.curso.domains.dtos.BancoDTO;
import com.curso.services.BancoService;
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
@RequestMapping("/api/bancos")
@Tag(name="Bancos", description = "API para Gerenciamento dos Bancos")
public class BancoResource {

    @Autowired
    private BancoService bancoService;

    @GetMapping
    @Operation(summary = "Listar todos os Bancos", description = "Retorna uma lista com todos os Bancos cadastrados")
    public ResponseEntity<List<BancoDTO>> findAll(){
        return ResponseEntity.ok().body(bancoService.findAll());
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "Listar todos os Bancos por id", description = "Retorna uma lista com todos os Bancos cadastrados pelo id")
    public ResponseEntity<BancoDTO> findbyId(@PathVariable Long id){
        Banco obj = this.bancoService.findbyId(id);
        return ResponseEntity.ok().body(new BancoDTO(obj));
    }

    @PostMapping
    @Operation(summary = "Cria novos Bancos", description = "Cria novos Bancos com base nos dados fornecidos")
    public ResponseEntity<BancoDTO> create(@Valid @RequestBody BancoDTO dto){
        Banco banco = bancoService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(banco.getId()).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    @Operation(summary = "Altera um Banco", description = "Altera um Banco cadastrado")
    public ResponseEntity<BancoDTO> update(@PathVariable Long id, @Valid @RequestBody BancoDTO objDto){
        Banco Obj = bancoService.update(id, objDto);
        return ResponseEntity.ok().body(new BancoDTO(Obj));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deleta um Banco cadastrado", description = "Remove um Banco cadastrado a partir do id")
    public ResponseEntity<BancoDTO> delete(@PathVariable Long id){
        bancoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
