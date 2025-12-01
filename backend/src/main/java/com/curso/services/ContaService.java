package com.curso.services;

import com.curso.domains.Conta;
import com.curso.domains.dtos.ContaDTO;
import com.curso.repositories.ContaRepository;
import com.curso.services.exceptions.DataIntegrityViolationException;
import com.curso.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContaService {

    @Autowired
    private ContaRepository contaRepo;

    public List<ContaDTO> findAll(){
        return contaRepo.findAll().stream()
                .map(obj -> new ContaDTO(obj))
                .collect(Collectors.toList());
    }

    public Conta findbyId(Long id){
        Optional<Conta> obj = contaRepo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Conta não encontrado! ID: "+ id));
    }

    public Conta create(ContaDTO dto){
        dto.setId(null);
        validaConta(dto, false);
        Conta obj = new Conta(dto);
        return contaRepo.save(obj);
    }

    public Conta update(Long id, ContaDTO objDto){
        objDto.setId(id);
        validaConta(objDto, true);
        Conta oldObj = findbyId(id);
        oldObj = new Conta(objDto);
        return contaRepo.save(oldObj);
    }

    public void delete(Long id) {
        Conta conta = findbyId(id);

        if (conta.getSaldo() != null && conta.getSaldo().compareTo(BigDecimal.ZERO) != 0) {
            throw new DataIntegrityViolationException(
                    "Não foi possível excluir a conta, pois ela possui saldo diferente de zero."
            );
        }

        if (!conta.getLancamentos().isEmpty()) {
            String lancamentosInfo = conta.getLancamentos().stream()
                    .map(l -> "ID: " + l.getId() + " - Descrição: " + l.getDescricao())
                    .collect(Collectors.joining(", "));

            throw new DataIntegrityViolationException(
                    "Não foi possível excluir a conta, pois já existe um lançamento vinculado a ela: [" + lancamentosInfo + "]"
            );
        }

        contaRepo.deleteById(id);
    }

    private void validaConta(ContaDTO dto, boolean isUpdate) {
        if (dto.getBanco() == null) {
            throw new DataIntegrityViolationException("Banco não informado.");
        }

        if (dto.getUsuario() == null) {
            throw new DataIntegrityViolationException("Usuario não informado.");
        }

        if (dto.getMetaFinanceira() == null) {
            throw new DataIntegrityViolationException("Meta Financeira não informada.");
        }

        if (dto.getLimite() == null || dto.getLimite().compareTo(BigDecimal.ZERO) < 0) {
            throw new DataIntegrityViolationException("O Limite não pode ser negativo.");
        }

        if (!isUpdate) {
            if (dto.getSaldo() == null || dto.getSaldo().compareTo(BigDecimal.ZERO) < 0) {
                throw new DataIntegrityViolationException("O Saldo não pode ser negativo na criação da conta.");
            }
        }


        contaRepo.findByDescricaoAndUsuarioId(dto.getDescricao(), dto.getUsuario().getId())
                .ifPresent(contaExistente -> {
                    if (dto.getId() == null || !dto.getId().equals(contaExistente.getId())) {
                        throw new DataIntegrityViolationException(
                                "Já existe uma conta cadastrada com essa descrição: " + contaExistente.getDescricao()
                                        + " - ID: " + contaExistente.getId()
                        );
                    }
                });
    }


}
