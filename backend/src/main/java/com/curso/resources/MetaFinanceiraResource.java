package com.curso.resources;

import com.curso.domains.MetaFinanceira;
import com.curso.domains.dtos.MetaFinanceiraDTO;
import com.curso.services.MetaFinanceiraService;
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
@RequestMapping("/api/metaFinanceiras")
@Tag(name="Meta Financeira", description = "API para Gerenciamento das Metas Financeiras")
public class MetaFinanceiraResource {

    @Autowired
    private MetaFinanceiraService metaFinanceiraService;

    @GetMapping
    @Operation(summary = "Listar todas as Metas Financeiras", description = "Retorna uma lista com todas as Metas Financeiras cadastrados")
    public ResponseEntity<List<MetaFinanceiraDTO>> findAll(){
        return ResponseEntity.ok().body(metaFinanceiraService.findAll());
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "Listar as Metas Financeiras por id", description = "Retorna uma lista das Metas Financeiras cadastradas por id")
    public ResponseEntity<MetaFinanceiraDTO> findbyId(@PathVariable Long id){
        MetaFinanceira obj = this.metaFinanceiraService.findbyId(id);
        return ResponseEntity.ok().body(new MetaFinanceiraDTO(obj));
    }

    @PostMapping
    @Operation(summary = "Cria novas Metas Financeiras", description = "Cria uma nova Meta Financeira com base nos dados fornecidos")
    public ResponseEntity<MetaFinanceiraDTO> create(@Valid @RequestBody MetaFinanceiraDTO dto){
        MetaFinanceira metaFinanceira = metaFinanceiraService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(metaFinanceira.getId()).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    @Operation(summary = "Altera uma Meta Financeira", description = "Altera uma Meta Financeira cadastrada")
    public ResponseEntity<MetaFinanceiraDTO> update(@PathVariable Long id, @Valid @RequestBody MetaFinanceiraDTO objDto){
        MetaFinanceira Obj = metaFinanceiraService.update(id, objDto);
        return ResponseEntity.ok().body(new MetaFinanceiraDTO(Obj));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deleta uma Meta Financeira cadastrada", description = "Remove uma Meta Financeira cadastrada a partir do id")
    public ResponseEntity<MetaFinanceiraDTO> delete(@PathVariable Long id){
        metaFinanceiraService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
