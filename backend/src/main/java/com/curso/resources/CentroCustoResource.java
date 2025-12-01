package com.curso.resources;

import com.curso.domains.CentroCusto;
import com.curso.domains.dtos.CentroCustoDTO;
import com.curso.services.CentroCustoService;
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
@RequestMapping("/api/centroCustos")
@Tag(name="Centros de Custo", description = "API para Gerenciamento dos Centros de Custo")
public class CentroCustoResource {

    @Autowired
    private CentroCustoService centroCustoService;

    @GetMapping
    @Operation(summary = "Listar todos os Centros de custo", description = "Retorna uma lista com todos os Centros de custo cadastrados")
    public ResponseEntity<List<CentroCustoDTO>> findAll(){
        return ResponseEntity.ok().body(centroCustoService.findAll());
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "Listar todos os Centro de Custo por id", description = "Retorna uma lista com todos os Centros de custo cadastrados pelo id")
    public ResponseEntity<CentroCustoDTO> findbyId(@PathVariable Long id){
        CentroCusto obj = this.centroCustoService.findbyId(id);
        return ResponseEntity.ok().body(new CentroCustoDTO(obj));
    }

    @PostMapping
    @Operation(summary = "Cria novos Centros de Custo", description = "Cria um novo Centro de Custo com base nos dados fornecidos")
    public ResponseEntity<CentroCustoDTO> create(@Valid @RequestBody CentroCustoDTO dto){
        CentroCusto centroCusto = centroCustoService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(centroCusto.getId()).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    @Operation(summary = "Altera um Centro de Custo", description = "Altera um Centro de Custo cadastrado")
    public ResponseEntity<CentroCustoDTO> update(@PathVariable Long id, @Valid @RequestBody CentroCustoDTO objDto){
        CentroCusto Obj = centroCustoService.update(id, objDto);
        return ResponseEntity.ok().body(new CentroCustoDTO(Obj));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deleta um Centro de Custo cadastrado", description = "Remove um Centro de custo cadastrado a partir do id")
    public ResponseEntity<CentroCustoDTO> delete(@PathVariable Long id){
        centroCustoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
