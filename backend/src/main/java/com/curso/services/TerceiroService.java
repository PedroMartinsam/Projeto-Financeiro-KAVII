package com.curso.services;

import com.curso.domains.Terceiro;
import com.curso.domains.dtos.TerceiroDTO;
import com.curso.repositories.TerceiroRepository;
import com.curso.services.exceptions.DataIntegrityViolationException;
import com.curso.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TerceiroService {

    @Autowired
    private TerceiroRepository terceiroRepo;

    public List<TerceiroDTO> findAll(){
        return terceiroRepo.findAll().stream()
                .map(obj -> new TerceiroDTO(obj))
                .collect(Collectors.toList());
    }

    public Terceiro findbyId(Long id){
        Optional<Terceiro> obj = terceiroRepo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Terceiro não encontrado! ID: "+ id));
    }

    public Terceiro create(TerceiroDTO dto){
        dto.setId(null);
        validarazaoS(dto);
        Terceiro obj = new Terceiro(dto);
        return terceiroRepo.save(obj);
    }

    public Terceiro update(Long id, TerceiroDTO objDto){
        objDto.setId(id);
        validarazaoS(objDto);
        Terceiro oldObj = findbyId(id);
        oldObj = new Terceiro(objDto);
        return terceiroRepo.save(oldObj);
    }

    public void delete(Long id) {
        Terceiro terceiro = findbyId(id);

        if (!terceiro.getLancamentos().isEmpty()) {
            String lancamentosInfo = terceiro.getLancamentos().stream()
                    .map(l -> "ID: " + l.getId() + " - Descrição: " + l.getDescricao())
                    .collect(Collectors.joining(", "));

            throw new DataIntegrityViolationException(
                    "Não foi possível excluir o terceiro, pois existe pelo menos um lançamento vinculado. "
                            + "Lançamentos: [" + lancamentosInfo + "]"
            );
        }

        terceiroRepo.deleteById(id);
    }

    private void validarazaoS(TerceiroDTO dto) {
        Optional<Terceiro> obj = terceiroRepo.findByRazaoSocial(dto.getRazaoSocial());
        obj.ifPresent(terceiroExistente -> {
            if (dto.getId() == null || !dto.getId().equals(terceiroExistente.getId())) {
                throw new DataIntegrityViolationException(
                        "Razão social já cadastrada. ID: " + terceiroExistente.getId()
                                + " - Razão Social: " + terceiroExistente.getRazaoSocial()
                );
            }
        });
    }

}
