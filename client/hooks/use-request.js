import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {

    const [errors, setErrors] = useState(null);
    const doRequest = async ( props = {} ) => {
        //console.log(`url: ${url}, method: ${method}, body: ${body}`);
        try {
            setErrors(null);
            const options = {
                method,
                url,
                headers: {
                    'content-type': 'application/json',
                },
                data: {
                    ...body,
                    ...props
                },
            };
            const response = await axios(options);
            if(onSuccess){
                onSuccess(response.data);
            }
            return response.data;
            
        }catch (err){
            console.log(err)
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul className="my-0">
                        {err.response.data.map(err => (
                            <li key={err.message}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            );
        }
    };
    return {doRequest, errors};

}