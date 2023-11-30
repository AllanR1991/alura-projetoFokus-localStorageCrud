/*      Selecionando elementos do html      */
const botaoAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textAreaForm = document.querySelector('.app__form-textarea');
const listaDesordenadaTarefas = document.querySelector('.app__section-task-list');
const botaoCancelarTarefa = document.querySelector('.app__form-footer__button--cancel');
const paragrafoTarefaEmAndamento = document.querySelector('.app__section-active-task-description');
const botaoRemoverAticidadeConcluida = document.querySelector('#btn-remover-concluidas');
const botaoRemoverTodasTarefas = document.querySelector('#btn-remover-todas');

/*
    Lista de Tarefas
    Caso "JSON.parse(localStorage.getItem('tarefas') )" retorne null / undefined atribuimos a terafa um array vazio.
*/
let tarefas = JSON.parse(localStorage.getItem('tarefas'))  || [];

let tarefaSelecionada = null;
let itemTarefaSeleciaonada = null;



/*      Funções     */

function atualizarTarefas () {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

function criaItemTarefa (tarefa){
    const itemTarefa = document.createElement('li');
    itemTarefa.classList.add('app__section-task-list-item');

    
    const svgCheck = document.createElement('svg');
    svgCheck.innerHTML = `        
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
    <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>        
    `
    
    const paragrafoDescricaoTarefa = document.createElement('p');
    paragrafoDescricaoTarefa.classList.add('app__section-task-list-item-description');
    paragrafoDescricaoTarefa.textContent = tarefa.descricao;
    
    const botaoEditar = document.createElement('button');
    botaoEditar.classList.add('app_button-edit');
      
    const imgEditar = document.createElement('img');
    imgEditar.setAttribute('src', '/imagens/edit.png');

    botaoEditar.onclick = () =>{
        //debugger
        /**
         * Window.prompt() -> exibe uma caixa de diálogo com uma mensagem opcional solicitando ao usuário a entrada de algum texto
        */
       const novaDescricaoTarefa = prompt(`Digite o nome da tarefa que substituirá a terefa :  ${tarefa.descricao}`);
       //console.log(novaDescricaoTarefa);
       if(novaDescricaoTarefa){
           paragrafoDescricaoTarefa.textContent = novaDescricaoTarefa;
           tarefa.descricao = novaDescricaoTarefa;
           atualizarTarefas();
        }
    }
    
    if(tarefa.atividadeConcluida){
        itemTarefa.classList.add('app__section-task-list-item-complete');
        botaoEditar.setAttribute('disabled', 'disabled');
    }else{
        itemTarefa.onclick = () =>{
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(item => {
                    item.classList.remove('app__section-task-list-item-active');
                });

            if(tarefaSelecionada == tarefa){
                paragrafoTarefaEmAndamento.textContent = '';
                tarefaSelecionada = null;
                itemTarefaSeleciaonada = null;
                return
            }

            tarefaSelecionada = tarefa;
            itemTarefaSeleciaonada = itemTarefa;

            paragrafoTarefaEmAndamento.textContent = tarefa.descricao;
            itemTarefa.classList.add('app__section-task-list-item-active');
        }
    }


    botaoEditar.append(imgEditar);

    itemTarefa.append(svgCheck);
    itemTarefa.append(paragrafoDescricaoTarefa);
    itemTarefa.append(botaoEditar);

    return itemTarefa;
}

function exibeTarefa(tarefa){
    const criaElentoItemTarefa = criaItemTarefa(tarefa);
    listaDesordenadaTarefas.append(criaElentoItemTarefa);
}

function limpaEscondeTarefa(){
    textAreaForm.value = '';
    formAdicionarTarefa.classList.add('hidden');
}

const removerTarefas = (somenteCompleta) => {
    const seletor = somenteCompleta ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
    document.querySelectorAll(seletor)
        .forEach(elemento => {
            elemento.remove();
        })
        tarefas = somenteCompleta ? tarefas.filter(tarefa => !tarefa.atividadeConcluida) : [];
        atualizarTarefas();
}

/*      Ouvintes     */

/*

    Aqui adicionamos um evento do tipo click ao botaoAdicionarTarefa e sempre que clicar sera execultado o codigo que estiver dentro fa arrow function.

    ArrowFunctions => chamamos a formulario e acessamos a classe do formulario, depois colocamos a metodo toggle que alterna, se ja tem a classe ele tira, se não tem ele colaca.

*/
botaoAdicionarTarefa.addEventListener('click', () => {
    
    formAdicionarTarefa.classList.toggle('hidden');

});

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    
    /*
        tarafa recebe um objeto
    */
    const tarefa = {
        descricao: textAreaForm.value
    }

    /*
        adiciona uma tarefa na lista de tarefas;
    */
    tarefas.push(tarefa);
    exibeTarefa(tarefa);

    /*
        LocalStorage não sabe lidar com dados complexos, somente com string.
        como passamos um dados complexo o localStorage tentou converter utilizando to string
        Ex: [{descricao: 'Estudar Ts'}].toString() -> danco como resultado "[object Object]"
        Precisamos de algo que possa converter em string e depois voltar como objeto.
        O qual é a api JSON.JSON.stringify(tarefas) -> passando os dados em string

    */
    atualizarTarefas();

    textAreaForm.value = '';
    formAdicionarTarefa.classList.add('hidden');
});

botaoCancelarTarefa.addEventListener('click',limpaEscondeTarefa);



botaoRemoverAticidadeConcluida.onclick = () => removerTarefas(true);
botaoRemoverTodasTarefas.onclick = () => removerTarefas(false);

document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && itemTarefaSeleciaonada){
        itemTarefaSeleciaonada.classList.remove('app__section-task-list-item-active');
        itemTarefaSeleciaonada.classList.add('app__section-task-list-item-complete');
        itemTarefaSeleciaonada.querySelector('.app_button-edit').setAttribute('disabled', 'disabled');
        tarefaSelecionada.atividadeConcluida = true;
        atualizarTarefas();
    }
});

tarefas.forEach(tarefa => {
    exibeTarefa(tarefa);
})