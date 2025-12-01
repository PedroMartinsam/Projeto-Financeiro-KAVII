package com.curso.services;

import com.curso.domains.CentroCusto;
import com.curso.domains.dtos.CentroCustoDTO;
import com.curso.repositories.CentroCustoRepository;
import com.curso.services.exceptions.DataIntegrityViolationException;
import com.curso.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CentroCustoService {

    @Autowired
    private CentroCustoRepository centroCustoRepo;

    public List<CentroCustoDTO> findAll(){
        return centroCustoRepo.findAll().stream()
                .map(obj -> new CentroCustoDTO(obj))
                .collect(Collectors.toList());
    }

    public CentroCusto findbyId(Long id){
        Optional<CentroCusto> obj = centroCustoRepo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Centro de Custo não encontrado! ID: "+ id));
    }

    public CentroCusto create(CentroCustoDTO dto){
        dto.setId(null);
        validacCusto(dto);
        CentroCusto obj = new CentroCusto(dto);
        return centroCustoRepo.save(obj);
    }

    public CentroCusto update(Long id, CentroCustoDTO objDto){
        objDto.setId(id);
        validacCusto(objDto);
        CentroCusto oldObj = findbyId(id);
        oldObj = new CentroCusto(objDto);
        return centroCustoRepo.save(oldObj);
    }

    public void delete(Long id) {
        CentroCusto centroCusto = findbyId(id);

        if (!centroCusto.getLancamentos().isEmpty()) {
            String lancamentosInfo = centroCusto.getLancamentos().stream()
                    .map(l -> "ID: " + l.getId() + " - Descrição: " + l.getDescricao())
                    .collect(Collectors.joining(", "));

            throw new DataIntegrityViolationException(
                    "Não foi possível excluir o centro de custo, pois já existe um lançamento vinculado: [" + lancamentosInfo + "]"
            );
        }

        centroCustoRepo.deleteById(id);
    }
    private void validacCusto(CentroCustoDTO dto) {
        if (dto.getDescricao() == null || dto.getDescricao().trim().isEmpty()) {
            throw new DataIntegrityViolationException("Descrição não informada.");
        }

        Optional<CentroCusto> obj = centroCustoRepo.findByDescricao(dto.getDescricao());
        obj.ifPresent(custoExistente -> {
            if (dto.getId() == null || !dto.getId().equals(custoExistente.getId())) {
                throw new DataIntegrityViolationException(
                        "Já existe um Centro de Custo com a descrição: " + custoExistente.getDescricao()
                                + " - ID: " + custoExistente.getId()
                );
            }
        });
    }


}
