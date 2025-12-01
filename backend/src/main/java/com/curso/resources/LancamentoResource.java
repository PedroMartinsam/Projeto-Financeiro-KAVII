package com.curso.resources;

import com.curso.domains.Lancamento;
import com.curso.domains.dtos.LancamentoDTO;
import com.curso.services.LancamentoService;
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
@RequestMapping("/api/lancamentos")
@Tag(name="Lancamentos", description = "API para Gerenciamento dos Lancamentos")
public class LancamentoResource {

    @Autowired
    private LancamentoService lancamentoService;

    @GetMapping
    @Operation(summary = "Listar todos os Lancamentos", description = "Retorna uma lista com todos os Lancamentos cadastrados")
    public ResponseEntity<List<LancamentoDTO>> findAll(){
        return ResponseEntity.ok().body(lancamentoService.findAll());
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "Listar os Lancamentos por id", description = "Retorna uma lista dos Lancamentos cadastrados por id")
    public ResponseEntity<LancamentoDTO> findbyId(@PathVariable Long id){
        Lancamento obj = this.lancamentoService.findbyId(id);
        return ResponseEntity.ok().body(new LancamentoDTO(obj));
    }

    @PostMapping
    @Operation(summary = "Cria novos Lancamentos", description = "Cria um novo Lancamento com base nos dados fornecidos")
    public ResponseEntity<LancamentoDTO> create(@Valid @RequestBody LancamentoDTO dto){
        Lancamento lancamento = lancamentoService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(lancamento.getId()).toUri();

        return ResponseEntity.created(uri).body(new LancamentoDTO(lancamento));
    }

    @PutMapping(value = "/{id}")
    @Operation(summary = "Altera um Lancamento", description = "Altera um Lancamento cadastrado")
    public ResponseEntity<LancamentoDTO> update(@PathVariable Long id, @Valid @RequestBody LancamentoDTO objDto){
        Lancamento Obj = lancamentoService.update(id, objDto);
        return ResponseEntity.ok().body(new LancamentoDTO(Obj));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deleta um Lancamento cadastrado", description = "Remove um Lancamento cadastrado a partir do id")
    public ResponseEntity<LancamentoDTO> delete(@PathVariable Long id){
        lancamentoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
