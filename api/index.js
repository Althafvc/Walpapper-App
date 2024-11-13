const API_KEY = '46946206-29fd2c697756ae416a4ca4480';
const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;
import axios from "axios"

const formatUrl = (params)=> {
    let url = apiUrl + "&per_page=25&safesearch=true&editors_choice=true"

    if(!params) return url;

    let paramKeys = Object.keys(params)
    paramKeys.map (key=> {
        let value = key  =='q' ? encodeURIComponent(params[key]) : params[key]
        url += `&${key}=${value}`;
    })

    return url
    
}

export const apiCall = async (params) => {

    try {
        const response = await axios.get(formatUrl(params))
        return { success: true, data: response.data };
    }catch(err) {
        console.log('error occured', err.message);
        return {success:false, msg:err.message}
        
    }

}