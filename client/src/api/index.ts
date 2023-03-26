import axios from 'axios'

export const $apiAuth = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

$apiAuth.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

$apiAuth.interceptors.response.use(
  (config) => config,
  (error) => {
    if (error.response.status === 401) window.localStorage.removeItem('token')
    throw error
  }
)

export const $api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})
