import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { redirect, useParams } from 'react-router-dom'

const VerifyAccountPage = () => {
    const { token } = useParams();
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            const verifyEmail = async () => {
                try {
                    const res = await axios.post("http://localhost:3001/api/v2/user/verify-user", { verificationToken: `${token}` });
                    console.log(res.data.message);
                    setError(false);
                    redirect('/');
                } catch (error: any) {
                    console.log(error.response.data.error);
                    setError(true);
                }
            }

            verifyEmail();
        }
    }, [token])


    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {error ? (
                <p>Your token is expired!</p>
            ) : (
                <p>Your account has been created suceessfully!</p>
            )}
        </div>
    )
}

export default VerifyAccountPage