import axios from "axios"
const URL = "http://localhost:7795/api"

export const createAccount = async (data:string) => {
 try{
  return await axios.post(`${URL}/register`,data).then((res) => {
    return res.data
  })
 }catch(error){
    return error
 }
}

export const loginAccount = async(data:string) => {
try{
return await axios.post(`${URL}/login`,data).then((res) => {
    return res.data
})
}catch(error){
    return error
}
}

export const verifyAccount = async(data:string) => {
try{
return await axios.post(`${URL}/verify-account`,data).then((res) => {
    return res.data
})
}catch(error){
    return error
}
}