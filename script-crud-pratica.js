const botaoAdicionarTarefa = document.querySelector(".app__button--add-task");
const formularioAdicionarTarefa = document.querySelector(".app__form-add-task");
const textAreaFormTarefa = document.querySelector(".app__form-textarea");
const listaDesordenadaTarefa = document.querySelector(".app__section-task-list");
const botaoCancelarTarefa = document.querySelector(".app__form-footer__button--cancel");
const paragrafoTarefaSelecionada = document.querySelector(".app__section-active-task-description")
const botaoRemoverTarefasConcluidas = document.querySelector("#btn-remover-concluidas");
const botaoRemoverTodasTarefas = document.querySelector("#btn-remover-todas");
/*
    Lista de tarefas a serem armazenados.
    Se localStorage.getItem('tarefas') returnar algo diferente de um array ex: null, undefined passamos um array vazio.
*/
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

let tarefaSelecionada = null;
let itemListaSelecionada = null;

/*          FUNCÕES         */

function atualizaTarefas(){
    /**
     * Armazenando os dados com localStorage
     * Onde é necessario utilização da api JSON para que o objeto seja transformado em String e depois convertido novamente em objeto.
     */
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criaElementetoItemTarefa(tarefa){
    const itemLista = document.createElement('li');
    itemLista.classList.add('app__section-task-list-item');

    const svgCheck = document.createElement('svg');
    svgCheck.innerHTML = `    
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>  
    `

    const paragrafoDescricao = document.createElement('p');
    paragrafoDescricao.classList.add('app__section-task-list-item-description');
    paragrafoDescricao.textContent = tarefa.descricao;

    const botaoEditar = document.createElement('button');
    botaoEditar.classList.add('app_button-edit');

    
    const imagemEditar = document.createElement('img');
    imagemEditar.setAttribute('src', "/imagens/edit.png");
    
    botaoEditar.onclick = () => {
        //debugger
        console.log("teste")
        const descricaoAtualizada =  prompt(`Digite a tarefa que substituira a tarefa : ${tarefa.descricao}`);
        if(descricaoAtualizada){
            paragrafoDescricao.textContent = descricaoAtualizada; //Atualizando a parte vizual
            tarefa.descricao = descricaoAtualizada; //Atualizando nossa base de dados
            atualizaTarefas();
        }
        return
    }

    if(tarefa.atividadeConcluida){
        itemLista.classList.add('app__section-task-list-item-complete');
        botaoEditar.setAttribute('disabled', 'disabled');
    }else{
        itemLista.onclick = () => {
    
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(item => {
                    item.classList.remove('app__section-task-list-item-active')
                })
    
            if(tarefaSelecionada == tarefa){
                itemLista.classList.remove('app__section-task-list-item-active');
                tarefaSelecionada = null;
                itemListaSelecionada = null;
                paragrafoTarefaSelecionada.textContent = '';
                return;
            }
            itemLista.classList.add('app__section-task-list-item-active');
            paragrafoTarefaSelecionada.textContent = tarefa.descricao;
            tarefaSelecionada = tarefa;
            itemListaSelecionada = itemLista;
        }
    }
    botaoEditar.append(imagemEditar);

    itemLista.append(svgCheck);
    itemLista.append(paragrafoDescricao);
    itemLista.append(botaoEditar);

    return itemLista;

}

function exibeItemTarefa(tarefa){
    const elemetoItemTarefa =  criaElementetoItemTarefa(tarefa);
    listaDesordenadaTarefa.append(elemetoItemTarefa);
}

function limpaOcultaForm(){
    formularioAdicionarTarefa.classList.add('hidden');
    textAreaFormTarefa.value = '';
}

const removerTarefas = (somenteCompletas) => {
    
    let seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
    
    /*
    *   Camada de Visualização
    */
    document.querySelectorAll(seletor)
        .forEach(tarefa => {
                    tarefa.remove()
        })
    

    /**
        Camada de Dados
     */    
    
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.atividadeConcluida) : []

    atualizaTarefas();
};

/*          OUVINTES         */

/*
    Ao clicar no botao Adicionar Tarefa, ele exibe ou esconde o formulario.
*/
botaoAdicionarTarefa.addEventListener('click', () => {
    /*
        toggle faz com que se o elemento contem a classe hidden ele retira, caso contrario ele adiciona.
    */
    formularioAdicionarTarefa.classList.toggle('hidden');
});

/*
    Quando Submetermos o formulario será execultado o que estiver dentro da função.
*/
formularioAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();    

    /*
     *  Objeto
     */
    const tarefa = {
        descricao: textAreaFormTarefa.value
    }

    /**
     * Adiciona objeto na lista de tarefas.
     */
    tarefas.push(tarefa);
    exibeItemTarefa(tarefa)

    atualizaTarefas();

    textAreaFormTarefa.value = '';
    formularioAdicionarTarefa.classList.add('hidden')

});

document.addEventListener('FocoFinalizado', () => {
    //debugger
    if(itemListaSelecionada && tarefaSelecionada){
        itemListaSelecionada.classList.remove('app__section-task-list-item-active');
        itemListaSelecionada.classList.add('app__section-task-list-item-complete');
        itemListaSelecionada.querySelector('.app_button-edit').setAttribute('disabled', 'disabled');        
        tarefaSelecionada.atividadeConcluida = true;
        atualizaTarefas();
    }
});

botaoRemoverTarefasConcluidas.onclick = () => removerTarefas(true);
botaoRemoverTodasTarefas.onclick = () => removerTarefas(false);

botaoCancelarTarefa.onclick = limpaOcultaForm;
/*  
-------------------------------------------------------------------
*/

/**
 * Estamos percorrendo a lista de tarefas e para cada tarefa estamos criando um itemTarefa.
 */
tarefas.forEach(tarefa => {
    exibeItemTarefa(tarefa)
});