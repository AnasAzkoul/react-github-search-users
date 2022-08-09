import React, {useState, useEffect, createContext, useContext} from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

export const GithubContext = createContext(); 

export const GithubProvider = ({children}) => {
  const [githubUser, setGithubUser] = useState(mockUser); 
  const [repos, setRepos] = useState(mockRepos); 
  const [followers, setFollowers] = useState(mockFollowers); 
  // request loading 
  const [requests, setRequests] = useState(0); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState({show: false, msg: ''}); 
  
  const SearchGithubUser = async (user) => {
    toggleError()
    setIsLoading(true)
    const response = await axios(`${rootUrl}/users/${user}`)
      .catch(error => console.log(error)); 
    if (response) {
      setGithubUser(response.data);
      const {login, followers_url} = response.data
      
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`)
      ])
        .then(result => {
          const [repos, followers] = result;
          const status = 'fulfilled';
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch(error => console.log(error))
      
    } else {
      toggleError(true, 'There is no user with that username'); 
    }
    checkRequest(); 
    setIsLoading(false); 
  }
  
  
  // checkRate_limit
  const checkRequest = () => {
    axios(`${rootUrl}/rate_limit`)
      .then((data) => {
        let {data: {rate: {remaining}}} = data; 
        setRequests(remaining); 
        if (remaining === 0) {
          toggleError(true, 'Sorry, you have exceeded your hourly limit'); 
        }
      })
      .catch((error) => {console.log(error)})
  }
  
  const toggleError = (show = false, msg = '') => {
    setError({show, msg}); 
  }
  
  useEffect(checkRequest, [])
  
  
  
  const value = {
    githubUser, 
    repos, 
    followers, 
    requests, 
    isLoading, 
    error, 
    SearchGithubUser
  }
  
  return (
    <GithubContext.Provider value={value}>
      {children}
    </GithubContext.Provider>
  )
}

export const useGlobalContext = () => {
  return useContext(GithubContext); 
}
