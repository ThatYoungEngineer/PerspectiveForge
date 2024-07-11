import { useState } from 'react'
import {app} from '../utils/firebase.js'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { Button, Alert, Spinner } from "flowbite-react"
import { AiFillGoogleCircle } from 'react-icons/ai'
import { IoCloseCircleOutline } from "react-icons/io5"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"

import { useDispatch } from'react-redux'
import { oAuth } from '../store/userSlice.js'
 
  const OAuth = (props) => {
    const dispatch = useDispatch()  
    const [successMessage, setSuccessMessage] = useState('') 
    const [errorMessage, setErrorMessage] = useState('') 
    const [btnDisable, setBtnDisable] = useState('')

    const handleGoogleClick = async () => {
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
    
        try {
            // setErrorMessage('')
            // setSuccessMessage('')
            props.getSignUpError("")
            props.getSignUpSuccess("")
            setBtnDisable('disabled')
            props.getAuthBtnDisabled('disabled')
            const resultFromGoogle = await signInWithPopup(auth, provider)
            const userData = resultFromGoogle._tokenResponse
            dispatch(oAuth(userData))
            .then((data) => {
                // setSuccessMessage(data.payload.message)
                props.getSignUpSuccess(data.payload.message)
            })
            .catch((error) => {
                // setErrorMessage(error)
                props.getSignUpError(error)
            })
            setBtnDisable('')
        } catch (error) {
            console.error(error)
            if (error.message.includes('popup-closed-by-user')) {
                // setErrorMessage('Please try again!')
                props.getSignUpError('Please try again!')
            } else {
                // setErrorMessage('Error! Please check your internet connection and try again.')
                props.getSignUpError('Error! Please check your internet connection and try again.')
            }
            setBtnDisable('')
            props.getAuthBtnDisabled('')
        }
    }

    return ( 
        <>
            <Button gradientDuoTone="pinkToOrange" outline type='button' onClick={handleGoogleClick} disabled={ btnDisable === "disabled" } >
                {btnDisable === "disabled" 
                ? <Spinner />
                : (
                    <>
                        <AiFillGoogleCircle size={20} className='mr-2' />
                        Continue with Google    
                    </>
                )}
            </Button>

            {successMessage && (
                <Alert color="success" icon={IoIosCheckmarkCircleOutline} className=''>
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert color="failure" icon={IoCloseCircleOutline} className=''>
                    {errorMessage}
                </Alert>
            )}

        </>
    )
}

export default OAuth