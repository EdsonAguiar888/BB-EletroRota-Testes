// validacoes.jsx

/**
 * Valida os dados do formulário de veículos
 * @param {Object} formData - Dados vindos do estado do formulário
 * @returns {Object} Um objeto contendo os erros encontrados. Se vazio, os dados são válidos.
 */
export function validarFormularioVeiculo(formData) {
  const erros = {};

  // 1. Validação da Marca: Qualquer caractere, entre 1 e 10 de tamanho
  const marcaTrim = formData.marca ? formData.marca.trim() : '';
  if (marcaTrim.length < 1 || marcaTrim.length > 20) {
    erros.marca = 'A marca do veículo deve conter entre 5 e 25 caracteres.';
  }

  // 2. Validação da Potência: Até 4 números (Apenas dígitos, tamanho de 1 a 3)
  // Regex: ^\d{1,4}$ garante que são apenas números e no máximo 4 dígitos
  const regexPotencia = /^\d{1,4}$/;

  if (!regexPotencia.test(formData.potencia)) {
    erros.potencia = 'A potência deve conter apenas números (no máximo 4 dígitos).';
  }

  // 3. Validação da Bateria: Apenas de 1 a 100 números
  // Regex: ^\d{2}$ garante que são exatamente de 1 a 100 dígitos numéricos
  const regexBateria = /^(?:[1-9][0-9]?|100)$/;
  //   const regexBateria = /^\d{1,2}$/;

  if (!regexBateria.test(formData.bateriaAtual)) {
    erros.bateria = 'O valor da bateria deve conter apenas números de (1 a 100).';
  }

  return erros;
}







/**
* Valida os dados de Login e Cadastro
* @param {Object} formData - Dados de nome, email e senha
* @param {Boolean} isLogin - Flag se está na tela de login ou cadastro
*/
export function validarAuth(formData, isLogin) {
  const erros = {};

  // 1. Validação do Nome (Apenas se for Cadastro)
  if (!isLogin) {
    const nomeTrim = formData.nome ? formData.nome.trim() : '';
    if (nomeTrim.length < 8 || nomeTrim.length > 40) {
      erros.nome = 'Digite Nome e Sobrenome (deve conter acima 8 caracteres).';
    }
  }

  // 2. Validação do E-mail (Formato regex válido e limite de 18 caracteres)
  const emailTrim = formData.email ? formData.email.trim() : '';
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailTrim.length > 30) {
    erros.email = 'O e-mail não pode passar de 30 caracteres.';
  } else if (!regexEmail.test(emailTrim)) {
    erros.email = 'Insira um e-mail válido (ex: email@email.com).';
  }

  // 3. Validação da Senha (Máximo 6 dígitos)
  if (formData.senha.length > 6) {
    erros.senha = 'A senha deve ter no máximo 6 dígitos.';
  }

  return erros;
}





/**
 * Valida os dados mistos de Perfil e Veículo na edição de perfil
 * @param {Object} formData - Dados de nome, email, marca, potencia e bateria
 */
export function validarPerfilVeiculo(formData) {
  const erros = {};

  // 1. Nome: 8 a 40 caracteres
  const nomeTrim = formData.nome ? formData.nome.trim() : '';
  if (nomeTrim.length < 8 || nomeTrim.length > 40) {
    erros.nome = 'Digite Nome e Sobrenome (deve conter acima 8 caracteres).';
  }

  // 2. Email: formato de email e até 18 caracteres
  const emailTrim = formData.email ? formData.email.trim() : '';
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailTrim.length > 30) {
    erros.email = 'O e-mail não pode passar de 30 caracteres.';
  } else if (!regexEmail.test(emailTrim)) {
    erros.email = 'Insira um e-mail válido (ex: email@email.com).';
  }

  // 3. Modelo/Marca: Qualquer caractere, contendo entre 1 e 10 caracteres
  const marcaTrim = formData.marca ? formData.marca.trim() : '';
  if (marcaTrim.length < 1 || marcaTrim.length > 20) {
    erros.marca = 'O modelo deve conter entre 1 e 25 caracteres.';
  }

  // 4. Potência: Até 3 números
  const regexPotencia = /^\d{1,4}$/;
  if (!regexPotencia.test(formData.potencia)) {
    erros.potencia = 'A potência deve conter apenas números (no máximo 4 dígitos).';
  }

  // 5. Bateria Atual: Apenas 2 números
  const regexBateria = /^(?:[1-9][0-9]?|100)$/;
  // const regexBateria = /^\d{2}$/;

  if (!regexBateria.test(formData.bateriaAtual)) {
    erros.bateria = 'O valor da bateria deve conter apenas números de (1 a 100).';
  }

  return erros;
}

/**
 * Verifica se o e-mail já está cadastrado na lista de usuários
 * @param {string} email - E-mail normalizado (minúsculas, sem espaços)
 * @param {Array} usuarios - Lista retornada pela API
 */
export function emailJaCadastrado(email, usuarios) {
  if (!email || !Array.isArray(usuarios)) return false;
  const alvo = email.toLowerCase().trim();
  return usuarios.some((u) => (u.email || '').toLowerCase().trim() === alvo);
}



