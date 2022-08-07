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
  
  
  
  
  const value = {
    githubUser, 
    repos, 
    followers, 
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
