package com.curso.resources;

import com.curso.domains.Conta;
import com.curso.domains.dtos.ContaDTO;
import com.curso.services.ContaService;
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
@RequestMapping("/api/contas")
@Tag(name="Contas", description = "API para Gerenciamento das Contas")
public class ContaResource {

    @Autowired
    private ContaService contaService;

    @GetMapping
    @Operation(summary = "Listar todas as Contas", description = "Retorna uma lista com todas as Contas cadastrados")
    public ResponseEntity<List<ContaDTO>> findAll(){
        return ResponseEntity.ok().body(contaService.findAll());
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "Listar as Contas por id", description = "Retorna uma lista das Contas cadastradas por id")
    public ResponseEntity<ContaDTO> findbyId(@PathVariable Long id){
        Conta obj = this.contaService.findbyId(id);
        return ResponseEntity.ok().body(new ContaDTO(obj));
    }

    @PostMapping
    @Operation(summary = "Cria novas Contas", description = "Cria uma nova Conta com base nos dados fornecidos")
    public ResponseEntity<ContaDTO> create(@Valid @RequestBody ContaDTO dto){
        Conta conta = contaService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(conta.getId()).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    @Operation(summary = "Altera uma Conta", description = "Altera uma Conta cadastrada")
    public ResponseEntity<ContaDTO> update(@PathVariable Long id, @Valid @RequestBody ContaDTO objDto){
        Conta Obj = contaService.update(id, objDto);
        return ResponseEntity.ok().body(new ContaDTO(Obj));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deleta uma Conta cadastrada", description = "Remove uma Conta cadastrada a partir do id")
    public ResponseEntity<ContaDTO> delete(@PathVariable Long id){
        contaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
