import React from "react";
import ReactDom from 'react-dom';

class TodoList extends React.Component {
    constructor(){
        super();
        this.state={
            todos:[],
            isAllChecked:false
        };
    }
    allChecked(){
        let isAllChecked=false;
        if(this.state.todos.every(todo=>todo.isDone)){
            isAllChecked=true;
        }
        this.setState({
            todos:this.state.todos,
            isAllChecked:isAllChecked
        });
    }
    addTodo(todoItem){
        this.state.todos.push(todoItem);
        this.allChecked();
    }
    deleteTodo(index){
        this.state.todos.splice(index,1);
        this.setState({todos:this.state.todos});
    }
    clearDone(){
        let todos=this.state.todos.filter(todo=>!todo.isDone);
        this.setState({
            todos:todos,
            isAllChecked:false
        });
    }
    changeTodoState(index,isDone,isChangeAll=false){
        if(isChangeAll){
            this.setState({
                todos:this.state.todos.map((todo)=>{
                    todo.isDone=isDone;
                    return todo
                }),
                isAllChecked:isDone
            });
        }else{
            this.state.todos[index].isDone=isDone;
            this.allChecked();
        }
    }
    render () {
        let info={
            isAllChecked:this.state.isAllChecked,
            todoCount:this.state.todos.length || 0,
            todoDoneCount:(this.state.todos && this.state.todos.filter((todo)=>todo.isDone)).length || 0
        };
        return (
            <div className="todo-wrap">
                <h2>TodoList</h2>
                <TodoHeader addTodo={this.addTodo.bind(this)}/>
                <TodoMain todos={this.state.todos} deleteTodo={this.deleteTodo.bind(this)} changeTodoState={this.changeTodoState.bind(this)} />
                <TodoFooter {...info} changeTodoState={this.changeTodoState.bind(this)} clearDone={this.clearDone.bind(this)} />
            </div>
        );
    }
}
class TodoHeader extends React.Component {
    handlerKeyUp(e){
        if (e.keyCode===13){
            let value=e.target.value;
            if(!value) return false;
            let newTodoItem={
                text:value,
                isDone:false
            };
            e.target.value='';
            this.props.addTodo(newTodoItem);
        }
    }
    render () {
        return (
            <div className="todo-header">
                <input onKeyUp={this.handlerKeyUp.bind(this)} type="text" placeholder="请输入你的任务名称，按回车键确认" />
            </div>
        );
    }
}
class TodoMain extends React.Component {
    render() {
        if(this.props.todos.length === 0) {
            return (
                <div className="todo-main">恭喜您，目前没有待办任务！</div>
            )
        } else {
            return (
                <ul className="todo-main">
                    {
                        this.props.todos.map((todo, index) => {
                            //{...this.props} 用来传递TodoMain的todos属性和delete、change方法。
                            return <TodoItem text={todo.text} isDone={todo.isDone} index={index} key={index} {...this.props}/>
                        })
                    }
                </ul>
            )
        }
    }
}
class TodoItem extends React.Component {
    handlerChange() {
        let isDone = !this.props.isDone;
        this.props.changeTodoState(this.props.index, isDone);
    }
    handlerMouseOver() {
        ReactDom.findDOMNode(this).style.background = '#eee';
        ReactDom.findDOMNode(this.refs.delButton).style.display = 'inline-block';
    }
    handlerMouseOut() {
        ReactDom.findDOMNode(this).style.background = '#fff';
        ReactDom.findDOMNode(this.refs.delButton).style.display = 'none';
    }
    handlerDelete(){
        this.props.deleteTodo(this.props.index);
    }
    render() {
        let className = this.props.isDone ? 'task-done' : '';
        return (
            <li className="clearfix" onMouseOver={this.handlerMouseOver.bind(this)} onMouseOut={this.handlerMouseOut.bind(this)}>
                <label>
                    <input type="checkbox" checked={this.props.isDone} onChange={this.handlerChange.bind(this)} />
                    <span className={className}>{this.props.text}</span>
                </label>
                <button ref="delButton" className="btn btn-danger" onClick={this.handlerDelete.bind(this)}>删除</button>
            </li>
        )
    }
}
class TodoFooter extends React.Component{
    handlerSelectAll(e){
        this.props.changeTodoState(null,e.target.checked,true);
    }
    handlerDeleteDone(){
        this.props.clearDone();
    }
    render(){
        return(
            <div className="todo-footer">
                <label>
                    <input type="checkbox" checked={this.props.isAllChecked} onChange={this.handlerSelectAll.bind(this)} />全选
                </label>
                <span className="text-success">已完成{this.props.todoDoneCount}</span><span>/全部{this.props.todoCount}</span>
                <button className="btn btn-danger" onClick={this.handlerDeleteDone.bind(this)}>清除全部任务</button>
            </div>
        )
    }
}

export {TodoList};