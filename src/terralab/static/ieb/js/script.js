// Função para obter o valor do cookie com base no nome
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// URLs do backend
document.addEventListener('DOMContentLoaded', function () {
    const urlContainer = document.getElementById('url-container');
    const urlComponentes = urlContainer.getAttribute('data-url-componentes');
    const urlEquipes = urlContainer.getAttribute('data-url-equipes');
    const urlEquipesAdicionais = urlContainer.getAttribute('data-url-equipes-adicionais');
    const urlAtividades = urlContainer.getAttribute('data-url-atividades');
    const urlIndicadores = urlContainer.getAttribute('data-url-indicadores');
    const urlAdicionarParceria = urlContainer.getAttribute('data-url-adicionar-parceria');
    const urlAtualizarSituacaoPlano = urlContainer.getAttribute('data-url-atualizar-situacao-plano');
    const urlAdicionarPlano = urlContainer.getAttribute('data-url-adicionar-plano');

    document.getElementById('id_projeto').addEventListener('change', function () {
        const projetoId = this.value;
        if (projetoId) {
            fetch(`${urlComponentes}?projeto=${projetoId}`)
                .then(response => response.json())
                .then(data => {
                    const select = document.getElementById('id_componente');
                    select.innerHTML = '<option value="">Selecione um componente</option>';
                    data.forEach(item => {
                        select.innerHTML += `<option value="${item.id}">${item.nome}</option>`;
                    });
                });

            fetch(`${urlEquipes}?projeto=${projetoId}`)
                .then(response => response.json())
                .then(data => {
                    const select = document.getElementById('id_equipe_projeto');
                    select.innerHTML = '<option value="">Selecione uma equipe</option>';
                    data.forEach(item => {
                        select.innerHTML += `<option value="${item.id}">${item.nome}</option>`;
                    });
                });

            fetch(`${urlEquipesAdicionais}?projeto=${projetoId}`)
                .then(response => response.json())
                .then(data => {
                    const checkboxGroup = document.getElementById('id_equipe_adicional');
                    checkboxGroup.innerHTML = '';
                    data.forEach(item => {
                        checkboxGroup.innerHTML += `<label><input type="checkbox" name="equipe_adicional" value="${item.id}"> ${item.nome}</label>`;
                    });
                });
        }
    });

    document.getElementById('id_componente').addEventListener('change', function () {
        const componenteId = this.value;
        if (componenteId) {
            fetch(`${urlAtividades}?componente=${componenteId}`)
                .then(response => response.json())
                .then(data => {
                    const select = document.getElementById('id_atividade');
                    select.innerHTML = '<option value="">Selecione uma atividade</option>';
                    data.forEach(item => {
                        select.innerHTML += `<option value="${item.id}">${item.nome}</option>`;
                    });
                });
        }
    });

    document.getElementById('id_atividade').addEventListener('change', function () {
        const atividadeId = this.value;
        if (atividadeId) {
            fetch(`${urlIndicadores}?atividade=${atividadeId}`)
                .then(response => response.json())
                .then(data => {
                    const indicadoresDiv = document.getElementById('indicadores');
                    indicadoresDiv.innerHTML = '';
                    data.forEach(item => {
                        const indicadorKey = normalizeString(item.nome).toLowerCase().replace(/ /g, "_");
                        indicadoresDiv.innerHTML += `<div class="indicator-section"><h3>${item.nome}</h3>`;
                        if (indicadoresConfig[indicadorKey]) {
                            indicadoresConfig[indicadorKey].forEach(field => {
                                const fieldName = `indicadores_${item.id}_${field.name}`;
                                if (field.type === 'number' || field.type === 'text') {
                                    let stepAttribute = '';
                                    let langAttribute = '';
                                    if (field.type === 'number' && field.step) {
                                        stepAttribute = `step="${field.step}"`;
                                        if (field.step.includes('.')) {
                                            langAttribute = `lang="en"`;
                                        }
                                    }
                                    indicadoresDiv.innerHTML += `<div><label>${field.label}:</label><input type="${field.type}" name="${fieldName}" placeholder="${field.label}" ${stepAttribute} ${langAttribute}></div>`;
                                } else if (field.type === 'textarea') {
                                    renderTextareaField(field, fieldName, indicadoresDiv);
                                } else if (field.type === 'checkbox') {
                                    renderCheckboxField(field, fieldName, indicadoresDiv);
                                }
                            });
                        }
                        indicadoresDiv.innerHTML += `</div>`;
                    });
                    applyValidationToIndicators();
                })
                .catch(error => console.error('Erro ao carregar indicadores:', error));
        }
    });

    function normalizeString(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }

    function renderTextareaField(field, fieldName, indicadoresDiv) {
        indicadoresDiv.innerHTML += `<div class="form-group"><label for="${fieldName}">${field.label}:</label><textarea id="${fieldName}" name="${fieldName}" class="form-control"></textarea></div>`;
    }

    function renderCheckboxField(field, fieldName, indicadoresDiv) {
        let optionsHTML = '';
        field.options.forEach(option => {
            optionsHTML += `<div style="display: flex; align-items: center; margin-bottom: 5px;"><input type="checkbox" id="${fieldName}_${option.value}" name="${fieldName}" value="${option.value}" style="margin-right: 5px;"><label for="${fieldName}_${option.value}" style="font-size: 14px;">${option.label}</label></div>`;
        });
        indicadoresDiv.innerHTML += `<div><label>${field.label}:</label>${optionsHTML}</div>`;
    }

    function applyValidationToIndicators() {
        const fields = document.querySelectorAll('#indicadores input[type="number"], #indicadores input[type="text"], #indicadores select');
        fields.forEach(field => {
            field.classList.add('invalid');
            field.addEventListener('input', function () {
                const value = field.value.trim();
                if ((field.type === 'number' && value !== '' && !isNaN(Number(value))) || (field.type === 'text' && value !== '')) {
                    field.classList.remove('invalid');
                    field.classList.add('valid');
                } else {
                    field.classList.remove('valid');
                    field.classList.add('invalid');
                }
            });
        });
    }
});
