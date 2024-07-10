import { useState } from 'react'
import {app} from '../utils/firebase.js'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { Button, Alert } from "flowbite-react"
import { AiFillGoogleCircle } from 'react-icons/ai'
import { IoCloseCircleOutline } from "react-icons/io5"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"

import { useDispatch } from'react-redux'
import { oAuth } from '../store/userSlice.js'
 
  const OAuth = ({ btnStatus, btnStatusSU }) => {
    const dispatch = useDispatch()  
    const [successMessage, setSuccessMessage] = useState('') 
    const [errorMessage, setErrorMessage] = useState('') 

      console.log('signIn: ', btnStatus)
      console.log('signup: ', btnStatusSU)


    const handleGoogleClick = async () => {
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
    
        try {
            setErrorMessage('')
            setSuccessMessage('')
            const resultFromGoogle = await signInWithPopup(auth, provider)
            const userData = resultFromGoogle._tokenResponse
            console.log(userData)
            dispatch(oAuth(userData))
            .then((data) => {
                setSuccessMessage(data.payload.message) 
            })
            .catch((error) => {
                setErrorMessage(error)
            })
        } catch (error) {
            setErrorMessage('Error, Please check your internet connection and try again.')
        }
    }

    return ( 
        <>
            <Button gradientDuoTone="pinkToOrange" outline type='button' onClick={handleGoogleClick} disabled={ btnStatus || btnStatusSU =="loading" } >
                <AiFillGoogleCircle fontSize={20} className='mr-2' />
                Continue with Google
            </Button>

            {successMessage && (
                <Alert color="success" icon={IoIosCheckmarkCircleOutline} className='mt-5'>
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert color="failure" icon={IoCloseCircleOutline} className='mt-5'>
                    {errorMessage}
                </Alert>
            )}

        </>
    )
}

export default OAuth