package com.curso.services;

import com.curso.domains.MetaFinanceira;
import com.curso.domains.dtos.MetaFinanceiraDTO;
import com.curso.repositories.MetaFinanceiraRepository;
import com.curso.services.exceptions.DataIntegrityViolationException;
import com.curso.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MetaFinanceiraService {

    @Autowired
    private MetaFinanceiraRepository metaFinanceiraRepo;

    public List<MetaFinanceiraDTO> findAll(){
        return metaFinanceiraRepo.findAll().stream()
                .map(obj -> new MetaFinanceiraDTO(obj))
                .collect(Collectors.toList());
    }

    public MetaFinanceira findbyId(Long id){
        Optional<MetaFinanceira> obj = metaFinanceiraRepo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("MetaFinanceira não encontrado! ID: "+ id));
    }

    public MetaFinanceira create(MetaFinanceiraDTO dto){
        dto.setId(null);
        validacMeta(dto);
        MetaFinanceira obj = new MetaFinanceira(dto);
        return metaFinanceiraRepo.save(obj);
    }

    public MetaFinanceira update(Long id, MetaFinanceiraDTO objDto){
        objDto.setId(id);
        validacMeta(objDto);
        MetaFinanceira oldObj = findbyId(id);
        oldObj = new MetaFinanceira(objDto);
        return metaFinanceiraRepo.save(oldObj);
    }

    public void delete(Long id) {
        MetaFinanceira metaFinanceira = findbyId(id);

        if (!metaFinanceira.getContas().isEmpty()) {
            String contasVinculadas = metaFinanceira.getContas().stream()
                    .map(conta -> "ID: " + conta.getId() + " - Descrição: " + conta.getDescricao())
                    .collect(Collectors.joining(", "));

            throw new DataIntegrityViolationException(
                    "Não foi possível excluir a meta financeira, pois já existe uma conta vinculada a ela: [" + contasVinculadas + "]"
            );
        }

        metaFinanceiraRepo.deleteById(id);
    }

    private void validacMeta(MetaFinanceiraDTO dto) {
        if (dto.getDescricaoMeta() == null || dto.getDescricaoMeta().trim().isEmpty()) {
            throw new DataIntegrityViolationException("Descrição não informada.");
        }

        Optional<MetaFinanceira> obj = metaFinanceiraRepo.findByDescricaoMeta(dto.getDescricaoMeta());
        obj.ifPresent(metaExistente -> {
            if (dto.getId() == null || !dto.getId().equals(metaExistente.getId())) {
                throw new DataIntegrityViolationException(
                        "Já existe uma Meta Financeira com a descrição: " + metaExistente.getDescricaoMeta()
                                + " - ID: " + metaExistente.getId()
                );
            }
        });
    }


}
