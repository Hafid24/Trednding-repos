import React, { Component } from 'react'
import axios from 'axios'


const BASE_URL = 'https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      repos:[]
    }

  }
componentDidMount=()=>{
  window.addEventListener('scroll', this.onScroll, false);
  this.getRepositories(1);
} 

onScroll = () => {
  if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight) ) {
    this.setState({
      ...this.state,
      page: this.state.page + 1
    })
    this.getRepositories(this.state.page);
  }
}

getRepositories=(page)=>{
  this.fetchData(page)
  .then(request=>{
    let repositories = this.state.repos;
    repositories = [...repositories, ...request.data.items];
    this.setState({
      repos: repositories
    })
    
  })

}
fetchData=(page)=>{
  let pageString  = (page>1)? (`&page=${page}`):('');
  return new Promise(function(resolve, reject) { 
    const url = `${BASE_URL}${pageString}` 
    const request = axios.get(url) 
    resolve(request); 
  }) 

}

getDays= (date)=>{
  let today = new Date();
  let createdDate = new Date(date);
  return Math.round(Math.abs((today.getTime()-createdDate.getTime())/(1000*60*60*24)));
}


getRepostList=()=>{
  return (this.state.repos.length? (
    this.state.repos.map(repo => {
            let days = this.getDays(repo.created_at)
            return(
                 <div className="row" style={{marginBottom:'10px', marginLeft:'10px'}}>
                   <div className="col-lg-3 col-md-3 col-sm-3">
                     <img src={repo.owner.avatar_url} style={{width:'100px',height:'100px'}} alt="avatar"/>
                   </div>
                   <div className="col-lg-9 col-md-9 col-sm-9">
                    <p style={{fontWeight:'600'}}>{repo.name}</p>
                    <p>{repo.description}</p>
                    <div className="row">
                      <div className="col-lg-2 col-md-2 col-sm-2">
                        <div className="small-box">
                          <p>Stars: {repo.stargazers_count}</p>  
                        </div>
                        
                      </div>
                      <div className="col-lg-2 col-md-2 col-sm-2">
                        <div className="small-box">
                          <p>Issues: {repo.open_issues_count}</p>
                        </div>
                        
                      </div>
                      <div style={{display: 'inline-block'}} className="col-lg-8 col-md-8 col-sm-9 ">
                        <p > Submitted {days} days ago by {repo.owner.login} </p>
                      </div>
                      
                    </div>
                   </div>
                 </div>
            )
    })
    
  ):(<h3>Repositories are loading...</h3>))
}

  render() {
    const  ReposList= this.getRepostList();
    return (
      <div>
       {ReposList}
      </div>
    )
    
  }
}

export default App;
