import axios from 'axios';

export default class ApiRequest {
  
  static instance = axios.create({
    baseURL: 'http://52.230.5.59'
  })
  
  static login (id, pw) {
    return new Promise(async (resolve, reject) => {
      try {
        
      }
    })
  }
}