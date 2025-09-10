// src/abrigo-animais.js

export { AbrigoAnimais as AbrigoAnimais };

// Dados dos animais e seus brinquedos favoritos
const dadosAnimais = {
  'Rex': { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
  'Mimi': { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
  'Fofo': { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
  'Zero': { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
  'Bola': { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
  'Bebe': { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
  'Loco': { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
};

// Conjunto de todos os brinquedos válidos
const brinquedosValidos = new Set();
for (const animal in dadosAnimais) {
  dadosAnimais[animal].brinquedos.forEach(brinquedo => brinquedosValidos.add(brinquedo));
}

class AbrigoAnimais {
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    // Converte as strings de entrada em arrays
    const brinquedos1 = brinquedosPessoa1.split(',').map(item => item.trim());
    const brinquedos2 = brinquedosPessoa2.split(',').map(item => item.trim());
    const animais = ordemAnimais.split(',').map(item => item.trim());

    // Valida os brinquedos
    if (!this.saoBrinquedosValidos(brinquedos1) || !this.saoBrinquedosValidos(brinquedos2)) {
      return { erro: 'Brinquedo inválido' };
    }

    // Valida os animais
    if (!this.saoAnimaisValidos(animais)) {
      return { erro: 'Animal inválido' };
    }

    // Listas para armazenar os animais adotados
    let animaisPessoa1 = [];
    let animaisPessoa2 = [];
    let animaisAbrigo = [];

    // Processa cada animal na ordem fornecida
    for (const nomeAnimal of animais) {
      const animal = dadosAnimais[nomeAnimal];
      const brinquedosFavoritos = animal.brinquedos;
      const tipo = animal.tipo;

      // Verifica se cada pessoa pode adotar o animal
      let pessoa1PodeAdotar = false;
      if (animaisPessoa1.length < 3) {
        pessoa1PodeAdotar = this.podeAdotar(nomeAnimal, tipo, brinquedosFavoritos, brinquedos1, animaisPessoa1);
      }

      let pessoa2PodeAdotar = false;
      if (animaisPessoa2.length < 3) {
        pessoa2PodeAdotar = this.podeAdotar(nomeAnimal, tipo, brinquedosFavoritos, brinquedos2, animaisPessoa2);
      }

      // Aplica as regras de adoção
      if (pessoa1PodeAdotar && pessoa2PodeAdotar) {
        // Se ambas podem adotar, ninguém fica com o animal
        animaisAbrigo.push(nomeAnimal);
      } else if (pessoa1PodeAdotar) {
        animaisPessoa1.push(nomeAnimal);
      } else if (pessoa2PodeAdotar) {
        animaisPessoa2.push(nomeAnimal);
      } else {
        animaisAbrigo.push(nomeAnimal);
      }
    }

    // Gera a lista de resultados
    const todosAnimais = [...animaisPessoa1, ...animaisPessoa2, ...animaisAbrigo];
    const listaResultado = todosAnimais.map(animal => {
      if (animaisPessoa1.includes(animal)) {
        return `${animal} - pessoa 1`;
      } else if (animaisPessoa2.includes(animal)) {
        return `${animal} - pessoa 2`;
      } else {
        return `${animal} - abrigo`;
      }
    }).sort(); // Ordena alfabeticamente

    return { lista: listaResultado };
  }

  // Valida se os brinquedos são válidos (não duplicados e conhecidos)
  saoBrinquedosValidos(brinquedos) {
    const visto = new Set();
    for (const brinquedo of brinquedos) {
      if (visto.has(brinquedo)) {
        return false;
      }
      visto.add(brinquedo);
      // Check if toy is valid
      if (!brinquedosValidos.has(brinquedo)) {
        return false;
      }
    }
    return true;
  }

  // Valida se os animais são válidos (não duplicados e conhecidos)
  saoAnimaisValidos(animais) {
    const visto = new Set();
    for (const animal of animais) {
      if (visto.has(animal)) {
        return false;
      }
      visto.add(animal);
      if (!dadosAnimais.hasOwnProperty(animal)) {
        return false;
      }
    }
    return true;
  }

  // Verifica se uma pessoa pode adotar um animal com base nas regras
  podeAdotar(nomeAnimal, tipo, brinquedosFavoritos, brinquedosPessoa, animaisAdotados) {
    if (tipo === 'gato') {
      // Gatos exigem apenas subsequência (não contígua)
      return this.verificarSubsequencia(brinquedosPessoa, brinquedosFavoritos);
    } else if (nomeAnimal === 'Loco') {
      if (animaisAdotados.length > 0) {
        // Com companhia: não importa a ordem, apenas precisa ter os brinquedos
        return this.verificarContemTodos(brinquedosPessoa, brinquedosFavoritos);
      } else {
        // Sem companhia: precisa seguir a ordem
        return this.verificarSubsequencia(brinquedosPessoa, brinquedosFavoritos);
      }
    } else {
      // Para outros animais, verifica subsequência
      return this.verificarSubsequencia(brinquedosPessoa, brinquedosFavoritos);
    }
  }

  // Verifica se os brinquedos favoritos aparecem em ordem na sequência da pessoa
  verificarSubsequencia(sequencia, sub) {
    let indice = 0;
    for (const item of sequencia) {
      if (indice < sub.length && item === sub[indice]) {
        indice++;
      }
    }
    return indice === sub.length;
  }

  // Verifica se os brinquedos favoritos aparecem em ordem e contíguos
  verificarSequenciaContinua(sequencia, sub) {
    if (sub.length === 0) return true;
    for (let i = 0; i <= sequencia.length - sub.length; i++) {
      if (sub.every((brinquedo, j) => sequencia[i + j] === brinquedo)) {
        return true;
      }
    }
    return false;
  }

  // Verifica se a pessoa tem todos os brinquedos favoritos (qualquer ordem)
  verificarContemTodos(sequencia, brinquedos) {
    return brinquedos.every(brinquedo => sequencia.includes(brinquedo));
  }
}