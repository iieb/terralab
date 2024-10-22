// Função para obter o valor do cookie com base no nome
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Verifica se o cookie começa com o nome desejado
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Substitua as URLs do Django por variáveis globais
const loadComponentesUrl = window.loadComponentesUrl || '/url/para/load_componentes/';
const loadequipesUrl = window.loadequipesUrl || '/url/para/load_equipes/';
const loadequipesadicionaisUrl = window.loadequipesadicionaisUrl || '/url/para/load_equipes_adicionais/';
const loadatividadesUrl = window.loadatividadesUrl || '/url/para/load_atividades/';
const loadindicadoresUrl = window.loadindicadoresUrl || '/url/para/load_indicadores/';
const atualizarSituacaoPlanoUrl = window.atualizarSituacaoPlanoUrl || '/url/para/atualizar_situacao_plano/';
const adicionarplanoUrl = window.adicionarplanoUrl || '/url/para/adicionar_plano/';

// DICIONÁRIO DE CONFIGURAÇÃO DOS INDICADORES
// Nova forma de obter o dicionário diretamente do backend
//console.log(document.getElementById('indicadores-config').textContent); // Adicione esta linha
//const indicadoresConfig = JSON.parse(document.getElementById('indicadores-config').textContent);

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('id_projeto').addEventListener('change', function() {
        var url = loadComponentesUrl + "?projeto=" + this.value;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                var select = document.getElementById('id_componente');
                select.innerHTML = '<option value="">Selecione um componente</option>';
                data.forEach(item => {
                    select.innerHTML += '<option value="' + item.id + '">' + item.nome + '</option>';
                });
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

        var equipes_url = loadequipesUrl + "?projeto=" + this.value;
        fetch(equipes_url)
            .then(response => response.json())
            .then(data => {
                var select = document.getElementById('id_equipe_projeto');
                select.innerHTML = '<option value="">Selecione uma equipe</option>';
                data.forEach(item => {
                    select.innerHTML += '<option value="' + item.id + '">' + item.nome + '</option>';
                });
            });

        var equipes_adicionais_url = loadequipesadicionaisUrl + "?projeto=" + this.value;
        fetch(equipes_adicionais_url)
            .then(response => response.json())
            .then(data => {
                var checkboxGroup = document.getElementById('id_equipe_adicional');
                checkboxGroup.innerHTML = '';
                data.forEach(item => {
                    checkboxGroup.innerHTML += '<label><input type="checkbox" name="equipe_adicional" value="' + item.id + '"> ' + item.nome + '</label>';
                
                });
            });
    });
    
    document.getElementById('id_componente').addEventListener('change', function() {
        var url = loadatividadesUrl + "?componente=" + this.value;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                var select = document.getElementById('id_atividade');
                select.innerHTML = '<option value="">Selecione uma atividade</option>';
                data.forEach(item => {
                    select.innerHTML += '<option value="' + item.id + '">' + item.nome + '</option>';
                });
            });
    });
    // Função para validar campos obrigatórios
    function validateField(field) {
        if (field.value.trim() === "") {
            field.classList.remove('valid');
            field.classList.add('invalid');
        } else {
            field.classList.remove('invalid');
            field.classList.add('valid');
        }
    }

    function validateDates() {
        const startDateField = document.getElementById('id_data_inicio');
        const endDateField = document.getElementById('id_data_final');
        const startDate = new Date(startDateField.value);
        const endDate = new Date(endDateField.value);

        if (startDateField.value && endDateField.value) {
            if (endDate < startDate) {
                endDateField.classList.remove('valid');
                endDateField.classList.add('invalid');
                alert("A data final não pode ser anterior à data inicial.");
            } else {
                endDateField.classList.remove('invalid');
                endDateField.classList.add('valid');
            }
        }
    }

    
    // Campos de Informações Obrigatórias
    const requiredFields = [
        document.getElementById('id_projeto'),
        document.getElementById('id_componente'),
        document.getElementById('id_atividade'),
        document.getElementById('id_equipe_projeto'),
        document.getElementById('id_data_inicio'),
        document.getElementById('id_data_final'),
        document.getElementById('id_descricao'),
        document.getElementById('id_local')
    ];

    requiredFields.forEach(field => {
        field.addEventListener('input', function () {
            validateField(field);
            if (field === document.getElementById('id_data_inicio') || field === document.getElementById('id_data_final')) {
                validateDates();
            }
        });

        // Validação inicial ao carregar a página
        validateField(field);
        if (field === document.getElementById('id_data_inicio') || field === document.getElementById('id_data_final')) {
            validateDates();
        }
    });
    function renderCheckboxField(field, fieldName, indicadoresDiv) {
        let optionsHTML = '';
        field.options.forEach(option => {
            optionsHTML += `
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <input type="checkbox" id="${fieldName}_${option.value}" name="${fieldName}" value="${option.value}" style="margin-right: 5px;">
                    <label for="${fieldName}_${option.value}" style="font-size: 14px;">${option.label}</label>
                </div>
            `;
        });
        indicadoresDiv.innerHTML += `
            <div>
                <label>${field.label}:</label>
                ${optionsHTML}
            </div>
        `;
    }

    // Função para renderizar a seção de Parcerias
    function renderParceriasField(field, fieldName, indicadoresDiv) {
        console.log('Renderizando campo de Parcerias...');
        let optionsHTML = '';
        field.options.forEach(option => {
            optionsHTML += `
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <input type="checkbox" id="${fieldName}_${option.value}" name="${fieldName}" value="${option.value}" style="margin-right: 5px;">
                    <label for="${fieldName}_${option.value}" style="font-size: 14px;">${option.label}</label>
                </div>
            `;
        });
    
        indicadoresDiv.innerHTML += `
            <div>
                <h3>Selecione a parceria relacionada a atividade:</h3>
            </div>
            <div>
                <label>${field.label}:</label>
                ${optionsHTML}
                <h3>Não encontrou a Parceria que deseja relatar?</h3>
                <h5>Adicione uma nova logo abaixo:</h5>
                <input type="text2" id="${fieldName}_new_nome" placeholder="Nova Parceria">
                <input type="text2" id="${fieldName}_new_tipo" placeholder="Tipo de Parceria">
                <button type="button" class="custom-add-btn" id="${fieldName}_add_btn">Adicionar Nova Parceria</button>
            </div>
        `;
    
        // Associar corretamente o evento de clique ao botão após ele ser inserido no DOM
        setTimeout(function() {
            const addButton = document.getElementById(`${fieldName}_add_btn`);
            if (addButton) {
                addButton.addEventListener('click', function() {
                    console.log("Botão de adicionar parceria clicado");
                    const nome = document.getElementById(`${fieldName}_new_nome`).value;
                    const tipo = document.getElementById(`${fieldName}_new_tipo`).value;
    
                    if (nome && tipo) {
                        adicionarNovaParceria(nome, tipo, fieldName);
                    } else {
                        alert('Preencha todos os campos.');
                    }
                });
            } else {
                console.error("Botão de adicionar parceria não encontrado");
            }
        }, 1000);  // Pequeno delay para garantir que o botão foi renderizado no DOM
    }

    // Função para adicionar uma nova parceria ao backend
    function adicionarNovaParceria(nome, tipo, fieldName) {
        fetch(getAdicionarParceiraUrl(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie('csrftoken')
            },
            body: JSON.stringify({ nome: nome, tipo: tipo })
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                console.log("Nova parceria adicionada com sucesso", data);
                // Adiciona a nova parceria na lista de checkboxes
                const newCheckboxHTML = `
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <input type="checkbox" id="${fieldName}_${data.id}" name="${fieldName}" value="${data.id}" style="margin-right: 5px;" checked>
                        <label for="${fieldName}_${data.id}" style="font-size: 14px;">${data.nome} - ${data.tipo}</label>
                    </div>
                `;
                document.querySelector(`#${fieldName}_new_nome`).insertAdjacentHTML('beforebegin', newCheckboxHTML);
                document.getElementById(`${fieldName}_new_nome`).value = '';
                document.getElementById(`${fieldName}_new_tipo`).value = '';
            } else {
                console.error("Erro ao adicionar nova parceria");
            }
        })
        .catch(error => {
            console.error('Erro ao realizar a requisição:', error);
        });
    }

    function renderPlanosField(field, fieldName, indicadoresDiv) {
        console.log('Renderizando campo de Planos...');
        
        let optionsHTML = '';
        field.options.forEach(option => {
            optionsHTML += `
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <input type="checkbox" id="${fieldName}_${option.value}" name="${fieldName}" value="${option.value}" style="margin-right: 5px;">
                    <label for="${fieldName}_${option.value}" style="font-size: 14px;">${option.label}</label>
                    <select id="situacao_${option.value}" name="nova_situacao" class="small-select" style="margin-left: 10px;">
                        <option value="em desenvolvimento">Em Desenvolvimento</option>
                        <option value="proposto">Proposto</option>
                        <option value="adotado">Adotado</option>
                        <option value="implementado">Implementado</option>
                    </select>
                    <button type="button" class="custom-add-btn" style="margin-left: 10px;" onclick="atualizarSituacaoPlano(${option.value}, document.getElementById('situacao_${option.value}').value, '${fieldName}')">Atualizar Situação</button>
                </div>
            `;
        });

        indicadoresDiv.innerHTML += `
            <div>
                <h3>Selecione o plano relacionado a atividade:</h3>
                <h5>Se precisar atualizar a situação de um plano: escolha a nova situação, aperte 'atualizar situação' e depois selecione o plano para relaciona-lo ao atual registro de atividade!</h5>
            </div>
            <div>
                <label>${field.label}:</label>
                ${optionsHTML}
                <h3>Não encontrou o Plano que deseja relatar?</h3>
                <h5>Adicione um novo logo abaixo:</h5>
                <input type="text2" id="${fieldName}_new_nome" placeholder="Nome do Plano">
                <select id="${fieldName}_new_tipo" class="small-select">
                    <option value="">Selecione o Tipo</option>
                    <option value="PGTA">PGTA</option>
                    <option value="Plano de Enfrentamento">Plano de Enfrentamento</option>
                    <option value="Plano de Diagnóstico">Plano de Diagnóstico</option>
                </select>
                <select id="${fieldName}_new_situacao" class="small-select">
                    <option value="">Selecione a Situação</option>
                    <option value="em desenvolvimento">Em Desenvolvimento</option>
                    <option value="proposto">Proposto</option>
                    <option value="adotado">Adotado</option>
                    <option value="implementado">Implementado</option>
                </select>
                <button type="button" class="custom-add-btn" id="${fieldName}_add_btn">Adicionar Novo Plano</button>
            </div>
        `;

        setTimeout(function() {
            const addButton = document.getElementById(`${fieldName}_add_btn`);
            if (addButton) {
                addButton.addEventListener('click', function() {
                    const nome = document.getElementById(`${fieldName}_new_nome`).value;
                    const tipo = document.getElementById(`${fieldName}_new_tipo`).value;
                    const situacao = document.getElementById(`${fieldName}_new_situacao`).value;
    
                    if (nome && tipo && situacao) {
                        adicionarNovoPlano(nome, tipo, situacao, fieldName);
                    } else {
                        alert('Preencha todos os campos.');
                    }
                });
            }
        }, 500);  // Pequeno delay para garantir que o botão foi renderizado no DOM
    }

    window.atualizarSituacaoPlano = function(planoId, novaSituacao, fieldName) {
        fetch(getAtualizarEstadoContratoUrl(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie('csrftoken')
            },
            body: JSON.stringify({ plano_id: planoId, situacao: novaSituacao })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const label = document.querySelector(`#${fieldName}_${planoId} + label`);
                if (label) {
                    const currentLabel = label.innerText;
                    const newLabel = currentLabel.replace(/( - )(.*)$/, ` - ${novaSituacao}`);
                    label.innerText = newLabel;
                }
            }
        })
        .catch(error => {
            console.error("Erro ao realizar a requisição", error);
        });
    }
    
    function adicionarNovoPlano(nome, tipo, situacao, fieldName) {
        console.log(`Enviando dados: Nome=${nome}, Tipo=${tipo}, Situação=${situacao}`);
    
        fetch(adicionarplanoUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie('csrftoken')
            },
            body: JSON.stringify({ nome: nome, tipo: tipo, situacao: situacao })
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                console.log("Novo plano adicionado com sucesso", data);
                // Adicionar o novo plano na lista de checkboxes
                const newCheckboxHTML = `
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <input type="checkbox" id="${fieldName}_${data.id}" name="${fieldName}" value="${data.id}" style="margin-right: 5px;" checked>
                        <label for="${fieldName}_${data.id}" style="font-size: 14px;">${data.nome} - ${data.tipo} - ${data.situacao}</label>
                    </div>
                `;
                document.querySelector(`#${fieldName}_new_nome`).insertAdjacentHTML('beforebegin', newCheckboxHTML);
                document.getElementById(`${fieldName}_new_nome`).value = '';
                document.getElementById(`${fieldName}_new_tipo`).value = '';
                document.getElementById(`${fieldName}_new_situacao`).value = '';
            } else {
                console.error("Erro ao adicionar novo plano", data);
            }
        })
        .catch(error => {
            console.error('Erro ao realizar a requisição:', error);
        });
    }
            // Adicione esta função antes de usá-la
            function getProdutosOptionsData() {
                // Aqui você deve retornar os dados dos produtos
                // Por exemplo, você pode obter esses dados de um elemento HTML oculto
                // ou fazer uma chamada AJAX para obtê-los do servidor
                // Por enquanto, vamos retornar um array vazio como exemplo
                return [];
            }

            // Recuperar e analisar os dados de produtosOptions
            const produtosOptions = getProdutosOptionsData();

            function renderProdutosField(field, fieldName, indicadoresDiv) {
                console.log('Renderizando campo de Produtos...');
                let optionsHTML = '';
                field.options.forEach(option => {
                    optionsHTML += `
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <input type="checkbox" id="${fieldName}_${option.value}" name="${fieldName}" value="${option.value}" style="margin-right: 5px;">
                            <label for="${fieldName}_${option.value}" style="font-size: 14px;">${option.label}</label>
                        </div>
                    `;
                });

                indicadoresDiv.innerHTML += `
                    <div>
                        <label>${field.label}:</label>
                        ${optionsHTML}
                        <h3>Não encontrou o Produto que deseja relatar?</h3>
                        <h5>Adicione um novo logo abaixo:</h5>
                        <input type="text2" id="${fieldName}_new_nome" placeholder="Nome do Produto">
                        <button type="button" class="custom-add-btn" id="${fieldName}_add_btn">Adicionar Novo Produto</button>
                    </div>
                `;

                setTimeout(function() {
                    const addButton = document.getElementById(`${fieldName}_add_btn`);
                    if (addButton) {
                        addButton.addEventListener('click', function() {
                            const nome = document.getElementById(`${fieldName}_new_nome`).value;

                            if (nome) {
                                adicionarNovoProduto(nome, fieldName);
                            } else {
                                alert('Preencha o nome do produto.');
                            }
                        });
                    }
                }, 500);
            }

            function adicionarNovoProduto(nome, fieldName) {
                fetch(getAdicionarModeloUrl(), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie('csrftoken')
                    },
                    body: JSON.stringify({ nome: nome })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.id) {
                        console.log("Novo produto adicionado com sucesso", data);
                        const newCheckboxHTML = `
                            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                <input type="checkbox" id="${fieldName}_${data.id}" name="${fieldName}" value="${data.id}" style="margin-right: 5px;" checked>
                                <label for="${fieldName}_${data.id}" style="font-size: 14px;">${data.nome}</label>
                            </div>
                        `;
                        document.querySelector(`#${fieldName}_new_nome`).insertAdjacentHTML('beforebegin', newCheckboxHTML);
                        document.getElementById(`${fieldName}_new_nome`).value = '';
                    } else {
                        console.error("Erro ao adicionar novo produto");
                    }
                })
                .catch(error => {
                    console.error('Erro ao realizar a requisição:', error);
                });
            }



            function renderContratosField(field, fieldName, indicadoresDiv) {
                console.log('Renderizando campo de Contratos...');

                let optionsHTML = '';
                field.options.forEach(option => {
                    const optionId = option.value;
                    optionsHTML += `
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <input type="checkbox" id="${fieldName}_${optionId}" name="${fieldName}" value="${optionId}" style="margin-right: 5px;">
                            <label for="${fieldName}_${optionId}" style="font-size: 14px;">${option.label}</label>
                            <select id="estado_${optionId}" name="novo_estado" class="small-select" style="margin-left: 10px;">
                                <option value="alinhamento_realizado">Alinhamento Realizado</option>
                                <option value="em_desenvolvimento">Contrato em Desenvolvimento</option>
                                <option value="assinado">Contrato Assinado</option>
                            </select>
                            <button type="button" class="custom-add-btn" style="margin-left: 10px;" onclick="atualizarEstadoContrato(${optionId}, document.getElementById('estado_${optionId}').value, '${fieldName}')">Atualizar Estado</button>
                        </div>
                    `;
                });

                indicadoresDiv.innerHTML += `
                    <div>
                        <h3>Selecione o contrato relacionado à atividade:</h3>
                        <h5>Se precisar atualizar o estado de um contrato: escolha o novo estado, clique em 'Atualizar Estado' e depois selecione o contrato para relacioná-lo ao registro de atividade!</h5>
                    </div>
                    <div>
                        <label>${field.label}:</label>
                        ${optionsHTML}
                        <h3>Não encontrou o Contrato que deseja relatar?</h3>
                        <h5>Adicione um novo logo abaixo:</h5>
                        <input type="text2" id="${fieldName}_new_nome" placeholder="Nome do Contrato">
                        <select id="${fieldName}_new_estado" class="small-select">
                            <option value="">Selecione o Estado</option>
                            <option value="alinhamento_realizado">Alinhamento Realizado</option>
                            <option value="em_desenvolvimento">Contrato em Desenvolvimento</option>
                            <option value="assinado">Contrato Assinado</option>
                        </select>
                        <label>Selecione os Produtos Relacionados:</label>
                        <div id="${fieldName}_produtos" class="checkbox-group">
                            <!-- Opções de produtos serão adicionadas aqui -->
                        </div>
                        <button type="button" class="custom-add-btn" id="${fieldName}_add_btn">Adicionar Novo Contrato</button>
                    </div>
                `;

                // Carregar as opções de produtos
                let produtosHTML = '';
                produtosOptions.forEach(produto => {
                    produtosHTML += `
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <input type="checkbox" id="${fieldName}_produto_${produto.value}" name="${fieldName}_novo_contrato_produtos" value="${produto.value}" style="margin-right: 5px;">
                            <label for="${fieldName}_produto_${produto.value}" style="font-size: 14px;">${produto.label}</label>
                        </div>
                    `;
                });
                document.getElementById(`${fieldName}_produtos`).innerHTML = produtosHTML;

                setTimeout(function() {
                    const addButton = document.getElementById(`${fieldName}_add_btn`);
                    if (addButton) {
                        addButton.addEventListener('click', function() {
                            const nome = document.getElementById(`${fieldName}_new_nome`).value;
                            const estado = document.getElementById(`${fieldName}_new_estado`).value;
                            const produtosCheckboxes = document.querySelectorAll(`input[name="${fieldName}_novo_contrato_produtos"]:checked`);
                            const produtosIds = Array.from(produtosCheckboxes).map(cb => cb.value);

                            if (nome && estado) {
                                adicionarNovoContrato(nome, estado, produtosIds, fieldName);
                            } else {
                                alert('Preencha todos os campos.');
                            }
                        });
                    }
                }, 500);
            }

            window.atualizarEstadoContrato = function(contratoId, novoEstado, fieldName) {
                fetch(getAtualizarEstadoContratoUrl(), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie('csrftoken')
                    },
                    body: JSON.stringify({ contrato_id: contratoId, estado: novoEstado })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const label = document.querySelector(`#${fieldName}_${contratoId} + label`);
                        if (label) {
                            const currentLabel = label.innerText;
                            const newLabel = currentLabel.replace(/( - )(.*)$/, ` - ${novoEstado.replace('_', ' ')}`);
                            label.innerText = newLabel;
                        }
                    }
                })
                .catch(error => {
                    console.error("Erro ao realizar a requisição", error);
                });
            }

            function adicionarNovoContrato(nome, estado, produtosIds, fieldName) {
                fetch(getAdicionarContratoUrl(), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie('csrftoken')
                    },
                    body: JSON.stringify({ nome: nome, estado: estado, produtos: produtosIds })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.id) {
                        console.log("Novo contrato adicionado com sucesso", data);
                        const newCheckboxHTML = `
                            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                <input type="checkbox" id="${fieldName}_${data.id}" name="${fieldName}" value="${data.id}" style="margin-right: 5px;" checked>
                                <label for="${fieldName}_${data.id}" style="font-size: 14px;">${data.nome} - ${data.estado.replace('_', ' ')}</label>
                            </div>
                        `;
                        document.querySelector(`#${fieldName}_new_nome`).insertAdjacentHTML('beforebegin', newCheckboxHTML);
                        document.getElementById(`${fieldName}_new_nome`).value = '';
                        document.getElementById(`${fieldName}_new_estado`).value = '';
                        // Limpar checkboxes de produtos
                        const produtosCheckboxes = document.querySelectorAll(`input[name="${fieldName}_novo_contrato_produtos"]`);
                        produtosCheckboxes.forEach(cb => cb.checked = false);
                    } else {
                        console.error("Erro ao adicionar novo contrato", data);
                    }
                })
                .catch(error => {
                    console.error('Erro ao realizar a requisição:', error);
                });
            }

            function renderLeisField(field, fieldName, indicadoresDiv) {
                console.log('Renderizando campo de Leis...');

                let optionsHTML = '';
                field.options.forEach(option => {
                    const optionId = option.value;
                    optionsHTML += `
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <input type="checkbox" id="${fieldName}_${optionId}" name="${fieldName}" value="${optionId}" style="margin-right: 5px;">
                            <label for="${fieldName}_${optionId}" style="font-size: 14px;">${option.label}</label>
                            <select id="situacao_${optionId}" name="nova_situacao" class="small-select" style="margin-left: 10px;">
                                <option value="em desenvolvimento">Em Desenvolvimento</option>
                                <option value="proposto">Proposto</option>
                                <option value="aprovado">Aprovado</option>
                                <option value="implementado">Implementado</option>
                            </select>
                            <button type="button" class="custom-add-btn" style="margin-left: 10px;" onclick="atualizarSituacaoLei(${optionId}, document.getElementById('situacao_${optionId}').value, '${fieldName}')">Atualizar Situação</button>
                        </div>
                    `;
                });

                indicadoresDiv.innerHTML += `
                    <div>
                        <h3>Selecione a lei relacionada à atividade:</h3>
                        <h5>Se precisar atualizar a situação de uma lei: escolha a nova situação, clique em 'Atualizar Situação' e depois selecione a lei para relacioná-la ao registro de atividade!</h5>
                    </div>
                    <div>
                        <label>${field.label}:</label>
                        ${optionsHTML}
                        <h3>Não encontrou a Lei que deseja relatar?</h3>
                        <h5>Adicione uma nova logo abaixo:</h5>
                        <input type="text2" id="${fieldName}_new_nome" placeholder="Nome da Lei">
                        <select id="${fieldName}_new_tipo" class="small-select">
                            <option value="">Selecione o Tipo</option>
                            <option value="PGTA">PGTA</option>
                        </select>
                        <select id="${fieldName}_new_situacao" class="small-select">
                            <option value="">Selecione a Situação</option>
                            <option value="em desenvolvimento">Em Desenvolvimento</option>
                            <option value="proposto">Proposto</option>
                            <option value="aprovado">Aprovado</option>
                            <option value="implementado">Implementado</option>
                        </select>
                        <button type="button" class="custom-add-btn" id="${fieldName}_add_btn">Adicionar Nova Lei</button>
                    </div>
                `;

                setTimeout(function() {
                    const addButton = document.getElementById(`${fieldName}_add_btn`);
                    if (addButton) {
                        addButton.addEventListener('click', function() {
                            const nome = document.getElementById(`${fieldName}_new_nome`).value;
                            const tipo = document.getElementById(`${fieldName}_new_tipo`).value;
                            const situacao = document.getElementById(`${fieldName}_new_situacao`).value;

                            if (nome && tipo && situacao) {
                                adicionarNovaLei(nome, tipo, situacao, fieldName);
                            } else {
                                alert('Preencha todos os campos.');
                            }
                        });
                    }
                }, 500);
            }

            window.atualizarSituacaoLei = function(leiId, novaSituacao, fieldName) {
                fetch(getAtualizarSituacaoLeiUrl(), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie('csrftoken')
                    },
                    body: JSON.stringify({ lei_id: leiId, situacao: novaSituacao })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const label = document.querySelector(`#${fieldName}_${leiId} + label`);
                        if (label) {
                            const currentLabel = label.innerText;
                            const newLabel = currentLabel.replace(/( - )(.*)$/, ` - ${novaSituacao}`);
                            label.innerText = newLabel;
                        }
                    }
                })
                .catch(error => {
                    console.error("Erro ao realizar a requisição", error);
                });
            }

            function adicionarNovaLei(nome, tipo, situacao, fieldName) {
                fetch(getAdicionarLeiUrl(), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie('csrftoken')
                    },
                    body: JSON.stringify({ nome: nome, tipo: tipo, situacao: situacao })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.id) {
                        console.log("Nova lei adicionada com sucesso", data);
                        const newCheckboxHTML = `
                            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                <input type="checkbox" id="${fieldName}_${data.id}" name="${fieldName}" value="${data.id}" style="margin-right: 5px;" checked>
                                <label for="${fieldName}_${data.id}" style="font-size: 14px;">${data.nome} - ${data.tipo} - ${data.situacao}</label>
                            </div>
                        `;
                        document.querySelector(`#${fieldName}_new_nome`).insertAdjacentHTML('beforebegin', newCheckboxHTML);
                        document.getElementById(`${fieldName}_new_nome`).value = '';
                        document.getElementById(`${fieldName}_new_tipo`).value = '';
                        document.getElementById(`${fieldName}_new_situacao`).value = '';
                    } else {
                        console.error("Erro ao adicionar nova lei", data);
                    }
                })
                .catch(error => {
                    console.error('Erro ao realizar a requisição:', error);
                });
            }

            function renderTextareaField(field, fieldName, indicadoresDiv) {
                indicadoresDiv.innerHTML += `
                    <div class="form-group">
                        <label for="${fieldName}">${field.label}:</label>
                        <textarea id="${fieldName}" name="${fieldName}" class="form-control"></textarea>
                    </div>
                `;
            }

            function renderModelosField(field, fieldName, indicadoresDiv) {
                console.log('Renderizando campo de Modelos...');
                let optionsHTML = '';
                field.options.forEach(option => {
                    optionsHTML += `
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <input type="checkbox" id="${fieldName}_${option.value}" name="${fieldName}" value="${option.value}" class="modelo-checkbox" style="margin-right: 5px;">
                            <label for="${fieldName}_${option.value}" style="font-size: 14px;">${option.label}</label>
                        </div>
                    `;
                });

                indicadoresDiv.innerHTML += `
                    <div>
                        <h3>Selecione o modelo relacionado à atividade:</h3>
                    </div>
                    <div>
                        <label>${field.label}:</label>
                        ${optionsHTML}
                        <h3>Não encontrou o Modelo que deseja relatar?</h3>
                        <h5>Adicione um novo logo abaixo:</h5>
                        <input type="text2" id="${fieldName}_new_nome" placeholder="Novo Modelo">
                        <button type="button" class="custom-add-btn" id="${fieldName}_add_btn">Adicionar Novo Modelo</button>
                    </div>
                `;

                // Associar o evento de clique ao botão após ele ser inserido no DOM
                setTimeout(function() {
                    const addButton = document.getElementById(`${fieldName}_add_btn`);
                    if (addButton) {
                        addButton.addEventListener('click', function() {
                            const nome = document.getElementById(`${fieldName}_new_nome`).value;

                            if (nome) {
                                adicionarNovoModelo(nome, fieldName);
                            } else {
                                alert('Preencha o nome do modelo.');
                            }
                        });
                    }
                }, 500);
            }

            function adicionarNovoModelo(nome, fieldName) {
                fetch(getAdicionarModeloUrl(), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie('csrftoken')
                    },
                    body: JSON.stringify({ nome: nome })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.id) {
                        console.log("Novo modelo adicionado com sucesso", data);
                        // Adiciona o novo modelo na lista de checkboxes
                        const newCheckboxHTML = `
                            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                <input type="checkbox" id="${fieldName}_${data.id}" name="${fieldName}" value="${data.id}" class="modelo-checkbox" style="margin-right: 5px;" checked>
                                <label for="${fieldName}_${data.id}" style="font-size: 14px;">${data.nome}</label>
                            </div>
                        `;
                        document.querySelector(`#${fieldName}_new_nome`).insertAdjacentHTML('beforebegin', newCheckboxHTML);
                        document.getElementById(`${fieldName}_new_nome`).value = '';
                    } else {
                        console.error("Erro ao adicionar novo modelo");
                    }
                })
                .catch(error => {
                    console.error('Erro ao realizar a requisição:', error);
                });
            }

            document.addEventListener('change', function(event) {
                if (event.target.classList.contains('modelo-checkbox')) {
                    const modeloId = event.target.value;
                    const fieldName = event.target.name;
                    if (event.target.checked) {
                        // Renderizar o campo de status para este modelo
                        renderStatusField(modeloId, fieldName);
                    } else {
                        // Remover o campo de status para este modelo
                        removeStatusField(modeloId);
                    }
                }
            });

            function renderStatusField(modeloId, fieldName) {
                const statusOptions = [
                    {"value": "Em desenvolvimento/proposto", "label": "Em desenvolvimento/proposto"},
                    {"value": "Implementação ativa", "label": "Implementação ativa"},
                    {"value": "Difundido (modelo adotado em outro lugar)", "label": "Difundido (modelo adotado em outro lugar)"},
                ];

                let optionsHTML = '';
                statusOptions.forEach(option => {
                    optionsHTML += `<option value="${option.value}">${option.label}</option>`;
                });

                const statusFieldHTML = `
                    <div class="form-group" id="status_modelo_${modeloId}">
                        <label for="status_${modeloId}">Status do Modelo Selecionado:</label>
                        <select id="status_${modeloId}" name="status_modelo_${modeloId}" class="form-control">
                            <option value="">Selecione um status</option>
                            ${optionsHTML}
                        </select>
                    </div>
                `;

                // Adicionar o campo após a lista de modelos
                const indicadoresDiv = document.getElementById('indicadores');
                indicadoresDiv.insertAdjacentHTML('beforeend', statusFieldHTML);
            }

            function removeStatusField(modeloId) {
                const statusField = document.getElementById(`status_modelo_${modeloId}`);
                if (statusField) {
                    statusField.remove();
                }
            }

            function normalizeString(str) {
                return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            }
    // Carregamento dos indicadores e suas respectivas opções
    document.getElementById('id_atividade').addEventListener('change', function() {
        const url = loadindicadoresUrl + "?atividade=" + this.value;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const indicadoresDiv = document.getElementById('indicadores');
                indicadoresDiv.innerHTML = ''; // Limpar indicadores anteriores

                data.forEach(item => {
                    const indicadorKey = normalizeString(item.nome).toLowerCase().replace(/ /g, "_");

                    indicadoresDiv.innerHTML += `<div class="indicator-section"><h3>${item.nome}</h3>`;

                    if (indicadoresConfig[indicadorKey]) {
                        indicadoresConfig[indicadorKey].forEach(field => {
                            const fieldName = `indicadores_${item.id}_${field.name}`;
                            if (field.type === 'number' || field.type === 'text') {
                                let stepAttribute = '';
                                        let langAttribute = '';
                                        if (field.type === 'number') {
                                            if (field.step) {
                                                stepAttribute = `step="${field.step}"`;
                                                // Se o step inclui ponto, definimos o lang para 'en' para garantir que o separador decimal seja o ponto
                                                if (field.step.includes('.')) {
                                                    langAttribute = `lang="en"`;
                                                }
                                            }
                                        }
                                indicadoresDiv.innerHTML += `
                                    <div>
                                        <label>${field.label}:</label>
                                        <input type="${field.type}" name="${fieldName}" placeholder="${field.label}" ${stepAttribute} ${langAttribute}>
                                    </div>
                                `;
                            } else if (field.type === 'textarea') {
                                renderTextareaField(field, fieldName, indicadoresDiv);
                            } else if (field.type === 'select') {
                                let optionsHTML = '';
                                field.options.forEach(option => {
                                    optionsHTML += `
                                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                            <input type="radio" id="${fieldName}_${option.value}" name="${fieldName}" value="${option.value}" style="margin-right: 5px;">
                                            <label for="${fieldName}_${option.value}" style="font-size: 14px;">${option.label}</label>
                                        </div>
                                    `;
                                });
                                indicadoresDiv.innerHTML += `
                                    <div>
                                        <label>${field.label}:</label>
                                        ${optionsHTML}
                                    </div>
                                `;
                            } else if (field.type === 'checkbox' && indicadorKey === 'parcerias') {
                                alert("Renderizando Parcerias.");
                                renderParceriasField(field, fieldName, indicadoresDiv);
                            } else if (field.type === 'checkbox' && indicadorKey === 'produtos') {
                                alert("Renderizando Produtos.");
                                renderProdutosField(field, fieldName, indicadoresDiv);
                            } else if (field.type === 'checkbox' && indicadorKey === 'contratos') {
                                alert("Renderizando Contratos.");
                                renderContratosField(field, fieldName, indicadoresDiv);
                            } else if (field.type === 'checkbox' && indicadorKey === 'planos') {
                                renderPlanosField(field, fieldName, indicadoresDiv);
                            } else if (field.type === 'checkbox' && indicadorKey === 'leis') {
                                renderLeisField(field, fieldName, indicadoresDiv);
                            } else if (field.type === 'checkbox' && indicadorKey === 'modelos') {
                                renderModelosField(field, fieldName, indicadoresDiv);
                            } else if (field.type === 'checkbox') {
                                renderCheckboxField(field, fieldName, indicadoresDiv);
                            }
                        });
                    } else {
                        console.error(`Indicador key '${indicadorKey}' not found in indicadoresConfig`);
                    }

                    indicadoresDiv.innerHTML += `</div>`; // Fechar a seção do indicador
                });

                // Validar campos de indicadores
                applyValidationToIndicators();
            })
            .catch(error => console.error('Erro ao carregar indicadores:', error));
    });

    // Função de validação
    function applyValidationToIndicators() {
        const fields = document.querySelectorAll('#indicadores input[type="number"], #indicadores input[type="text"], #indicadores select');
        fields.forEach(field => {
            field.classList.add('invalid'); // Inicialmente inválido

            field.addEventListener('input', function() {
                const value = field.value.trim();
                if (field.type === 'number') {
                    if (value === "" || isNaN(Number(value))) {
                        field.classList.remove('valid');
                        field.classList.add('invalid');
                    } else {
                        field.classList.remove('invalid');
                        field.classList.add('valid');
                    }
                } else if (field.type === 'text' || field.type === 'radio') {
                    if (value === "") {
                        field.classList.remove('valid');
                        field.classList.add('invalid');
                    } else {
                        field.classList.remove('invalid');
                        field.classList.add('valid');
                    }
                }
            });
        });
    }

});

