import React from 'react'

class Socket extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            socket:null
        }
    }
    componentDidUpdate(){
        if(this.props.isConnectWS&&this.state.socket==null){
            this.openConnection();
        }
    }
    openConnection = ()=>{
        const {
            url,
            wsObj,
        } = this.props;
        let socket = new WebSocket(url);
        socket.onopen = (data)=>{
            this.onOpen(data)
        };
        socket.onmessage = (data)=>{
            var newData = JSON.parse(data.data);
            this.onMessage(newData)
        };
        this.setState({socket});
    }
    onOpen = (data)=>{
        const {
            props:{
                wsObj
            },
            state:{
                socket
            }
        } = this;
        var loginParam = {
            method:'req_login',
            req_id:'',
            data:{
                user_name:wsObj.account,
                password:wsObj.password,
                protoc_version:wsObj.version
            }
        };
        socket.send(JSON.stringify(loginParam));
    }
    onMessage = (data)=>{
        if(data.error_code==0||data.method=="on_rtn_quote"){
            switch(data.method){
                case 'on_rsp_login':this.login(data.data);break;
                case 'on_rsp_subscribe':this.subscribe(data.data);break;
                case 'on_rtn_quote':this.quote(data.data);break;
            }
        }else{

        }
    }
    //登录成功
    login = (data)=>{
        const {
            props:{
                contractNo
            },
            state:{
                socket
            }
        } = this;
        var subscribeParam={
            method:'req_subscribe',
            req_id:'',
            data:{
                contract_list:[contractNo],
                mode:'MODE_SNAP'
            }
        };
        socket.send(JSON.stringify(subscribeParam));
    }
    //订阅成功
    subscribe = (data)=>{
        console.log(data);
    }
    //推送的行情数据
    quote = (data)=>{
        const{
            onMessage
        }=this.props;
        onMessage(data);
    }
    render(){
        const {
            isConnectWS,
            url,
            wsObj,
            children
        } = this.props;
        return children
    }
}
export default Socket