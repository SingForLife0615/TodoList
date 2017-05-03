
import React,{Component} from "react";
import {render} from "react-dom";
require('./css/index.css');
import {TodoList} from './components/TodoList';


document.addEventListener('DOMContentLoaded',()=>{
    render(<TodoList/>,document.getElementById('content'));
});