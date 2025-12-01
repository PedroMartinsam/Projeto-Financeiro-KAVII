package com.curso.services;

import com.curso.domains.Banco;
import com.curso.domains.dtos.BancoDTO;
import com.curso.repositories.BancoRepository;
import com.curso.services.exceptions.DataIntegrityViolationException;
import com.curso.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BancoService {

    @Autowired
    private BancoRepository bancoRepo;

    public List<BancoDTO> findAll(){
        return bancoRepo.findAll().stream()
                .map(obj -> new BancoDTO(obj))
                .collect(Collectors.toList());
    }

    public Banco findbyId(Long id){
        Optional<Banco> obj = bancoRepo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Banco não encontrado! ID: "+ id));
    }

    public Banco create(BancoDTO dto){
        dto.setId(null);
        validaRazao(dto);
        Banco obj = new Banco(dto);
        return bancoRepo.save(obj);
    }

    public Banco update(Long id, BancoDTO objDto){
        objDto.setId(id);
        validaRazao(objDto);
        Banco oldObj = findbyId(id);
        oldObj = new Banco(objDto);
        return bancoRepo.save(oldObj);
    }

    public void delete(Long id) {
        Banco banco = findbyId(id);

        if (!banco.getContas().isEmpty()) {
            String contasVinculadas = banco.getContas().stream()
                    .map(conta -> "ID: " + conta.getId() + " - Descrição: " + conta.getDescricao())
                    .collect(Collectors.joining(", "));

            throw new DataIntegrityViolationException(
                    "Não foi possível excluir o banco, pois já existem contas vinculadas a ele: [" + contasVinculadas + "]"
            );
        }

        bancoRepo.deleteById(id);
    }

    private void validaRazao(BancoDTO dto) {
        Optional<Banco> obj = bancoRepo.findByRazaoSocial(dto.getRazaoSocial());
        obj.ifPresent(bancoExistente -> {
            if (dto.getId() == null || !dto.getId().equals(bancoExistente.getId())) {
                throw new DataIntegrityViolationException(
                        "Razão social já cadastrada. ID : " + bancoExistente.getId()
                                + " - Razão Social: " + bancoExistente.getRazaoSocial()
                );
            }
        });
    }


}
