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
        fetch(adicionarParceriaUrl, {
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
        fetch(atualizarSituacaoPlanoUrl, {
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

    // Carregamento dos indicadores e suas respectivas opções
    document.getElementById('id_atividade').addEventListener('change', function() {
        const url = loadindicadoresUrl + "?atividade=" + this.value;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const indicadoresDiv = document.getElementById('indicadores');
                indicadoresDiv.innerHTML = ''; // Limpar indicadores anteriores

                data.forEach(item => {
                    const indicadorKey = item.nome.toLowerCase().replace(" ", "_");

                    indicadoresDiv.innerHTML += `<div class="indicator-section"><h3>${item.nome}</h3>`;

                    if (indicadoresConfig[indicadorKey]) {
                        indicadoresConfig[indicadorKey].forEach(field => {
                            const fieldName = `indicadores_${item.id}_${field.name}`;
                            if (field.type === 'number' || field.type === 'text') {
                                indicadoresDiv.innerHTML += `
                                    <div>
                                        <label>${field.label}:</label>
                                        <input type="${field.type}" name="${fieldName}" placeholder="${field.label}">
                                    </div>
                                `;
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
                            } else if (field.type === 'checkbox' && indicadorKey === 'planos') {
                                renderPlanosField(field, fieldName, indicadoresDiv);
                            } else if (field.type === 'checkbox') {
                                renderCheckboxField(field, fieldName, indicadoresDiv);
                            }
                        });
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