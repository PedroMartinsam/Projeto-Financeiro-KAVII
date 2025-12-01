package com.curso.services;

import com.curso.domains.Conta;
import com.curso.domains.Lancamento;
import com.curso.domains.Usuario;
import com.curso.domains.dtos.UsuarioDTO;
import com.curso.repositories.LancamentoRepository;
import com.curso.repositories.UsuarioRepository;
import com.curso.services.exceptions.DataIntegrityViolationException;
import com.curso.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private LancamentoRepository lancamentoRepo;

    public UsuarioService(UsuarioRepository repo, PasswordEncoder encoder) {
        this.usuarioRepo = repo;
        this.encoder = encoder;
    }

    public List<UsuarioDTO> findAll(){
        return usuarioRepo.findAll().stream()
                .map(UsuarioDTO::new)
                .collect(Collectors.toList());
    }

    public Usuario findbyId(Long id){
        Optional<Usuario> obj = usuarioRepo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Usuario não encontrado! ID: " + id));
    }

    public Usuario create(UsuarioDTO dto){
        dto.setId(null);

        validateEmail(dto.getEmail());

        if (dto.getSenha() == null || dto.getSenha().isBlank()) {
            throw new DataIntegrityViolationException("A senha é obrigatória para criar um usuário.");
        }

        Usuario obj = new Usuario(dto);
        obj.setSenha(encoder.encode(obj.getSenha()));

        return usuarioRepo.save(obj);
    }


    public Usuario update(Long id, UsuarioDTO objDto){
        objDto.setId(id);

        if (objDto.getSenha() == null || objDto.getSenha().isBlank()) {
            throw new DataIntegrityViolationException("Para atualizar o usuário, a senha é obrigatória.");
        }

        Usuario oldObj = findbyId(id);
        validateEmail(objDto.getEmail(), id);

        oldObj = new Usuario(objDto);
        oldObj.setSenha(encoder.encode(oldObj.getSenha()));

        return usuarioRepo.save(oldObj);
    }


    public void delete(Long id) {
        Usuario usuario = findbyId(id);

        List<Conta> contas = usuario.getContas();

        if (!contas.isEmpty()) {

            String contasInfo = contas.stream()
                    .map(c -> "ID: " + c.getId() + " | Conta: " + c.getDescricao())
                    .collect(Collectors.joining("; "));

            throw new DataIntegrityViolationException(
                    "Não foi possível excluir o usuário pois existem contas vinculadas a ele. "
                            + "Contas encontradas: " + contasInfo
            );
        }

        usuarioRepo.deleteById(id);
    }

    private void validateEmail(String email) {
        Optional<Usuario> obj = usuarioRepo.findByEmail(email);
        if(obj.isPresent()) {
            throw new DataIntegrityViolationException("Email já cadastrado: " + email);
        }
    }

    private void validateEmail(String email, Long id) {
        Optional<Usuario> obj = usuarioRepo.findByEmail(email);
        if(obj.isPresent() && !obj.get().getId().equals(id)) {
            throw new DataIntegrityViolationException("Email já cadastrado: " + email);
        }
    }
}
