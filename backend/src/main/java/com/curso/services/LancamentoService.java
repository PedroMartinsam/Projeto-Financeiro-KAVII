package com.curso.services;

import com.curso.domains.Lancamento;
import com.curso.domains.dtos.LancamentoDTO;
import com.curso.domains.enums.Situacao;
import com.curso.repositories.LancamentoRepository;
import com.curso.services.exceptions.DataIntegrityViolationException;
import com.curso.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LancamentoService {

    @Autowired
    private LancamentoRepository lancamentoRepo;

    public List<LancamentoDTO> findAll(){
        return lancamentoRepo.findAll().stream()
                .map(obj -> new LancamentoDTO(obj))
                .collect(Collectors.toList());
    }

    public Lancamento findbyId(Long id){
        Optional<Lancamento> obj = lancamentoRepo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Lancamento não encontrado! ID: "+ id));
    }

    public Lancamento create(LancamentoDTO dto){
        dto.setId(null);
        validaLancamento(dto);
        Lancamento obj = new Lancamento(dto);
        return lancamentoRepo.save(obj);
    }

    public Lancamento update(Long id, LancamentoDTO objDto){
        objDto.setId(id);
        validaLancamento(objDto);

        if (objDto.getSituacao().equalsIgnoreCase("BAIXADO")) {
            objDto.setDataBaixa(LocalDate.now());
        }

        Lancamento oldObj = findbyId(id);

        oldObj = new Lancamento(objDto);

        return lancamentoRepo.save(oldObj);
    }


    public void delete(Long id) {
        Lancamento obj = findbyId(id);

        if (obj.getSituacao() != Situacao.BAIXADO) {
            throw new DataIntegrityViolationException(
                    "Não é possível excluir um lançamento que não está baixado."
            );
        }

        lancamentoRepo.deleteById(id);
    }


    private void validaLancamento(LancamentoDTO dto) {

        if (dto.getConta() == null) {
            throw new DataIntegrityViolationException("Conta não informada.");
        }

        if (dto.getTerceiro() == null) {
            throw new DataIntegrityViolationException("Terceiro não informado.");
        }

        if (dto.getCentroCusto() == null) {
            throw new DataIntegrityViolationException("Centro de Custo não informado.");
        }
    }

}
