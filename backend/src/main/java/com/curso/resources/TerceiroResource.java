package com.curso.resources;

import com.curso.domains.Terceiro;
import com.curso.domains.dtos.TerceiroDTO;
import com.curso.services.TerceiroService;
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
@RequestMapping("/api/terceiros")
@Tag(name="Terceiros", description = "API para Gerenciamento dos Terceiros")
public class TerceiroResource {

    @Autowired
    private TerceiroService terceiroService;

    @GetMapping
    @Operation(summary = "Listar todos os Terceiros", description = "Retorna uma lista com todos os Terceiros cadastrados")
    public ResponseEntity<List<TerceiroDTO>> findAll(){
        return ResponseEntity.ok().body(terceiroService.findAll());
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "Listar os Terceiros por id", description = "Retorna uma lista dos Terceiros cadastradas por id")
    public ResponseEntity<TerceiroDTO> findbyId(@PathVariable Long id){
        Terceiro obj = this.terceiroService.findbyId(id);
        return ResponseEntity.ok().body(new TerceiroDTO(obj));
    }

    @PostMapping
    @Operation(summary = "Cria novos Lancamentos", description = "Cria um novo Lancamento com base nos dados fornecidos")
    public ResponseEntity<TerceiroDTO> create(@Valid @RequestBody TerceiroDTO dto){
        Terceiro terceiro = terceiroService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(terceiro.getId()).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    @Operation(summary = "Altera um Lancamento", description = "Altera um Lancamento cadastrado")
    public ResponseEntity<TerceiroDTO> update(@PathVariable Long id, @Valid @RequestBody TerceiroDTO objDto){
        Terceiro Obj = terceiroService.update(id, objDto);
        return ResponseEntity.ok().body(new TerceiroDTO(Obj));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deleta um Lancamento cadastrado", description = "Remove um Lancamento cadastrado a partir do id")
    public ResponseEntity<TerceiroDTO> delete(@PathVariable Long id){
        terceiroService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
