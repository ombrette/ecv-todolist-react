import React from "react";

const TodoList = props => {
  const isEmpty = !!props.todos && props.todos.length === 0;
  return (
    <ul>
      {isEmpty && (
        <li>
          <span>No element! Try creating one!</span>
        </li>
      )}
      {!!props.todos && props.todos.map((item, index) => {
        return <li key={index}>{item}</li>;
      })}
    </ul>
  );
};

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',  
      todolist_original: [],
      todolist: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleAll = this.handleAll.bind(this);
    this.handleCompleted = this.handleCompleted.bind(this);
    this.handleUncompleted = this.handleUncompleted.bind(this);

    const url = 'https://api.myjson.com/bins/9l2ez';

    fetch(url).then((resp) => resp.json())
    .then((data)=>{
      let todos = data.todos.map((item, index) => {
        let item_class
        if(item.complete){
          item_class = "complete";
        }else{
          item_class = "uncomplete";
        }
        return(<span id={index} onClick={this.handleClick} className={item_class}>{item.label}</span>)
      });
      this.setState({ todolist_original: todos });
      this.setState({ todolist: todos });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let new_todo = <span id={this.state.todolist.length} className='uncomplete' onClick={this.handleClick}>{this.state.value}</span>;
    this.setState({todolist_original: [...this.state.todolist_original, new_todo] });
    this.setState({todolist: [...this.state.todolist_original, new_todo] });
  }

  handleClick(event) {
    let status = this.state.todolist_original[event.target.id].props.className
    if(status === 'complete'){
      this.state.todolist_original[event.target.id] = <span id={event.target.id} className='uncomplete' onClick={this.handleClick}>{event.target.innerText}</span>
    }else{
      this.state.todolist_original[event.target.id] = <span id={event.target.id} className='complete' onClick={this.handleClick}>{event.target.innerText}</span>
    }

    this.setState({todolist: this.state.todolist_original});
    // event.target.classList.toggle('complete');
  }

  handleAll(event) {
    this.setState({todolist: this.state.todolist_original});
  }

  handleCompleted(event) {
    let completed_todos = this.state.todolist_original.filter((item) => {
        if(item.props.className === 'complete'){
          return(<span onClick={this.handleClick} className='complete'>{item.label}</span>)
        }
      });
    this.setState({todolist: completed_todos});
  }

  handleUncompleted(event) {
    let uncompleted_todos = this.state.todolist_original.filter((item) => {
        if(item.props.className === 'uncomplete'){
          return(<span onClick={this.handleClick} className='uncomplete'>{item.label}</span>)
        }
      });
    this.setState({todolist: uncompleted_todos});
  }

  render() {
    return (
      <div>
        <h1>TODO LIST</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          <input type="submit" value="Ajouter" />
        </form>
        <TodoList todos={this.state.todolist} />
        <div>
          <p> Filtres
            <button onClick={this.handleAll}>Tous</button>
            <button onClick={this.handleCompleted}>Terminé</button>
            <button onClick={this.handleUncompleted}>A faire</button>
          </p>
        </div>
      </div>
    );
  }
}

export default Todo;
