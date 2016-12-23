var TodoBox = React.createClass({
    getInitialState: function() {
        return {
            data: [
                {
                    "id": "0001",
                    "task": "吃饭",
                    "complete": "false"
                }, {
                    "id": "0002",
                    "task": "睡觉",
                    "complete": "false"
                }, {
                    "id": "0003",
                    "task": "打豆豆",
                    "complete": "true"
                }
            ]
        }
    },

    // 根据id删除一项任务
    handleTackDelete: function(taskId){
        var data = this.state.data;
        data = data.filter(function (task) {
            return task.id !== taskId
        })
        this.setState({data});
    },

    // 切换一项任务的完成状态
    handleToggleComplete: function(taskId){
        var data = this.state.data;
        for (var i in data) {
            if(data[i].id === taskId){
                data[i].complete = data[i].complete === 'true' ? 'false' : 'true';
                break
            }
        }
        this.setState({data});
    },

    // 给新增的任务一个随机的id
    generateId: function(){
        return Math.floor(Math.random() * 9000) + 1000;
    },

    // 新增一项任务
    handleSubmit:function(task){
        var data = this.state.data;
        var id = this.generateId();
        data = data.concat([{'id':id, 'task': task, 'complete': 'false'}]);
        this.setState({
            data
        });
    },

    render: function() {
        var statistics = {
            // 统计任务总数 及 完成的数量
            todoCount: this.state.data.length || 0,
            todoCompleteCount: this.state.data.filter(function (item) {
                return item.complete === 'true';
            }).length
        }

        return (
            <div className="well">
                <h1 className="text-center">React Todo</h1>
                <TodoList data={this.state.data}
                    deleteTask={this.handleTackDelete}
                    toggleComplete={this.handleToggleComplete}
                    todoCount={statistics.todoCount}
                    todoCompleteCount = {statistics.todoCompleteCount} />
                <TodoForm submitTask={this.handleSubmit}/>
            </div>
        )
    }
})

var TodoList = React.createClass({
    render() {
        var taskList = this.props.data.map(function(listItem){
            return (
                <TodoItem
                    taskId={listItem.id}
                    key={listItem.id}
                    task={listItem.task}
                    complete={listItem.complete}
                    deleteTask={this.props.deleteTask}
                    toggleComplete={this.props.toggleComplete}/>

            )
        },this) //this

        return (
            <ul className="list-group">
                {taskList}
                <TodoFooter
                    todoCount={this.props.todoCount}
                    todoCompleteCount={this.props.todoCompleteCount}/>
            </ul>
        )
    }
})

var TodoItem = React.createClass({
    toggleComplete: function(){
        this.props.toggleComplete(this.props.taskId)
    },

    deleteTask: function(){
        this.props.deleteTask(this.props.taskId);
    },

    // 鼠标移入显示删除按钮
    handleMounseOver: function(){
        ReactDOM.findDOMNode(this.refs.deleteBtn).style.display = 'inline';
    },

    handleMounseOut: function(){
        ReactDOM.findDOMNode(this.refs.deleteBtn).style.display = 'none';
    },

    render() {
        var task = this.props.task;
        var classes = 'list-group-item';
        var itemChecked = false;

        if(this.props.complete === 'true'){
            task = <s>{task}</s>
            classes += ' list-group-item-success'

            itemChecked = true;
        }

        return (
            <li className={classes}
                onMouseOver={this.handleMounseOver}
                onMouseOut={this.handleMounseOut}>
                <input type="checkbox" className='pull-left'
                    checked={itemChecked}
                    onChange={this.toggleComplete}></input>
                {task}
                <div className="pull-right">
                    <button className="btn btn-xs close"
                        ref='deleteBtn'
                        onClick={this.deleteTask}>删除</button>
                </div>
            </li>
        )
    }
})

var TodoFooter = React.createClass({

    render: function() {
        return (
            <li className='list-group-item'>
                {this.props.todoCompleteCount}已完成 / {this.props.todoCount}总数
            </li>
        );
    }
});

var TodoForm = React.createClass({
    submitTask: function(e){
        e.preventDefault();
        var task = ReactDOM.findDOMNode(this.refs.task).value.trim();
        if(!task) {
            return;
        }
        this.props.submitTask(task);
        ReactDOM.findDOMNode(this.refs.task).value = "";
    },

    render: function() {
        return (
            <div>
                <hr/>
                <form className='form-horizontal'
                    onSubmit={this.submitTask}>
                    <div className='form-group'>
                        <label for='task' className='col-md-2 control-label'>Task</label>
                        <div className='col-md-10'>
                            <input ref="task" type='text' id='task' className='form-control' placeholder='你想做点什么'></input>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12 text-right'>
                            <input type='submit' value='Save Task' className='btn btn-primary'></input>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
});

ReactDOM.render(
    <TodoBox/>, document.getElementById('todoBox'));
