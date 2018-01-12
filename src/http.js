import axios from 'axios'

export const host = window.location.protocol + '//' + window.location.hostname + ':8000/'
export const HTTP = axios.create({
  baseURL: host,
  headers: {}
})
